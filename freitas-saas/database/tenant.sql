-- Execute em um banco PostgreSQL EXCLUSIVO por empresa (NÃO no banco central).
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS customers(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, phone text,
 email text, notes text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS vehicles(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_id uuid NOT NULL REFERENCES customers(id),
 plate text NOT NULL UNIQUE, brand text, model text NOT NULL, color text, year integer,
 created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS services(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
 price_cents integer NOT NULL CHECK(price_cents >= 0),
 duration_minutes integer NOT NULL CHECK(duration_minutes > 0),
 active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS staff(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, role text NOT NULL,
 email text, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS appointments(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_id uuid NOT NULL REFERENCES customers(id),
 vehicle_id uuid NOT NULL REFERENCES vehicles(id), service_id uuid NOT NULL REFERENCES services(id),
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
 status text NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','confirmed','arrived','cancelled','done')),
 notes text, created_at timestamptz NOT NULL DEFAULT now(), CHECK(ends_at > starts_at));
CREATE TABLE IF NOT EXISTS orders(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_id uuid NOT NULL REFERENCES customers(id),
 vehicle_id uuid NOT NULL REFERENCES vehicles(id),
 status text NOT NULL DEFAULT 'AWAITING' CHECK(status IN ('AWAITING','INSPECTION','WASHING','QUALITY','READY','DELIVERED','CANCELLED')),
 total_cents integer NOT NULL DEFAULT 0 CHECK(total_cents >= 0),
 paid_cents integer NOT NULL DEFAULT 0 CHECK(paid_cents >= 0),
 notes text, opened_at timestamptz NOT NULL DEFAULT now(),
 closed_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now(),
 version integer NOT NULL DEFAULT 1, CHECK(paid_cents <= total_cents));
CREATE TABLE IF NOT EXISTS order_items(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders(id),
 service_id uuid NOT NULL REFERENCES services(id),
 description text NOT NULL, quantity integer NOT NULL CHECK(quantity > 0),
 unit_price_cents integer NOT NULL CHECK(unit_price_cents >= 0));
CREATE TABLE IF NOT EXISTS inspections(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL UNIQUE REFERENCES orders(id),
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','completed')),
 model_version text NOT NULL DEFAULT 'procedural-v1',
 checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
 completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS inspection_marks(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), inspection_id uuid NOT NULL REFERENCES inspections(id),
 part text NOT NULL, kind text NOT NULL, severity text NOT NULL CHECK(severity IN ('low','medium','high')),
 coordinate_x real, coordinate_y real, coordinate_z real,
 notes text, created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 retracted_at timestamptz, retracted_by uuid, retraction_reason text);
CREATE TABLE IF NOT EXISTS inspection_evidence(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), mark_id uuid NOT NULL REFERENCES inspection_marks(id),
 object_key text NOT NULL UNIQUE, content_type text NOT NULL, file_size integer NOT NULL,
 sha256 text, capture_phase text NOT NULL CHECK(capture_phase IN ('before','after')),
 uploaded_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS stock_items(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
 sku text UNIQUE, quantity numeric(12,3) NOT NULL DEFAULT 0,
 min_quantity numeric(12,3) NOT NULL DEFAULT 0, cost_cents integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS stock_movements(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), stock_item_id uuid NOT NULL REFERENCES stock_items(id),
 delta numeric(12,3) NOT NULL, reason text NOT NULL, actor_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cash_sessions(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), opened_by uuid NOT NULL,
 opened_at timestamptz NOT NULL DEFAULT now(), closed_at timestamptz,
 opening_cents integer NOT NULL DEFAULT 0,
 counted_cents integer, status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')));
CREATE UNIQUE INDEX IF NOT EXISTS one_open_cash_session ON cash_sessions(status) WHERE status='open';
CREATE TABLE IF NOT EXISTS financial_entries(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), cash_session_id uuid REFERENCES cash_sessions(id),
 order_id uuid REFERENCES orders(id), direction text NOT NULL CHECK(direction IN ('in','out')),
 category text NOT NULL, amount_cents integer NOT NULL CHECK(amount_cents > 0),
 description text, created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_events(
 id bigserial PRIMARY KEY, actor_id uuid NOT NULL,
 action text NOT NULL, entity_type text NOT NULL, entity_id text NOT NULL,
 payload jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_audit_events_occurred ON audit_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_appointments_starts ON appointments(starts_at);
CREATE INDEX IF NOT EXISTS idx_inspection_marks_inspection ON inspection_marks(inspection_id);

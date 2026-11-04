-- Central Freitas ERP: metadados apenas, sem comandas/veículos.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS platform_users(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL,
 password_hash text NOT NULL, active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS tenants(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL,
 name text NOT NULL, connection_ciphertext text NOT NULL,
 status text NOT NULL DEFAULT 'trial' CHECK(status IN ('trial','active','suspended')),
 created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS memberships(
 user_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
 tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
 role text NOT NULL CHECK(role IN ('owner','manager','cashier','operator','inspector','viewer')),
 PRIMARY KEY(user_id,tenant_id));
CREATE TABLE IF NOT EXISTS login_attempts(
 subject text PRIMARY KEY, attempts integer NOT NULL DEFAULT 0,
 window_started_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_memberships_tenant ON memberships(tenant_id);

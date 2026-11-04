-- Aplicar DEPOIS de tenant.sql, em cada banco de empresa.
ALTER TABLE financial_entries ADD COLUMN IF NOT EXISTS idempotency_key text;
CREATE UNIQUE INDEX IF NOT EXISTS ux_financial_idempotency_key ON financial_entries(idempotency_key) WHERE idempotency_key IS NOT NULL;

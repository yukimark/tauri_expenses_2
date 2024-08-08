CREATE TABLE profiles (
  id                        INTEGER PRIMARY KEY,
  target_value_total_price  INTEGER NOT NULL DEFAULT 0,
  target_value_fixed_cost   INTEGER NOT NULL DEFAULT 0,
  target_value_deferred_pay INTEGER NOT NULL DEFAULT 0,
  created_at                TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO profiles DEFAULT VALUES;

CREATE TABLE profiles (
  id                        INTEGER PRIMARY KEY,
  target_value_total_price  INTEGER NOT NULL DEFAULT 0,
  target_value_fixed_cost   INTEGER NOT NULL DEFAULT 0,
  target_value_deferred_pay INTEGER NOT NULL DEFAULT 0,
  created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO profiles DEFAULT VALUES;

CREATE TRIGGER update_profiles_timestamp
AFTER UPDATE ON profiles
FOR EACH ROW
BEGIN
  UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

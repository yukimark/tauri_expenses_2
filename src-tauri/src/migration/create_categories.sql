CREATE TABLE categories (
  id                 INTEGER PRIMARY KEY,
  category           TEXT NOT NULL UNIQUE,
  initial_flag       TEXT NOT NULL DEFAULT '1',
  spend_target_value INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)

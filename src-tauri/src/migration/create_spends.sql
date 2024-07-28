CREATE TABLE users (
  id           INTEGER PRIMARY KEY,
  date         TEXT NOT NULL,
  category_id  INTEGER NOT NULL,
  price        INTEGER NOT NULL,
  fixed_cost   INTEGER NOT NULL,
  deferred_pay INTEGER NOT NULL,
  memo         TEXT,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)

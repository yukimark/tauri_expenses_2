CREATE TABLE spends (
  id           INTEGER PRIMARY KEY,
  date         TEXT NOT NULL,
  category_id  INTEGER NOT NULL,
  price        INTEGER NOT NULL,
  fixed_cost   INTEGER NOT NULL,
  deferred_pay INTEGER NOT NULL,
  memo         TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TRIGGER update_spends_timestamp
AFTER UPDATE ON spends
FOR EACH ROW
BEGIN
  UPDATE spends SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

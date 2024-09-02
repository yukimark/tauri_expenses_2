CREATE TABLE categories (
  id                 INTEGER PRIMARY KEY,
  category           TEXT NOT NULL UNIQUE,
  initial_flag       INTEGER NOT NULL DEFAULT 1,
  spend_target_value INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_categories_timestamp
AFTER UPDATE ON categories
FOR EACH ROW
BEGIN
  UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

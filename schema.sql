-- Contact-form submissions. Every submission is stored here; the spam flag
-- decides whether it also gets emailed. Apply to the remote D1 with:
--   npx wrangler d1 execute mae-gallery-db --remote --file=./schema.sql
CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  is_spam     INTEGER NOT NULL DEFAULT 0,   -- 0 = clean, 1 = flagged
  spam_score  REAL    NOT NULL DEFAULT 0,
  spam_reasons TEXT,                         -- comma-separated heuristic hits
  emailed     INTEGER NOT NULL DEFAULT 0,   -- 1 if forwarded to inbox
  ip          TEXT,
  user_agent  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_spam    ON submissions(is_spam);

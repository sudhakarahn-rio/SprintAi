-- Users table for basic email/username + password authentication
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY NOT NULL,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	username TEXT NOT NULL UNIQUE COLLATE NOCASE,
	email TEXT NOT NULL UNIQUE COLLATE NOCASE,
	password_hash TEXT NOT NULL,
	password_hash_algorithm TEXT NOT NULL DEFAULT 'bcrypt',
	created_at TEXT NOT NULL DEFAULT (datetime ('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime ('now'))
);

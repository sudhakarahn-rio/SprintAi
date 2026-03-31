-- MCQs, questions, choices, attempts (normalized; one question per MCQ in v1)
CREATE TABLE IF NOT EXISTS mcqs (
	id TEXT PRIMARY KEY NOT NULL,
	created_by_user_id TEXT NOT NULL,
	title TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	created_at TEXT NOT NULL DEFAULT (datetime ('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime ('now')),
	FOREIGN KEY (created_by_user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mcqs_created_by ON mcqs (created_by_user_id);

CREATE TABLE IF NOT EXISTS questions (
	id TEXT PRIMARY KEY NOT NULL,
	mcq_id TEXT NOT NULL,
	prompt TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0,
	UNIQUE (mcq_id),
	FOREIGN KEY (mcq_id) REFERENCES mcqs (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS choices (
	id TEXT PRIMARY KEY NOT NULL,
	question_id TEXT NOT NULL,
	label TEXT NOT NULL,
	sort_order INTEGER NOT NULL,
	is_correct INTEGER NOT NULL,
	FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
	CHECK (is_correct IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_choices_question ON choices (question_id);

CREATE TABLE IF NOT EXISTS attempts (
	id TEXT PRIMARY KEY NOT NULL,
	user_id TEXT NOT NULL,
	mcq_id TEXT NOT NULL,
	question_id TEXT NOT NULL,
	selected_choice_id TEXT NOT NULL,
	is_correct INTEGER NOT NULL,
	attempted_at TEXT NOT NULL DEFAULT (datetime ('now')),
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
	FOREIGN KEY (mcq_id) REFERENCES mcqs (id) ON DELETE CASCADE,
	FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
	FOREIGN KEY (selected_choice_id) REFERENCES choices (id) ON DELETE RESTRICT,
	CHECK (is_correct IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_mcq ON attempts (mcq_id);
CREATE INDEX IF NOT EXISTS idx_attempts_question ON attempts (question_id);
CREATE INDEX IF NOT EXISTS idx_attempts_at ON attempts (attempted_at);

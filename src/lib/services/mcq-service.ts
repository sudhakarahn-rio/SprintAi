import { executeBatch, executeMutation, executeQuery, executeQueryFirst, prepareBound } from "@/lib/d1-client";
import { getDatabase } from "@/lib/auth/get-database";

export type McqRow = {
	id: string;
	created_by_user_id: string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
};

export type QuestionRow = {
	id: string;
	mcq_id: string;
	prompt: string;
	sort_order: number;
};

export type ChoiceRow = {
	id: string;
	question_id: string;
	label: string;
	sort_order: number;
	is_correct: number;
};

export type McqDetail = {
	mcq: McqRow;
	question: QuestionRow;
	choices: ChoiceRow[];
};

function nowIso(): string {
	return new Date().toISOString();
}

export async function listAllMcqs(): Promise<McqRow[]> {
	const db = await getDatabase();
	return executeQuery<McqRow>(
		db,
		`SELECT id, created_by_user_id, title, description, created_at, updated_at FROM mcqs ORDER BY updated_at DESC`,
	);
}

export async function getMcqDetail(mcqId: string): Promise<McqDetail | null> {
	const db = await getDatabase();
	const mcq = await executeQueryFirst<McqRow>(db, `SELECT * FROM mcqs WHERE id = ?`, mcqId);
	if (!mcq) return null;
	const question = await executeQueryFirst<QuestionRow>(db, `SELECT * FROM questions WHERE mcq_id = ?`, mcqId);
	if (!question) return null;
	const choices = await executeQuery<ChoiceRow>(
		db,
		`SELECT * FROM choices WHERE question_id = ? ORDER BY sort_order ASC`,
		question.id,
	);
	return { mcq, question, choices };
}

export async function assertMcqOwner(userId: string, mcqId: string): Promise<McqRow> {
	const db = await getDatabase();
	const row = await executeQueryFirst<McqRow>(db, `SELECT * FROM mcqs WHERE id = ?`, mcqId);
	if (!row) {
		throw new Error("MCQ not found.");
	}
	if (row.created_by_user_id !== userId) {
		throw new Error("You can only modify your own MCQs.");
	}
	return row;
}

type ChoiceInput = { label: string; isCorrect: boolean };

export async function createMcq(
	userId: string,
	input: {
		title: string;
		description: string;
		prompt: string;
		choices: [string, string, string, string];
		correctIndex: number;
	},
): Promise<string> {
	const labels = input.choices.map((c) => c.trim());
	let correctCount = 0;
	const built: ChoiceInput[] = labels.map((label, i) => {
		const isCorrect = i === input.correctIndex;
		if (isCorrect) correctCount++;
		return { label, isCorrect };
	});
	if (correctCount !== 1) {
		throw new Error("Exactly one choice must be marked correct.");
	}

	const db = await getDatabase();
	const mcqId = crypto.randomUUID();
	const questionId = crypto.randomUUID();
	const t = nowIso();

	const stmts: D1PreparedStatement[] = [
		prepareBound(
			db,
			`INSERT INTO mcqs (id, created_by_user_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
			mcqId,
			userId,
			input.title.trim(),
			input.description.trim(),
			t,
			t,
		),
		prepareBound(
			db,
			`INSERT INTO questions (id, mcq_id, prompt, sort_order) VALUES (?, ?, ?, 0)`,
			questionId,
			mcqId,
			input.prompt.trim(),
		),
	];

	for (let i = 0; i < built.length; i++) {
		const c = built[i];
		const choiceId = crypto.randomUUID();
		stmts.push(
			prepareBound(
				db,
				`INSERT INTO choices (id, question_id, label, sort_order, is_correct) VALUES (?, ?, ?, ?, ?)`,
				choiceId,
				questionId,
				c.label,
				i,
				c.isCorrect ? 1 : 0,
			),
		);
	}

	await executeBatch(db, stmts);
	return mcqId;
}

export async function updateMcq(
	userId: string,
	mcqId: string,
	input: {
		title: string;
		description: string;
		prompt: string;
		choices: [string, string, string, string];
		correctIndex: number;
	},
): Promise<void> {
	await assertMcqOwner(userId, mcqId);
	const detail = await getMcqDetail(mcqId);
	if (!detail) {
		throw new Error("MCQ not found.");
	}
	const labels = input.choices.map((c) => c.trim());
	let correctCount = 0;
	const built: ChoiceInput[] = labels.map((label, i) => {
		const isCorrect = i === input.correctIndex;
		if (isCorrect) correctCount++;
		return { label, isCorrect };
	});
	if (correctCount !== 1) {
		throw new Error("Exactly one choice must be marked correct.");
	}

	const db = await getDatabase();
	const questionId = detail.question.id;
	const t = nowIso();

	const sorted = [...detail.choices].sort((a, b) => a.sort_order - b.sort_order);
	if (sorted.length !== 4) {
		throw new Error("Expected four choices for this MCQ.");
	}

	const stmts: D1PreparedStatement[] = [
		prepareBound(
			db,
			`UPDATE mcqs SET title = ?, description = ?, updated_at = ? WHERE id = ?`,
			input.title.trim(),
			input.description.trim(),
			t,
			mcqId,
		),
		prepareBound(db, `UPDATE questions SET prompt = ? WHERE id = ?`, input.prompt.trim(), questionId),
	];

	for (let i = 0; i < 4; i++) {
		const c = built[i];
		stmts.push(
			prepareBound(
				db,
				`UPDATE choices SET label = ?, is_correct = ? WHERE id = ? AND question_id = ?`,
				c.label,
				c.isCorrect ? 1 : 0,
				sorted[i].id,
				questionId,
			),
		);
	}

	await executeBatch(db, stmts);
}

export async function deleteMcq(userId: string, mcqId: string): Promise<void> {
	await assertMcqOwner(userId, mcqId);
	const db = await getDatabase();
	await executeMutation(db, `DELETE FROM mcqs WHERE id = ?`, mcqId);
}

export async function recordAttempt(
	userId: string,
	mcqId: string,
	selectedChoiceId: string,
): Promise<{ isCorrect: boolean }> {
	const db = await getDatabase();
	const row = await executeQueryFirst<{
		question_id: string;
		is_correct: number;
	}>(
		db,
		`SELECT q.id AS question_id, ch.is_correct
     FROM choices ch
     INNER JOIN questions q ON q.id = ch.question_id
     WHERE ch.id = ? AND q.mcq_id = ?`,
		selectedChoiceId,
		mcqId,
	);
	if (!row) {
		throw new Error("Invalid answer selection.");
	}

	const attemptId = crypto.randomUUID();
	const isCorrect = row.is_correct === 1;
	await executeMutation(
		db,
		`INSERT INTO attempts (id, user_id, mcq_id, question_id, selected_choice_id, is_correct, attempted_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		attemptId,
		userId,
		mcqId,
		row.question_id,
		selectedChoiceId,
		isCorrect ? 1 : 0,
		nowIso(),
	);

	return { isCorrect };
}

import { executeMutation, executeQueryFirst } from "@/lib/d1-client";

export type UserRow = {
	id: string;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password_hash: string;
	password_hash_algorithm: string;
	created_at: string;
	updated_at: string;
};

/** Resolve by email or username (case-insensitive), single identifier field. */
export async function findUserByIdentifier(
	db: D1Database,
	identifier: string,
): Promise<UserRow | null> {
	const trimmed = identifier.trim();
	if (!trimmed) return null;
	return executeQueryFirst<UserRow>(
		db,
		`SELECT * FROM users WHERE lower(email) = lower(?) OR lower(username) = lower(?)`,
		trimmed,
		trimmed,
	);
}

export async function insertUser(
	db: D1Database,
	row: {
		id: string;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		password_hash: string;
	},
): Promise<void> {
	await executeMutation(
		db,
		`INSERT INTO users (id, first_name, last_name, username, email, password_hash, password_hash_algorithm)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
		row.id,
		row.first_name,
		row.last_name,
		row.username,
		row.email,
		row.password_hash,
		"bcrypt",
	);
}

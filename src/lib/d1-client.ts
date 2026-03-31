/**
 * Normalizes `?` placeholders to `?1`, `?2`, … for D1 binding compatibility.
 */
function toPositionalPlaceholders(sql: string): string {
	let n = 0;
	return sql.replace(/\?/g, () => `?${++n}`);
}

export function prepareBound(db: D1Database, sql: string, ...params: unknown[]): D1PreparedStatement {
	const statement = toPositionalPlaceholders(sql);
	const stmt = db.prepare(statement);
	return params.length > 0 ? stmt.bind(...params) : stmt;
}

export async function executeQuery<T extends Record<string, unknown>>(
	db: D1Database,
	sql: string,
	...params: unknown[]
): Promise<T[]> {
	const statement = toPositionalPlaceholders(sql);
	const stmt = db.prepare(statement);
	const bound = params.length > 0 ? stmt.bind(...params) : stmt;
	const { results } = await bound.all();
	return results as T[];
}

export async function executeBatch(db: D1Database, statements: D1PreparedStatement[]): Promise<void> {
	await db.batch(statements);
}

export async function executeQueryFirst<T extends Record<string, unknown>>(
	db: D1Database,
	sql: string,
	...params: unknown[]
): Promise<T | null> {
	const statement = toPositionalPlaceholders(sql);
	const stmt = db.prepare(statement);
	const bound = params.length > 0 ? stmt.bind(...params) : stmt;
	const { results } = await bound.all();
	const row = results[0];
	return row ? (row as T) : null;
}

export async function executeMutation(
	db: D1Database,
	sql: string,
	...params: unknown[]
): Promise<D1Result<unknown>> {
	const statement = toPositionalPlaceholders(sql);
	const stmt = db.prepare(statement);
	const bound = params.length > 0 ? stmt.bind(...params) : stmt;
	return bound.run();
}

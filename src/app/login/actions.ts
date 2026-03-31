"use server";

import { redirect } from "next/navigation";

import { verifyPassword } from "@/lib/auth/password";
import { getDatabase } from "@/lib/auth/get-database";
import { findUserByIdentifier } from "@/lib/auth/user-repository";
import { setSessionCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/schemas/auth";

export type LoginState = { error: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
	const raw = {
		identifier: formData.get("identifier") ?? "",
		password: formData.get("password") ?? "",
	};
	const parsed = loginSchema.safeParse(raw);
	if (!parsed.success) {
		const msg = parsed.error.issues[0]?.message ?? "Invalid input.";
		return { error: msg };
	}
	const { identifier, password } = parsed.data;
	try {
		const db = await getDatabase();
		const user = await findUserByIdentifier(db, identifier);
		if (!user) {
			return { error: "Invalid email/username or password." };
		}
		const ok = await verifyPassword(password, user.password_hash);
		if (!ok) {
			return { error: "Invalid email/username or password." };
		}
		await setSessionCookie(user.id);
	} catch (e) {
		console.error(e);
		const message = e instanceof Error ? e.message : "Something went wrong.";
		return { error: message };
	}
	redirect("/mcqs");
}

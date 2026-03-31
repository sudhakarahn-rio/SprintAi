"use server";

import { redirect } from "next/navigation";

import { hashPassword } from "@/lib/auth/password";
import { getDatabase } from "@/lib/auth/get-database";
import { insertUser } from "@/lib/auth/user-repository";
import { setSessionCookie } from "@/lib/auth/session";
import { signupSchema } from "@/lib/schemas/auth";

export type SignupState = { error: string } | undefined;

export async function signupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
	const raw = {
		firstName: formData.get("firstName") ?? "",
		lastName: formData.get("lastName") ?? "",
		username: formData.get("username") ?? "",
		email: formData.get("email") ?? "",
		password: formData.get("password") ?? "",
	};
	const parsed = signupSchema.safeParse(raw);
	if (!parsed.success) {
		const msg = parsed.error.issues[0]?.message ?? "Invalid input.";
		return { error: msg };
	}
	const { firstName, lastName, username, email, password } = parsed.data;
	try {
		const db = await getDatabase();
		const password_hash = await hashPassword(password);
		const id = crypto.randomUUID();
		await insertUser(db, {
			id,
			first_name: firstName,
			last_name: lastName,
			username,
			email,
			password_hash,
		});
		await setSessionCookie(id);
	} catch (e) {
		console.error(e);
		const msg = e instanceof Error ? e.message : "";
		if (msg.includes("UNIQUE") || msg.toLowerCase().includes("unique")) {
			return { error: "That username or email is already registered." };
		}
		return { error: msg || "Could not create your account." };
	}
	redirect("/mcqs");
}

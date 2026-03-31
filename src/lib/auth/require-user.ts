import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth/session";

export async function requireUserId(): Promise<string> {
	const id = await getCurrentUserId();
	if (!id) {
		redirect("/login");
	}
	return id;
}

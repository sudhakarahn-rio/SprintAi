"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUserId } from "@/lib/auth/require-user";
import { createMcq, deleteMcq, recordAttempt, updateMcq } from "@/lib/services/mcq-service";
import { formDataToMcqPayload, mcqFormSchema } from "@/lib/schemas/mcq";

export type McqActionState = { error?: string } | undefined;

export async function createMcqAction(_prev: McqActionState, formData: FormData): Promise<McqActionState> {
	const parsed = mcqFormSchema.safeParse(formDataToMcqPayload(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid form." };
	}
	const d = parsed.data;
	const choices: [string, string, string, string] = [d.choice0, d.choice1, d.choice2, d.choice3];
	const userId = await requireUserId();
	let id: string;
	try {
		id = await createMcq(userId, {
			title: d.title,
			description: d.description ?? "",
			prompt: d.prompt,
			choices,
			correctIndex: d.correctIndex,
		});
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Failed to create MCQ." };
	}
	revalidatePath("/mcqs");
	redirect(`/mcqs/${id}`);
}

export async function updateMcqAction(
	mcqId: string,
	_prev: McqActionState,
	formData: FormData,
): Promise<McqActionState> {
	const parsed = mcqFormSchema.safeParse(formDataToMcqPayload(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid form." };
	}
	const d = parsed.data;
	const choices: [string, string, string, string] = [d.choice0, d.choice1, d.choice2, d.choice3];
	const userId = await requireUserId();
	try {
		await updateMcq(userId, mcqId, {
			title: d.title,
			description: d.description ?? "",
			prompt: d.prompt,
			choices,
			correctIndex: d.correctIndex,
		});
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Failed to update MCQ." };
	}
	revalidatePath("/mcqs");
	revalidatePath(`/mcqs/${mcqId}`);
	revalidatePath(`/mcqs/${mcqId}/edit`);
	redirect(`/mcqs/${mcqId}`);
}

export async function deleteMcqAction(mcqId: string): Promise<{ error?: string }> {
	const userId = await requireUserId();
	try {
		await deleteMcq(userId, mcqId);
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Failed to delete." };
	}
	revalidatePath("/mcqs");
	return {};
}

export type AttemptState = { error?: string; isCorrect?: boolean } | undefined;

export async function submitAttemptAction(
	mcqId: string,
	_prev: AttemptState,
	formData: FormData,
): Promise<AttemptState> {
	const raw = formData.get("choiceId");
	const choiceId = typeof raw === "string" ? raw : "";
	if (!choiceId) {
		return { error: "Select an answer before submitting." };
	}
	const userId = await requireUserId();
	try {
		const { isCorrect } = await recordAttempt(userId, mcqId, choiceId);
		revalidatePath(`/mcqs/${mcqId}`);
		return { isCorrect };
	} catch (e) {
		return { error: e instanceof Error ? e.message : "Could not record attempt." };
	}
}

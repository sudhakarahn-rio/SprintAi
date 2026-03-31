import { z } from "zod";

const choiceText = z.string().trim().min(1, "Each choice must be non-empty.").max(2000);

export const mcqFormSchema = z
	.object({
		title: z.string().trim().min(1, "Title is required.").max(200),
		description: z.string().max(5000).default(""),
		prompt: z.string().trim().min(1, "Question text is required.").max(5000),
		choice0: choiceText,
		choice1: choiceText,
		choice2: choiceText,
		choice3: choiceText,
		correctIndex: z.coerce.number().int().min(0).max(3),
	})
	.superRefine((data, ctx) => {
		const labels = [data.choice0, data.choice1, data.choice2, data.choice3];
		if (!labels[data.correctIndex]) {
			ctx.addIssue({
				code: "custom",
				message: "Select which choice is correct.",
				path: ["correctIndex"],
			});
		}
	});

export type McqFormInput = z.infer<typeof mcqFormSchema>;

export function formDataToMcqPayload(formData: FormData): Record<string, unknown> {
	return {
		title: String(formData.get("title") ?? ""),
		description: String(formData.get("description") ?? ""),
		prompt: String(formData.get("prompt") ?? ""),
		choice0: String(formData.get("choice0") ?? ""),
		choice1: String(formData.get("choice1") ?? ""),
		choice2: String(formData.get("choice2") ?? ""),
		choice3: String(formData.get("choice3") ?? ""),
		correctIndex: formData.get("correctIndex"),
	};
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { updateMcqAction } from "@/app/mcqs/actions";
import { McqForm, type McqFormDefaults } from "@/components/mcq/mcq-form";
import { requireUserId } from "@/lib/auth/require-user";
import { getMcqDetail } from "@/lib/services/mcq-service";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditMcqPage(props: PageProps) {
	const { id } = await props.params;
	const userId = await requireUserId();
	const detail = await getMcqDetail(id);
	if (!detail) {
		notFound();
	}
	if (detail.mcq.created_by_user_id !== userId) {
		return (
			<div className="space-y-4">
				<p className="text-muted-foreground">You can only edit MCQs you created.</p>
				<Link className="text-primary text-sm underline-offset-4 hover:underline" href={`/mcqs/${id}`}>
					← Back to this MCQ
				</Link>
			</div>
		);
	}

	const sorted = [...detail.choices].sort((a, b) => a.sort_order - b.sort_order);
	const correctIndex = sorted.findIndex((c) => c.is_correct === 1);
	const defaults: McqFormDefaults = {
		title: detail.mcq.title,
		description: detail.mcq.description,
		prompt: detail.question.prompt,
		choice0: sorted[0]?.label ?? "",
		choice1: sorted[1]?.label ?? "",
		choice2: sorted[2]?.label ?? "",
		choice3: sorted[3]?.label ?? "",
		correctIndex: correctIndex >= 0 ? correctIndex : 0,
	};

	const boundUpdate = updateMcqAction.bind(null, id);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-muted-foreground text-sm">
					<Link className="hover:underline" href={`/mcqs/${id}`}>
						← Back to MCQ
					</Link>
				</p>
				<h1 className="mt-2 text-2xl font-semibold tracking-tight">Edit MCQ</h1>
			</div>
			<McqForm
				defaults={defaults}
				formAction={boundUpdate}
				pendingLabel="Saving…"
				submitLabel="Save changes"
			/>
		</div>
	);
}

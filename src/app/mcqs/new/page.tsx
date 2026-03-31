import { createMcqAction } from "@/app/mcqs/actions";
import { McqForm } from "@/components/mcq/mcq-form";

export default function NewMcqPage() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold tracking-tight">Create MCQ</h1>
			<McqForm
				formAction={createMcqAction}
				pendingLabel="Creating…"
				submitLabel="Create MCQ"
			/>
		</div>
	);
}

import Link from "next/link";

import { McqsTable } from "@/components/mcq/mcqs-table";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/lib/auth/require-user";
import { listAllMcqs } from "@/lib/services/mcq-service";

export default async function McqsPage() {
	const userId = await requireUserId();
	const rows = await listAllMcqs();

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">Multiple Choice Questions</h1>
				<Button asChild className="shrink-0 self-start sm:self-auto">
					<Link href="/mcqs/new">Create MCQ</Link>
				</Button>
			</div>

			{rows.length === 0 ? (
				<div className="rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
					<p className="text-muted-foreground">No MCQs yet.</p>
					<p className="mt-2 text-muted-foreground text-sm">Create your first question to get started.</p>
					<Button asChild className="mt-6">
						<Link href="/mcqs/new">Create MCQ</Link>
					</Button>
				</div>
			) : (
				<McqsTable currentUserId={userId} rows={rows} />
			)}
		</div>
	);
}

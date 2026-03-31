import Link from "next/link";
import { notFound } from "next/navigation";

import { McqAttemptForm } from "@/components/mcq/mcq-attempt-form";
import { Button } from "@/components/ui/button";
import { requireUserId } from "@/lib/auth/require-user";
import { getMcqDetail } from "@/lib/services/mcq-service";

type PageProps = { params: Promise<{ id: string }> };

export default async function McqPreviewPage(props: PageProps) {
	const { id } = await props.params;
	const userId = await requireUserId();
	const detail = await getMcqDetail(id);
	if (!detail) {
		notFound();
	}

	const sorted = [...detail.choices].sort((a, b) => a.sort_order - b.sort_order);
	const choices = sorted.map((c) => ({ id: c.id, label: c.label }));
	const isOwner = detail.mcq.created_by_user_id === userId;

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<p className="text-muted-foreground text-sm">
						<Link className="hover:underline" href="/mcqs">
							← Back to MCQs
						</Link>
					</p>
					<h1 className="text-2xl font-semibold tracking-tight">{detail.mcq.title}</h1>
					{detail.mcq.description ? (
						<p className="text-muted-foreground text-sm leading-relaxed">{detail.mcq.description}</p>
					) : null}
				</div>
				{isOwner ? (
					<Button asChild variant="outline">
						<Link href={`/mcqs/${id}/edit`}>Edit</Link>
					</Button>
				) : null}
			</div>

			<section className="rounded-xl border bg-card p-6 shadow-sm">
				<h2 className="font-medium text-lg leading-snug">{detail.question.prompt}</h2>
				<div className="mt-6">
					<McqAttemptForm choices={choices} mcqId={id} />
				</div>
			</section>
		</div>
	);
}

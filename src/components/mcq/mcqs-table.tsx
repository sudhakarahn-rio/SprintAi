"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { deleteMcqAction } from "@/app/mcqs/actions";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type McqTableRow = {
	id: string;
	title: string;
	description: string;
	updated_at: string;
	created_by_user_id: string;
};

type McqsTableProps = {
	rows: McqTableRow[];
	currentUserId: string;
};

export function McqsTable({ rows, currentUserId }: McqsTableProps) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	function handleDelete(mcqId: string) {
		if (!confirm("Delete this MCQ? This cannot be undone.")) return;
		startTransition(async () => {
			const r = await deleteMcqAction(mcqId);
			if (r.error) {
				alert(r.error);
				return;
			}
			router.refresh();
		});
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[40%]">Title</TableHead>
					<TableHead className="hidden md:table-cell">Description</TableHead>
					<TableHead className="w-[140px]">Updated</TableHead>
					<TableHead className="w-[72px] text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => {
					const isOwner = row.created_by_user_id === currentUserId;
					const snippet =
						row.description.length > 80 ? `${row.description.slice(0, 80)}…` : row.description;
					return (
						<TableRow key={row.id}>
							<TableCell className="font-medium">
								<Link className="hover:underline" href={`/mcqs/${row.id}`}>
									{row.title}
								</Link>
							</TableCell>
							<TableCell className="hidden max-w-md text-muted-foreground md:table-cell">{snippet}</TableCell>
							<TableCell className="whitespace-nowrap text-muted-foreground text-xs">
								{formatDate(row.updated_at)}
							</TableCell>
							<TableCell className="text-right">
								{isOwner ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												aria-label="Actions"
												disabled={pending}
												size="icon-sm"
												type="button"
												variant="outline"
											>
												<MoreHorizontalIcon className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem asChild>
												<Link className="flex items-center gap-2" href={`/mcqs/${row.id}/edit`}>
													<PencilIcon className="size-4" />
													Edit
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												className="flex items-center gap-2 text-destructive focus:text-destructive"
												onSelect={(e) => {
													e.preventDefault();
													handleDelete(row.id);
												}}
											>
												<Trash2Icon className="size-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<span className="text-muted-foreground text-xs">—</span>
								)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

function formatDate(iso: string): string {
	try {
		const d = new Date(iso);
		return d.toLocaleString(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		});
	} catch {
		return iso;
	}
}

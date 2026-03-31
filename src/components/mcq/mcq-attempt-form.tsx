"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitAttemptAction, type AttemptState } from "@/app/mcqs/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

function SubmitAttemptButton() {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending} type="submit">
			{pending ? "Submitting…" : "Submit answer"}
		</Button>
	);
}

type Choice = { id: string; label: string };

export function McqAttemptForm({ mcqId, choices }: { mcqId: string; choices: Choice[] }) {
	const bound = submitAttemptAction.bind(null, mcqId);
	const [state, formAction] = useActionState(bound, undefined as AttemptState | undefined);

	return (
		<div className="space-y-4">
			<form action={formAction} className="space-y-4">
				<Field>
					<FieldLabel>Select your answer</FieldLabel>
					<FieldContent className="flex flex-col gap-3">
						{choices.map((c) => (
							<label
								key={c.id}
								className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted/50"
							>
								<input className="mt-0.5" name="choiceId" required type="radio" value={c.id} />
								<span>{c.label}</span>
							</label>
						))}
					</FieldContent>
				</Field>
				{state?.error ? <p className="text-destructive text-sm">{state.error}</p> : null}
				<SubmitAttemptButton />
			</form>
			{state?.isCorrect !== undefined ? (
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">Result:</span>
					{state.isCorrect ? (
						<Badge variant="default">Correct</Badge>
					) : (
						<Badge variant="destructive">Incorrect</Badge>
					)}
				</div>
			) : null}
		</div>
	);
}

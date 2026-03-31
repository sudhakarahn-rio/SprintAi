"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { McqActionState } from "@/app/mcqs/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending} type="submit">
			{pending ? pendingLabel : label}
		</Button>
	);
}

export type McqFormDefaults = {
	title: string;
	description: string;
	prompt: string;
	choice0: string;
	choice1: string;
	choice2: string;
	choice3: string;
	correctIndex: number;
};

type McqFormProps = {
	formAction: (
		state: McqActionState | undefined,
		payload: FormData,
	) => McqActionState | Promise<McqActionState>;
	submitLabel: string;
	pendingLabel: string;
	defaults?: McqFormDefaults;
};

export function McqForm({ formAction, submitLabel, pendingLabel, defaults }: McqFormProps) {
	const [state, action] = useActionState(formAction, undefined);

	const d = defaults ?? {
		title: "",
		description: "",
		prompt: "",
		choice0: "",
		choice1: "",
		choice2: "",
		choice3: "",
		correctIndex: 0,
	};

	return (
		<Card className="max-w-2xl">
			<CardHeader>
				<CardTitle>{defaults ? "Edit MCQ" : "New MCQ"}</CardTitle>
				<CardDescription>
					Enter a title, description, the question, four answer choices, and which one is correct.
				</CardDescription>
			</CardHeader>
			<form action={action}>
				<CardContent className="flex flex-col gap-5">
					<Field>
						<FieldLabel htmlFor="title">Title</FieldLabel>
						<FieldContent>
							<Input defaultValue={d.title} id="title" name="title" required />
						</FieldContent>
					</Field>
					<Field>
						<FieldLabel htmlFor="description">Description</FieldLabel>
						<FieldContent>
							<Textarea defaultValue={d.description} id="description" name="description" rows={3} />
						</FieldContent>
					</Field>
					<Field>
						<FieldLabel htmlFor="prompt">Question</FieldLabel>
						<FieldContent>
							<Textarea defaultValue={d.prompt} id="prompt" name="prompt" required rows={4} />
						</FieldContent>
					</Field>
					<div className="space-y-3">
						<p className="text-sm font-medium">Answer choices</p>
						{(
							[
								["choice0", d.choice0],
								["choice1", d.choice1],
								["choice2", d.choice2],
								["choice3", d.choice3],
							] as const
						).map(([name, val], i) => (
							<Field key={name}>
								<FieldLabel htmlFor={name}>Choice {i + 1}</FieldLabel>
								<FieldContent>
									<Input defaultValue={val} id={name} name={name} required />
								</FieldContent>
							</Field>
						))}
					</div>
					<Field>
						<FieldLabel>Correct answer</FieldLabel>
						<FieldContent className="flex flex-col gap-2">
							{[0, 1, 2, 3].map((i) => (
								<label key={i} className="flex cursor-pointer items-center gap-2 text-sm">
									<input
										defaultChecked={d.correctIndex === i}
										name="correctIndex"
										required
										type="radio"
										value={String(i)}
									/>
									<span>Choice {i + 1} is correct</span>
								</label>
							))}
						</FieldContent>
					</Field>
					{state?.error ? <FieldError>{state.error}</FieldError> : null}
				</CardContent>
				<CardFooter className="border-t">
					<SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
				</CardFooter>
			</form>
		</Card>
	);
}

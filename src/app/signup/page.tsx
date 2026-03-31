"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signupAction, type SignupState } from "@/app/signup/actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
	const { pending } = useFormStatus();
	return (
		<Button className="w-full" disabled={pending} type="submit">
			{pending ? pendingLabel : label}
		</Button>
	);
}

export default function SignupPage() {
	const [state, formAction] = useActionState(signupAction, undefined as SignupState | undefined);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6">
			<Card className="w-full max-w-md shadow-sm">
				<CardHeader className="space-y-1">
					<CardTitle className="text-xl">Create an account</CardTitle>
					<CardDescription>Sign up to create and take multiple choice questions.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-3">
							<Field>
								<FieldLabel htmlFor="firstName">First name</FieldLabel>
								<FieldContent>
									<Input autoComplete="given-name" id="firstName" name="firstName" required type="text" />
								</FieldContent>
							</Field>
							<Field>
								<FieldLabel htmlFor="lastName">Last name</FieldLabel>
								<FieldContent>
									<Input autoComplete="family-name" id="lastName" name="lastName" required type="text" />
								</FieldContent>
							</Field>
						</div>
						<Field>
							<FieldLabel htmlFor="username">Username</FieldLabel>
							<FieldContent>
								<Input autoComplete="username" id="username" name="username" required type="text" />
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<FieldContent>
								<Input autoComplete="email" id="email" name="email" required type="email" />
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<FieldContent>
								<Input autoComplete="new-password" id="password" name="password" required type="password" />
							</FieldContent>
						</Field>
						{state?.error ? <FieldError>{state.error}</FieldError> : null}
						<SubmitButton label="Create account" pendingLabel="Creating account…" />
					</form>
				</CardContent>
				<CardFooter className="flex justify-center border-t text-sm text-muted-foreground">
					<span>
						Already have an account?{" "}
						<Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/login">
							Log in
						</Link>
					</span>
				</CardFooter>
			</Card>
		</div>
	);
}

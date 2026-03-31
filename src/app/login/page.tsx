"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type LoginState } from "@/app/login/actions";
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

export default function LoginPage() {
	const [state, formAction] = useActionState(loginAction, undefined as LoginState | undefined);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6">
			<Card className="w-full max-w-md shadow-sm">
				<CardHeader className="space-y-1">
					<CardTitle className="text-xl">Log in</CardTitle>
					<CardDescription>Use your email or username and password to access QuizMaker.</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="flex flex-col gap-4">
						<Field>
							<FieldLabel htmlFor="identifier">Email or username</FieldLabel>
							<FieldContent>
								<Input
									autoComplete="username"
									id="identifier"
									name="identifier"
									placeholder="you@school.edu or jane.doe"
									required
									type="text"
								/>
							</FieldContent>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<FieldContent>
								<Input
									autoComplete="current-password"
									id="password"
									name="password"
									required
									type="password"
								/>
							</FieldContent>
						</Field>
						{state?.error ? <FieldError>{state.error}</FieldError> : null}
						<SubmitButton label="Sign in" pendingLabel="Signing in…" />
					</form>
				</CardContent>
				<CardFooter className="flex justify-center border-t text-sm text-muted-foreground">
					<span>
						No account?{" "}
						<Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/signup">
							Create one
						</Link>
					</span>
				</CardFooter>
			</Card>
		</div>
	);
}

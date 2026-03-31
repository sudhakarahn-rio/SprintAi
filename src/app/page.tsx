import Link from "next/link";
import { ClipboardListIcon, SparklesIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/auth/session";

export default async function Home() {
	const userId = await getCurrentUserId();

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-b from-muted/40 to-background font-sans">
			<header className="border-b border-border/80 bg-background/80 backdrop-blur">
				<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
					<span className="font-semibold text-lg tracking-tight">QuizMaker</span>
					<nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
						{userId ? (
							<Button asChild size="sm" variant="default">
								<Link href="/mcqs">Multiple choice questions</Link>
							</Button>
						) : null}
						<Button asChild size="sm" variant={userId ? "ghost" : "default"}>
							<Link href="/login">Log in</Link>
						</Button>
						{!userId ? (
							<Button asChild size="sm" variant="outline">
								<Link href="/signup">Sign up</Link>
							</Button>
						) : null}
					</nav>
				</div>
			</header>

			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-16 sm:px-6 sm:py-24">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-primary text-sm font-medium tracking-wide uppercase">For educators</p>
					<h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
						Build and share multiple choice questions
					</h1>
					<p className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">
						QuizMaker helps teachers create MCQs, preview them like students would, and track attempts—
						with a path to align content with standards in future updates.
					</p>
					<div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
						{userId ? (
							<Button asChild className="h-11 px-8 text-base" size="lg">
								<Link href="/mcqs">Open your MCQs</Link>
							</Button>
						) : (
							<>
								<Button asChild className="h-11 px-8 text-base" size="lg">
									<Link href="/signup">Create an account</Link>
								</Button>
								<Button asChild className="h-11 px-8 text-base" size="lg" variant="outline">
									<Link href="/login">I already have an account</Link>
								</Button>
							</>
						)}
					</div>
				</div>

				<ul className="mx-auto mt-20 grid max-w-3xl gap-6 sm:grid-cols-3">
					<li className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm ring-1 ring-foreground/5">
						<ClipboardListIcon aria-hidden className="mb-3 size-8 text-primary" />
						<h2 className="font-heading font-semibold">List &amp; manage</h2>
						<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
							See all your MCQs in one table—create, edit, or remove questions anytime.
						</p>
					</li>
					<li className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm ring-1 ring-foreground/5">
						<UsersIcon aria-hidden className="mb-3 size-8 text-primary" />
						<h2 className="font-heading font-semibold">Preview &amp; attempts</h2>
						<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
							Learners answer in preview mode; every attempt is stored with a timestamp.
						</p>
					</li>
					<li className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm ring-1 ring-foreground/5">
						<SparklesIcon aria-hidden className="mb-3 size-8 text-primary" />
						<h2 className="font-heading font-semibold">Room to grow</h2>
						<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
							Built for adding AI-assisted standards alignment and richer quizzes later.
						</p>
					</li>
				</ul>
			</main>

			<footer className="border-t py-8 text-center text-muted-foreground text-sm">
				<p>© {new Date().getFullYear()} QuizMaker</p>
			</footer>
		</div>
	);
}

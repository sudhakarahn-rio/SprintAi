import Link from "next/link";

import { requireUserId } from "@/lib/auth/require-user";

export default async function McqsLayout({ children }: { children: React.ReactNode }) {
	await requireUserId();
	return (
		<div className="min-h-screen bg-muted/20">
			<header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
				<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
					<Link className="font-semibold tracking-tight" href="/">
						QuizMaker
					</Link>
					<nav className="flex items-center gap-4 text-sm">
						<Link className="text-muted-foreground hover:text-foreground" href="/mcqs">
							MCQs
						</Link>
						<Link className="text-muted-foreground hover:text-foreground" href="/">
							Home
						</Link>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
		</div>
	);
}

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Log in | QuizMaker",
	description: "Sign in to QuizMaker with your email or username.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return children;
}

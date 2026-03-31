"use client";

import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";

import { logoutAction } from "@/app/logout/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
	const [isPending, startTransition] = useTransition();

	function handleLogout() {
		startTransition(async () => {
			await logoutAction();
		});
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			className="text-muted-foreground hover:text-foreground gap-1.5"
			disabled={isPending}
			onClick={handleLogout}
		>
			<LogOutIcon className="size-4" />
			{isPending ? "Logging out…" : "Log out"}
		</Button>
	);
}

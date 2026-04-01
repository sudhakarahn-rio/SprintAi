"use client";

import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import { useTransition } from "react";

import { logoutAction } from "@/app/logout/actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ProfileMenuUser = {
	username: string;
};

export function ProfileMenu({ user }: { user: ProfileMenuUser }) {
	const [isPending, startTransition] = useTransition();

	function handleLogout() {
		startTransition(async () => {
			await logoutAction();
		});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					aria-label="Open profile menu"
					className="relative flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-border hover:ring-2 hover:ring-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-shadow"
				>
					{/* <Image
						src="/public/Profile.svg"
						alt="User avatar"
						width={32}
						height={32}
						className="rounded-full object-cover"
						priority
					/> */}
					User
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-44">
				<DropdownMenuLabel className="text-sm font-medium">
					@{user.username}
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					variant="destructive"
					disabled={isPending}
					onSelect={handleLogout}
					className="cursor-pointer gap-2"
				>
					<LogOutIcon className="size-4" />
					{isPending ? "Logging out…" : "Log out"}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

import { z } from "zod";

export const loginSchema = z.object({
	identifier: z.string().trim().min(1, "Enter your email or username."),
	password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required."),
	lastName: z.string().trim().min(1, "Last name is required."),
	username: z
		.string()
		.trim()
		.min(2, "Username must be at least 2 characters.")
		.max(64, "Username is too long."),
	email: z.string().trim().email("Enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters."),
});

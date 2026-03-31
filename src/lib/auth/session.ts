import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "quizmaker_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSessionSecretBytes(): Uint8Array {
	const secret = process.env.SESSION_SECRET;
	if (!secret || secret.length < 16) {
		throw new Error(
			"SESSION_SECRET is missing or too short. Set SESSION_SECRET (at least 16 characters) in .env.local for Next.js dev and in Cloudflare secrets / .dev.vars for Workers.",
		);
	}
	return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string): Promise<string> {
	const secret = getSessionSecretBytes();
	return new SignJWT({ sub: userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${MAX_AGE_SEC}s`)
		.sign(secret);
}

export async function verifySessionToken(token: string): Promise<{ sub: string }> {
	const secret = getSessionSecretBytes();
	const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
	const sub = payload.sub;
	if (!sub || typeof sub !== "string") {
		throw new Error("Invalid session token");
	}
	return { sub };
}

export async function setSessionCookie(userId: string): Promise<void> {
	const token = await createSessionToken(userId);
	const store = await cookies();
	store.set(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: MAX_AGE_SEC,
	});
}

export async function clearSessionCookie(): Promise<void> {
	const store = await cookies();
	store.set(COOKIE_NAME, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});
}

export async function getCurrentUserId(): Promise<string | null> {
	const store = await cookies();
	const token = store.get(COOKIE_NAME)?.value;
	if (!token) return null;
	try {
		const { sub } = await verifySessionToken(token);
		return sub;
	} catch {
		return null;
	}
}

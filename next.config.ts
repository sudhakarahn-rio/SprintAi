import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Required for OpenNext: traced `.next/standalone` layout used when packaging the Worker.
	output: "standalone",
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Use local Miniflare/D1 simulation for `next dev` and `next build` so a Cloudflare
// workers.dev remote session (and account onboarding) is not required.
initOpenNextCloudflareForDev({ remoteBindings: false });

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Next.js 16 defaults `next build` to Turbopack; OpenNext on Cloudflare expects a webpack server
// bundle (Turbopack SSR chunks fail in workerd → ChunkLoadError / HTTP 500 on every route).
export default {
	...defineCloudflareConfig({
		// Uncomment to enable R2 cache:
		// `import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";`
		// See https://opennext.js.org/cloudflare/caching
		// incrementalCache: r2IncrementalCache,
	}),
	buildCommand: "npx next build --webpack",
};

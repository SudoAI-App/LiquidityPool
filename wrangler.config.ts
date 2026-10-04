import { defineWranglerConfig } from "wrangler/experimental-config";

export default defineWranglerConfig({
	types: {
		generate: false,
	},
	// Astro static output (astro.config.mjs outDir).
	assetsDirectory: "./dist/public",
});

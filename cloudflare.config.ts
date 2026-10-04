// Deployed by Cloudflare Workers Builds on push to main (`npx cf deploy`).
// Never run `cf deploy` locally.
import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "liquiditypool-site",
		compatibilityDate: "2026-09-09",
		entrypoint: "./worker/index.js",
		// Production is served only from the custom domain. The workers.dev copy was
		// publicly reachable and reporting into production analytics.
		workersDev: false,
		assets: {
			notFoundHandling: "404-page",
			// Run worker/index.js before asset matching so HTTP requests can be redirected.
			runWorkerFirst: true,
		},
		env: {
			PUBLIC_GA_ID: bindings.text("G-FSKQB2V5BF"),
			GA_MEASUREMENT_ID: bindings.text("G-FSKQB2V5BF"),
			PUBLIC_CLARITY_ID: bindings.text("yfnys7eeci"),
			CLARITY_PROJECT_ID: bindings.text("yfnys7eeci"),
			ASSETS: bindings.assets(),
		},
	},
});

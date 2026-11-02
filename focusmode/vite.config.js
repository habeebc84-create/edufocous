import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Mounts `api/*.js` inside the dev server, mirroring how Vercel runs
 * them in production — so `/api/ai` works identically in `npm run dev`
 * and on the deployed site.
 */
function localApi() {
  return {
    name: "focusmode-local-api",
    configureServer(server) {
      server.middlewares.use("/api/ai", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/api/ai.js");
          await mod.default(req, res);
        } catch (err) {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
          }
          res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load every var (not just VITE_*) so server-only secrets like AI_API_KEY
  // are available to the api/ handler in dev. These stay server-side: they
  // are never inlined into the client bundle.
  const env = loadEnv(mode, process.cwd(), "");
  for (const key of ["AI_API_KEY", "AI_BASE_URL", "AI_MODEL"]) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), localApi()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: false,
      // Allow proxied preview hosts (e.g. *.e2b.app) and tunnel domains.
      allowedHosts: [".e2b.app", "localhost", "127.0.0.1"],
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
  };
});

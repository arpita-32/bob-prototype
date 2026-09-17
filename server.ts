import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();

  // In the development sandbox, the internal nginx reverse proxy forwards to port 3000.
  // In deployed Cloud Run production, Cloud Run sets PORT (typically 8080) and sends ingress directly.
  const isDev = process.env.NODE_ENV !== "production" && Boolean(process.argv[1]?.endsWith("server.ts"));
  const PORT = isDev ? 3000 : parseInt(process.env.PORT || "8080", 10);

  app.use(express.json());

  // Health check endpoints for Cloud Run container rollout & monitoring probes
  app.get(["/api/health", "/health", "/healthz"], (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware setup for dev vs static serving for production
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const currentDir = typeof __dirname !== "undefined" ? __dirname : path.resolve();
    const distPath = fs.existsSync(path.join(process.cwd(), "dist", "index.html"))
      ? path.join(process.cwd(), "dist")
      : fs.existsSync(path.join(currentDir, "index.html"))
      ? currentDir
      : path.join(process.cwd(), "dist");

    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("<!doctype html><html><body>App is initializing...</body></html>");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (mode: ${isDev ? "development" : "production"})`);
  });
}

startServer();


import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health/node", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "BaHam Node.js Gateway is running",
      timestamp: new Date().toISOString()
    });
  });

  // Proxy /api to FastAPI on port 8000
  // Note: Only if you start the python backend
  if (process.env.NODE_ENV !== "production") {
    const { createProxyMiddleware } = await import("http-proxy-middleware");
    app.use("/api", createProxyMiddleware({
      target: "http://127.0.0.1:8000",
      changeOrigin: true,
      on: {
        proxyReq: (proxyReq: any, req: any, res: any) => {
          console.log(`Proxying request: ${req.method} ${req.url}`);
        },
        error: (err: any, req: any, res: any) => {
          res.status(502).json({ error: "Backend (FastAPI) unreachable", details: err.message });
        }
      }
    } as any));
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

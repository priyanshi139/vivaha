import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("wedding.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS user_state (
    id TEXT PRIMARY KEY,
    state TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.get("/api/state/:id", (req, res) => {
    try {
      const { id } = req.params;
      const row = db.prepare("SELECT state FROM user_state WHERE id = ?").get(id) as { state: string } | undefined;
      if (row) {
        res.json(JSON.parse(row.state));
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      console.error("Error loading state:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/state/:id", (req, res) => {
    try {
      const { id } = req.params;
      const state = JSON.stringify(req.body);
      db.prepare("INSERT OR REPLACE INTO user_state (id, state, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)").run(id, state);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving state:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

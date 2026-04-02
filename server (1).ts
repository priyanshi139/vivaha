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
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    email TEXT PRIMARY KEY,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY,
    name TEXT,
    services TEXT,
    status TEXT DEFAULT 'pending',
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    service TEXT,
    customer_name TEXT,
    customer_id TEXT,
    date TEXT,
    payment_status TEXT,
    vendor_id TEXT
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    message TEXT,
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin if not exists
const adminCheck = db.prepare("SELECT * FROM admin_users WHERE email = ?").get("admin@wedding.com");
if (!adminCheck) {
  db.prepare("INSERT INTO admin_users (email, password) VALUES (?, ?)").run("admin@wedding.com", "admin123");
}

// Seed some vendors if empty
const vendorCount = db.prepare("SELECT COUNT(*) as count FROM vendors").get() as { count: number };
if (vendorCount.count === 0) {
  db.prepare("INSERT INTO vendors (id, name, services, status, details) VALUES (?, ?, ?, ?, ?)").run("v1", "The Wedding Salad", "Photography", "pending", "Premium photography service");
  db.prepare("INSERT INTO vendors (id, name, services, status, details) VALUES (?, ?, ?, ?, ?)").run("v2", "Royal Caterers", "Catering", "approved", "Traditional Rajasthani food");
}

// Seed some bookings if empty
const bookingCount = db.prepare("SELECT COUNT(*) as count FROM bookings").get() as { count: number };
if (bookingCount.count === 0) {
  db.prepare("INSERT INTO bookings (id, service, customer_name, customer_id, date, payment_status, vendor_id) VALUES (?, ?, ?, ?, ?, ?, ?)").run("b1", "Photography", "Priya Sharma", "u1", "2026-12-12", "Paid", "v1");
  db.prepare("INSERT INTO bookings (id, service, customer_name, customer_id, date, payment_status, vendor_id) VALUES (?, ?, ?, ?, ?, ?, ?)").run("b2", "Catering", "Rohan Mehta", "u2", "2026-12-12", "Pending", "v2");
}

// Seed some feedback if empty
const feedbackCount = db.prepare("SELECT COUNT(*) as count FROM feedback").get() as { count: number };
if (feedbackCount.count === 0) {
  db.prepare("INSERT INTO feedback (id, customer_name, message) VALUES (?, ?, ?)").run("f1", "Priya Sharma", "The app is great! Can you add more venues in Udaipur?");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin Auth
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM admin_users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, email });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Admin Vendors
  app.get("/api/admin/vendors", (req, res) => {
    const vendors = db.prepare("SELECT * FROM vendors").all();
    res.json(vendors);
  });

  app.post("/api/admin/vendors/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE vendors SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // Admin Bookings
  app.get("/api/admin/bookings", (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings").all();
    res.json(bookings);
  });

  // Admin Feedback
  app.get("/api/admin/feedback", (req, res) => {
    const feedback = db.prepare("SELECT * FROM feedback").all();
    res.json(feedback);
  });

  app.post("/api/admin/feedback/:id/respond", (req, res) => {
    const { id } = req.params;
    const { response } = req.body;
    db.prepare("UPDATE feedback SET response = ? WHERE id = ?").run(response, id);
    res.json({ success: true });
  });

  // Admin Reports
  app.get("/api/admin/reports", (req, res) => {
    const totalBookings = db.prepare("SELECT COUNT(*) as count FROM bookings").get() as { count: number };
    const pendingApprovals = db.prepare("SELECT COUNT(*) as count FROM vendors WHERE status = 'pending'").get() as { count: number };
    const approvedVendors = db.prepare("SELECT COUNT(*) as count FROM vendors WHERE status = 'approved'").get() as { count: number };
    
    res.json({
      totalBookings: totalBookings.count,
      pendingApprovals: pendingApprovals.count,
      approvedVendors: approvedVendors.count
    });
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

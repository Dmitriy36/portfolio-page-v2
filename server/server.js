// Portfolio site (dmitriy-yermakov.dev) backend: visit logging + admin report.
const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const ALLOWED_ORIGINS = [
  "https://dmitriy-yermakov.dev",
  "https://www.dmitriy-yermakov.dev",
];

// ─── CORS: only the portfolio site may call these routes from a browser ─────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, X-Admin-Password",
    );
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ─── Helpers ────────────────────────────────────────────────────────────────
function supabaseHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

// Render sits in front of the server, so the visitor's real IP arrives
// in the x-forwarded-for header (first entry).
function getVisitorIP(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

async function lookupLocation(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return null;
    const geo = await res.json();
    return (
      [geo.city, geo.region, geo.country_name].filter(Boolean).join(", ") ||
      null
    );
  } catch {
    return null;
  }
}

function passwordMatches(given) {
  if (!ADMIN_PASSWORD || typeof given !== "string") return false;
  const a = Buffer.from(given);
  const b = Buffer.from(ADMIN_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ─── POST /log ────────────────────────────────────────────────────
// Body: { page: "index" }. Records one visit or click.
app.post("/log", async (req, res) => {
  const page = req.body && req.body.page;
  if (typeof page !== "string" || page.length === 0 || page.length > 100) {
    return res.status(400).json({ error: "Invalid page" });
  }

  try {
    const ip = getVisitorIP(req);
    const location = await lookupLocation(ip);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_visits`, {
      method: "POST",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify({ page, visitor_ip: ip, location }),
    });
    if (!response.ok) {
      throw new Error(`Supabase ${response.status}: ${await response.text()}`);
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Error in /log:", err.message);
    res.status(500).json({ error: "Failed to log visit" });
  }
});

// ─── GET /visits ──────────────────────────────────────────────────
// Header: X-Admin-Password. Returns the latest 200 visits for the admin page.
app.get("/visits", async (req, res) => {
  if (!passwordMatches(req.headers["x-admin-password"])) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_visits?order=created_at.desc&limit=200`,
      { headers: supabaseHeaders() },
    );
    if (!response.ok) {
      throw new Error(`Supabase ${response.status}: ${await response.text()}`);
    }

    res.json(await response.json());
  } catch (err) {
    console.error("Error in /visits:", err.message);
    res.status(500).json({ error: "Failed to load visits" });
  }
});

// ─── Health check (lets you confirm the server is up) ─────────────────────────
app.get("/", (req, res) => res.send("Portfolio server is running"));

// ─── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Portfolio server listening on port ${PORT}`);
});

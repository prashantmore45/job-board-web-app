const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { initSocket } = require("./socket");

dotenv.config();
connectDB();

const app = express();

// Render (and most PaaS) sit behind a proxy. Without this the rate limiter sees
// the proxy's IP for every request and would throttle all users as one client.
app.set("trust proxy", 1);

// Security headers. CORP is relaxed to cross-origin because the frontend is
// served from a different domain than this API.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Middleware
app.use(express.json({ limit: "100kb" }));

// Allowed origins are configurable. When CORS_ORIGIN is unset the previous
// permissive behaviour is kept, so deploying this change breaks nothing.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: allowedOrigins
      ? (origin, cb) =>
          !origin || allowedOrigins.includes(origin)
            ? cb(null, true)
            : cb(new Error("Not allowed by CORS"))
      : true,
  })
);

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many attempts, please try again in 15 minutes." },
});

app.use("/api", globalLimiter);

// Make the "uploads" folder accessible to the frontend
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(
  "/uploads",
  express.static(uploadDir, {
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/application", require("./routes/appRoutes"));

// Unknown API routes return JSON rather than Express' default HTML page.
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Central error handler. Without this, multer rejections (wrong file type,
// file too large) surface as an HTML stack trace instead of a usable message.
app.use((err, req, res, next) => {
  if (err && err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Resume must be smaller than 5MB."
        : "Only PDF files are allowed.";
    return res.status(400).json({ message });
  }

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed." });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => console.log(`Job Board Server running on port ${PORT}`));

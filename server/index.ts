import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

// Trust proxy (required for correct IP detection behind reverse proxy)
app.set("trust proxy", 1);

// HTTPS enforcement in production (HIPAA 164.312(e)(1))
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

const isDev = process.env.NODE_ENV !== "production";

// Security headers via helmet
app.use(helmet({
  contentSecurityPolicy: isDev ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://api.secure.thoroughcare.com"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: isDev ? false : { policy: "same-origin" as const },
  crossOriginResourcePolicy: isDev ? false : undefined,
  hsts: isDev ? false : {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: isDev ? false : { action: "sameorigin" as const },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
}));

// Global rate limiter - 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
  skip: (req) => !req.path.startsWith("/api"),
}));

// Cookie parser (for httpOnly session cookies -- HIPAA 164.312(d))
app.use(cookieParser());

// Request body size limits (50mb for audio uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(express.raw({ type: ["audio/*"], limit: "50mb" }));

// Cache-control headers middleware for static assets
app.use((req, res, next) => {
  const requestPath = req.path;

  // Service worker, version.json, and manifest should never be cached
  if (requestPath === '/sw.js' || requestPath === '/version.json' || requestPath === '/manifest.json') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  // Cache static assets with hashed filenames for 1 year
  else if (requestPath.match(/\.(js|css)$/) && requestPath.includes('-')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Cache images and fonts for 1 year
  else if (requestPath.match(/\.(jpg|jpeg|png|gif|webp|ico|woff2?|ttf|eot|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // Don't cache HTML files and API responses
  else if (requestPath.match(/\.html$/) || requestPath === '/' || requestPath.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
});

// PHI-safe request logging (HIPAA -- never log response bodies that may contain PHI/PII)
const PHI_ENDPOINTS = [
  "/api/admin/inquiries",
  "/api/admin/dashboard",
  "/api/admin/tc/sample-enrollments",
  "/api/referrals/wound-care",
  "/api/contact",
  "/api/contact-night-coverage",
  "/api/contact-inquiries",
  "/api/admin/users",
  "/api/admin/audit-logs",
  "/api/admin/calls",
  "/api/admin/time-entries",
];

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const isPhi = PHI_ENDPOINTS.some((ep) => path.startsWith(ep));
      const logLine = isPhi
        ? `${req.method} ${path} ${res.statusCode} in ${duration}ms :: [REDACTED]`
        : `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    // Don't leak internal error details to clients in production
    const message = status >= 500 ? "Internal Server Error" : (err.message || "Internal Server Error");

    if (status >= 500) {
      console.error("[Error]", err);
    }

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Session cleanup job (HIPAA -- remove expired/inactive sessions)
  setInterval(async () => {
    try {
      await storage.cleanExpiredSessions();
    } catch (err) {
      console.error("[Session Cleanup] Error:", err);
    }
  }, 5 * 60 * 1000); // Every 5 minutes

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

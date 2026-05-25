// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { i18nMiddleware } from "./i18n/index.js";
import logger from "./middleware/logger.js";

import authRoutes from "./routes/auth.js";
import tableRoutes from "./routes/tables.js";
import reservationRoutes from "./routes/reservations.js";

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.cors.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ── Rate limiting ─────────────────────────────────────────
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Stricter limit for reservation creation
app.use(
  "/api/reservations",
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: "Too many reservation attempts." },
    skip: (req) => req.method !== "POST",
  })
);

// ── Parsers ───────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// ── Logging ───────────────────────────────────────────────
if (!env.isProd) {
  app.use(morgan("dev"));
}

// ── i18n ──────────────────────────────────────────────────
app.use(i18nMiddleware);

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);

// Public config endpoint — exposes safe settings to the frontend
// Frontend reads SUPPORTED_LANGUAGES and DEFAULT_LANGUAGE from here
app.get("/api/config", (req, res) => {
  res.json({
    supportedLanguages: env.i18n.supportedLanguages,
    defaultLanguage: env.i18n.defaultLanguage,
  });
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", env: env.nodeEnv }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: req.t("common.notFound") });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: env.isProd ? req.t("common.error") : err.message,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
});

export default app;

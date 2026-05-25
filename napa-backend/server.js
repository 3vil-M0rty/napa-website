// server.js — Entry point
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import logger from "./src/middleware/logger.js";
import app from "./src/app.js";

const start = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`🍷 NAPA API running on port ${env.port} [${env.nodeEnv}]`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled rejection:", err);
    shutdown("unhandledRejection");
  });
};

start();

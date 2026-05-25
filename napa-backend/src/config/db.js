// src/config/db.js
import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../middleware/logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongodb.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    logger.error("MongoDB runtime error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected — attempting reconnect...");
  });
}

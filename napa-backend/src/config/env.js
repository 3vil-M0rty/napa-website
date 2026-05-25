// src/config/env.js
// Central place for all env variables — fail fast if critical ones are missing.
import dotenv from "dotenv";
dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  isProd: process.env.NODE_ENV === "production",

  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  cors: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "NAPA Chapter One <no-reply@napachapterone.com>",
  },

  i18n: {
    // Add new language codes to .env SUPPORTED_LANGUAGES — frontend reads this from /api/config
    supportedLanguages: (process.env.SUPPORTED_LANGUAGES || "en,fr,ar").split(",").map((l) => l.trim()),
    defaultLanguage: process.env.DEFAULT_LANGUAGE || "en",
  },
};

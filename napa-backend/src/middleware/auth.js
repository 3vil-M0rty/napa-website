// src/middleware/auth.js
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: req.t("auth.tokenExpired") });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: req.t("common.unauthorized") });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: req.t("auth.tokenExpired") });
  }
};

export const restrictTo = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: req.t("common.forbidden") });
    }
    next();
  };

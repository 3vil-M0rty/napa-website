// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

const signToken = (id) =>
  jwt.sign({ id }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, preferredLanguage } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: req.t("auth.emailTaken") });
    }

    const user = await User.create({ name, email, password, phone, preferredLanguage });
    const token = signToken(user._id);

    res.status(201).json({
      message: req.t("auth.registerSuccess"),
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: req.t("auth.invalidCredentials") });
    }

    const token = signToken(user._id);
    res.json({ message: req.t("auth.loginSuccess"), token, user });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

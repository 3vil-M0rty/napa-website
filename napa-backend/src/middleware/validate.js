// src/middleware/validate.js
import { validationResult } from "express-validator";

// Drop this after any array of express-validator checks
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: req.t("common.validationError"),
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

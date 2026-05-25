// src/routes/tables.js
import { Router } from "express";
import { body } from "express-validator";
import { getAllTables, getAvailableTables, createTable, updateTable, deleteTable } from "../controllers/tableController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Public
router.get("/", getAllTables);
router.get("/available", getAvailableTables);

// Admin only
router.use(protect, restrictTo("admin"));

router.post(
  "/",
  [
    body("number").isInt({ min: 1 }).withMessage("Table number must be a positive integer"),
    body("capacity").isInt({ min: 1, max: 20 }).withMessage("Capacity must be 1–20"),
    body("zone").isIn(["bar", "terrace", "main-hall", "private"]).withMessage("Invalid zone"),
  ],
  validate,
  createTable
);

router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;

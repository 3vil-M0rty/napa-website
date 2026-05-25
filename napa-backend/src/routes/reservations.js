// src/routes/reservations.js
import { Router } from "express";
import { body } from "express-validator";
import {
  createReservation,
  getAllReservations,
  getMyReservations,
  getReservation,
  getByConfirmationCode,
  updateReservation,
  cancelReservation,
} from "../controllers/reservationController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const reservationValidation = [
  body("guestName").trim().notEmpty().withMessage("Guest name is required"),
  body("guestEmail").isEmail().withMessage("Valid email is required"),
  body("tableId").isMongoId().withMessage("Valid table ID is required"),
  body("partySize").isInt({ min: 1 }).withMessage("Party size must be at least 1"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("timeSlot").matches(/^([01]\d|2[0-3]):([03]0)$/).withMessage("Time slot must be HH:00 or HH:30"),
];

// Public
router.post("/", reservationValidation, validate, createReservation);
router.get("/by-code/:code", getByConfirmationCode);

// Authenticated
router.use(protect);
router.get("/my", getMyReservations);
router.get("/:id", getReservation);
router.put("/:id", updateReservation);
router.delete("/:id", cancelReservation);

// Admin
router.get("/", restrictTo("admin", "staff"), getAllReservations);

export default router;

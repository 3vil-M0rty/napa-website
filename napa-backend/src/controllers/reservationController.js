// src/controllers/reservationController.js
import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import { sendReservationConfirmation } from "../services/emailService.js";

// ── Helpers ───────────────────────────────────────────────

const checkTableAvailability = async (tableId, date, timeSlot, excludeId = null) => {
  const requestedDate = new Date(date);
  requestedDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(requestedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const query = {
    table: tableId,
    date: { $gte: requestedDate, $lt: nextDay },
    timeSlot,
    status: { $nin: ["cancelled", "no-show"] },
  };
  if (excludeId) query._id = { $ne: excludeId };

  const conflict = await Reservation.findOne(query);
  return !conflict; // true = available
};

// ── Controllers ───────────────────────────────────────────

// POST /api/reservations
export const createReservation = async (req, res) => {
  try {
    const { tableId, partySize, date, timeSlot, guestName, guestEmail, guestPhone, specialRequests, occasion } = req.body;

    // Validate date is in the future
    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: req.t("reservation.pastDate") });
    }

    // Check table exists
    const table = await Table.findById(tableId);
    if (!table || !table.isActive) {
      return res.status(404).json({ message: req.t("table.notFound") });
    }

    // Check capacity
    if (partySize > table.capacity) {
      return res.status(400).json({ message: req.t("reservation.noTablesAvailable") });
    }

    // Check availability
    const available = await checkTableAvailability(tableId, date, timeSlot);
    if (!available) {
      return res.status(409).json({ message: req.t("reservation.noTablesAvailable") });
    }

    const reservation = await Reservation.create({
      table: tableId,
      user: req.user?._id || null,
      partySize,
      date,
      timeSlot,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      occasion,
      status: "confirmed",
    });

    // Send confirmation email (non-blocking)
    sendReservationConfirmation(reservation, req.language).catch(() => {});

    res.status(201).json({
      message: req.t("reservation.created"),
      reservation: await reservation.populate("table"),
    });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// GET /api/reservations  (admin — all reservations)
export const getAllReservations = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reservations, total] = await Promise.all([
      Reservation.find(filter).populate("table user").sort({ date: 1, timeSlot: 1 }).skip(skip).limit(parseInt(limit)),
      Reservation.countDocuments(filter),
    ]);

    res.json({
      reservations,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// GET /api/reservations/my  (logged-in user)
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("table")
      .sort({ date: -1 });
    res.json({ reservations });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// GET /api/reservations/:id
export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("table user");
    if (!reservation) return res.status(404).json({ message: req.t("reservation.notFound") });

    // Non-admins can only view their own
    if (req.user.role === "guest" && reservation.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: req.t("common.forbidden") });
    }

    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// GET /api/reservations/by-code/:code  (public — for confirmation page)
export const getByConfirmationCode = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ confirmationCode: req.params.code }).populate("table");
    if (!reservation) return res.status(404).json({ message: req.t("reservation.notFound") });
    res.json({ reservation });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// PUT /api/reservations/:id  (admin or owner)
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: req.t("reservation.notFound") });

    // If changing table/time, re-check availability
    if (req.body.tableId || req.body.date || req.body.timeSlot) {
      const tableId = req.body.tableId || reservation.table;
      const date = req.body.date || reservation.date;
      const timeSlot = req.body.timeSlot || reservation.timeSlot;
      const available = await checkTableAvailability(tableId, date, timeSlot, reservation._id);
      if (!available) return res.status(409).json({ message: req.t("reservation.noTablesAvailable") });
    }

    if (req.body.tableId) req.body.table = req.body.tableId;
    Object.assign(reservation, req.body);
    await reservation.save();

    res.json({ message: req.t("reservation.updated"), reservation });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// DELETE /api/reservations/:id  (cancel)
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: req.t("reservation.notFound") });
    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: req.t("reservation.alreadyCancelled") });
    }

    reservation.status = "cancelled";
    reservation.cancelledAt = new Date();
    reservation.cancelledBy = req.user._id;
    await reservation.save();

    res.json({ message: req.t("reservation.cancelled") });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

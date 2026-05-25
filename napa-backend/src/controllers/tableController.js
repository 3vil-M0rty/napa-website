// src/controllers/tableController.js
import Table from "../models/Table.js";
import Reservation from "../models/Reservation.js";

// GET /api/tables
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true });
    res.json({ tables });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// GET /api/tables/available?date=&timeSlot=&partySize=
export const getAvailableTables = async (req, res) => {
  try {
    const { date, timeSlot, partySize } = req.query;

    if (!date || !timeSlot || !partySize) {
      return res.status(400).json({ message: req.t("common.validationError") });
    }

    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(requestedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find reservations already booked at that date+slot
    const bookedReservations = await Reservation.find({
      date: { $gte: requestedDate, $lt: nextDay },
      timeSlot,
      status: { $nin: ["cancelled", "no-show"] },
    }).select("table");

    const bookedTableIds = bookedReservations.map((r) => r.table.toString());

    const availableTables = await Table.find({
      isActive: true,
      capacity: { $gte: parseInt(partySize, 10) },
      _id: { $nin: bookedTableIds },
    });

    res.json({ tables: availableTables });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// POST /api/tables  (admin)
export const createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ message: req.t("table.created"), table });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// PUT /api/tables/:id  (admin)
export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!table) return res.status(404).json({ message: req.t("table.notFound") });
    res.json({ message: req.t("table.updated"), table });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

// DELETE /api/tables/:id  (admin — soft delete)
export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!table) return res.status(404).json({ message: req.t("table.notFound") });
    res.json({ message: req.t("common.success") });
  } catch (err) {
    res.status(500).json({ message: req.t("common.error"), error: err.message });
  }
};

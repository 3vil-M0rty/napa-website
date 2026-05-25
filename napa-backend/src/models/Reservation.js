// src/models/Reservation.js
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // Guest info — can be a registered user or a walk-in
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, "Guest email is required"],
      lowercase: true,
      trim: true,
    },
    guestPhone: {
      type: String,
      trim: true,
    },

    // Booking details
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      required: true,
    },
    // Slot: "18:00", "18:30", "19:00", …
    timeSlot: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([03]0)$/, "Time slot must be HH:00 or HH:30"],
    },
    // Duration in minutes — default 90 min
    duration: {
      type: Number,
      default: 90,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    specialRequests: {
      type: String,
      maxlength: 500,
    },
    occasion: {
      type: String,
      enum: ["birthday", "anniversary", "business", "date", "other", null],
      default: null,
    },

    // Internal reference for confirmation email / QR code
    confirmationCode: {
      type: String,
      unique: true,
    },

    // Track email notifications sent
    emailsSent: {
      confirmation: { type: Boolean, default: false },
      reminder: { type: Boolean, default: false },
    },

    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compound index to find reservations on a table at a given time quickly
reservationSchema.index({ table: 1, date: 1, timeSlot: 1 });
reservationSchema.index({ guestEmail: 1, date: -1 });
reservationSchema.index({ confirmationCode: 1 });

// Auto-generate confirmation code before save
reservationSchema.pre("save", function (next) {
  if (!this.confirmationCode) {
    this.confirmationCode = `NAPA-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
  }
  next();
});

export default mongoose.model("Reservation", reservationSchema);

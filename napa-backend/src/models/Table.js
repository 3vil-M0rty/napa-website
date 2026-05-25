// src/models/Table.js
import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    zone: {
      // e.g. "bar", "terrace", "main-hall", "private"
      type: String,
      required: true,
      enum: ["bar", "terrace", "main-hall", "private"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      maxlength: 300,
    },
    // 3D position for the floor-plan visualization in the frontend
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

tableSchema.index({ zone: 1, capacity: 1 });

export default mongoose.model("Table", tableSchema);

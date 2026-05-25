// src/scripts/seed.js
// Run: node src/scripts/seed.js
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Table from "../models/Table.js";
import User from "../models/User.js";
import logger from "../middleware/logger.js";

const tables = [
  // Bar zone
  { number: 1, capacity: 2, zone: "bar", position: { x: -3, y: 0, z: 0 } },
  { number: 2, capacity: 2, zone: "bar", position: { x: -1.5, y: 0, z: 0 } },
  { number: 3, capacity: 4, zone: "bar", position: { x: 0, y: 0, z: 0 } },
  // Terrace
  { number: 4, capacity: 2, zone: "terrace", position: { x: 3, y: 0, z: 2 } },
  { number: 5, capacity: 4, zone: "terrace", position: { x: 5, y: 0, z: 2 } },
  { number: 6, capacity: 6, zone: "terrace", position: { x: 7, y: 0, z: 2 } },
  // Main hall
  { number: 7, capacity: 4, zone: "main-hall", position: { x: -3, y: 0, z: 5 } },
  { number: 8, capacity: 4, zone: "main-hall", position: { x: 0, y: 0, z: 5 } },
  { number: 9, capacity: 6, zone: "main-hall", position: { x: 3, y: 0, z: 5 } },
  { number: 10, capacity: 8, zone: "main-hall", position: { x: 0, y: 0, z: 8 } },
  // Private
  { number: 11, capacity: 10, zone: "private", notes: "Private dining room, requires 48h advance booking", position: { x: 0, y: 0, z: 12 } },
  { number: 12, capacity: 20, zone: "private", notes: "Event space, full buyout available", position: { x: 0, y: 0, z: 16 } },
];

const adminUser = {
  name: "NAPA Admin",
  email: "admin@napachapterone.com",
  password: "Admin@2024!",
  role: "admin",
};

const seed = async () => {
  await connectDB();
  logger.info("Seeding database...");

  await Table.deleteMany({});
  await Table.insertMany(tables);
  logger.info(`✓ ${tables.length} tables created`);

  const existingAdmin = await User.findOne({ email: adminUser.email });
  if (!existingAdmin) {
    await User.create(adminUser);
    logger.info("✓ Admin user created");
  } else {
    logger.info("✓ Admin user already exists");
  }

  logger.info("Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  logger.error("Seed failed:", err);
  process.exit(1);
});

import bcrypt from "bcrypt";
import User from "../models/User.js";

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const defaults = [
    {
      firstName: "System",
      lastName: "Admin",
      email: "admin@example.com",
      role: "admin",
      phoneNumber: "0780000001",
    },
    {
      firstName: "John",
      lastName: "Patient",
      email: "patient@example.com",
      role: "student",
      phoneNumber: "0780000002",
    },
    {
      firstName: "Alice",
      lastName: "Doctor",
      email: "doctor@example.com",
      role: "admin",
      phoneNumber: "0780000003",
    },
  ];

  for (const entry of defaults) {
    await User.findOrCreate({
      where: { email: entry.email },
      defaults: {
        ...entry,
        password: hashedPassword,
        status: "active",
      },
    });
  }
};

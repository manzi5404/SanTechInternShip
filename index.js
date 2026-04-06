import express from "express";
import { Sequelize } from "sequelize";
import sequelize from "./src/config/db.js";

import User from "./src/database/models/User.js";
import Company from "./src/database/models/Company.js";
import Internship from "./src/database/models/Internship.js";
import Application from "./src/database/models/Application.js";
import Appointment from "./src/database/models/Appointment.js";

const app = express();
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return sequelize.sync(); // or sync({ force: true }) if needed
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Your database is connected and server is running");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });

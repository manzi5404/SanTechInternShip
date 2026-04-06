import sequelize from "../src/config/db.js";
import User from "../src/database/models/User.js";
import Company from "../src/database/models/Company.js";
import Internship from "../src/database/models/Internship.js";
import Application from "../src/database/models/Application.js";
import Appointment from "../src/database/models/Appointment.js";
import { seedInitialData } from "../src/database/seeds/seedInitialData.js";

const syncDatabase = async () => {
  try {
    console.log("Syncing database...");
    
    await sequelize.authenticate(); 
    console.log("Connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");

    await seedInitialData();
    console.log("Seed data created successfully.");
    
    process.exit(0);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

syncDatabase();
import sequelize from "../src/config/db.js";
import User from "../src/database/models/User.js";
import Company from "../src/database/models/Company.js";
import Internship from "../src/database/models/Internship.js";
import Application from "../src/database/models/Application.js";
import Appointment from "../src/database/models/Appointment.js";
import DoctorAvailability from "../src/database/models/DoctorAvailability.js";
import Notification from "../src/database/models/Notification.js";
import { seedInitialData } from "../src/database/seeds/seedInitialData.js";
import { seedUsers } from "../src/database/seeds/user.js";
import { seedDoctorAvailabilities } from "../src/database/seeds/doctorAvailabilities.js";
import { seedAppointments } from "../src/database/seeds/appointments.js";
import { seedNotifications } from "../src/database/seeds/notifications.js";

const syncDatabase = async () => {
  try {
    console.log("Syncing database...");
    
    await sequelize.authenticate(); 
    console.log("Connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");

    await seedInitialData();
    await seedUsers();
    await seedDoctorAvailabilities();
    await seedAppointments();
    await seedNotifications();
    console.log("Seed data created successfully.");
    
    process.exit(0);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

syncDatabase();

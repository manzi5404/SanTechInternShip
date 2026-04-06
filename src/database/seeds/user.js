import sequelize from "../src/config/db.js";
import user from "../src/database/models/User.js";
// Import your seeder function here (adjust the path to where your seeder file is)
import { seedUsers } from "./path/to/your/seeder.js"; 

const syncDatabase = async () => {
  try {
    console.log("Syncing database...");
    await sequelize.authenticate();
    
    // 1. Sync the tables first
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");

    // 2. Call the seeder function here
    console.log("Seeding data...");
    await seedUsers(); 
    
    process.exit(0);
  } catch (error) {
    console.error("Error during sync/seed:", error);
    process.exit(1);
  }
}

syncDatabase();
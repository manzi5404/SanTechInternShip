import sequelize from "../src/config/db.js";
import user from "../src/database/models/User.js";

const syncDatabase = async () => {
  try {
    console.log("Syncing database...");
    
    // Fixed typo: authenticate (not authhenticate)
    await sequelize.authenticate(); 
    console.log("Connection has been established successfully.");

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

syncDatabase();
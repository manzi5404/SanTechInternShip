import sequelize from "../../config/db";
import User from "../database/models/User.js";

export const createUserTable = async () => {
    await sequelize.authenticate();
    await User.sync({ force: true }); // This will drop the table if it already exists and recreate it
    console.log("User table created successfully.");
};
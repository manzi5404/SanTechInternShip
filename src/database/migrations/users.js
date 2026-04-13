import sequelize from "../../config/db.js";
import { DataTypes } from "sequelize";

const getNormalizedTableNames = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  return tables.map((table) =>
    String(typeof table === "string" ? table : table.tableName || table.TABLE_NAME).toLowerCase()
  );
};

export const createUsersTable = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableNames = await getNormalizedTableNames(queryInterface);

  if (tableNames.includes("users")) {
    return;
  }

  await queryInterface.createTable("Users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("student", "company", "admin"),
      defaultValue: "student",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
};

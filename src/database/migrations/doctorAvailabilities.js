import sequelize from "../../config/db.js";
import { DataTypes } from "sequelize";

const getNormalizedTableNames = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  return tables.map((table) =>
    String(typeof table === "string" ? table : table.tableName || table.TABLE_NAME).toLowerCase()
  );
};

export const createDoctorAvailabilitiesTable = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableNames = await getNormalizedTableNames(queryInterface);

  if (tableNames.includes("doctoravailabilities")) {
    return;
  }

  await queryInterface.createTable("DoctorAvailabilities", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    available_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "booked", "unavailable"),
      defaultValue: "available",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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

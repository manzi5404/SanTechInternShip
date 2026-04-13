import sequelize from "../../config/db.js";
import { DataTypes } from "sequelize";

const getNormalizedTableNames = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  return tables.map((table) =>
    String(typeof table === "string" ? table : table.tableName || table.TABLE_NAME).toLowerCase()
  );
};

export const createNotificationsTable = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableNames = await getNormalizedTableNames(queryInterface);

  if (tableNames.includes("notifications")) {
    return;
  }

  await queryInterface.createTable("Notifications", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    related_appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Appointments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    type: {
      type: DataTypes.ENUM("reminder", "status_update", "system"),
      defaultValue: "system",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

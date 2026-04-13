import sequelize from "../../config/db.js";
import { DataTypes } from "sequelize";

const getNormalizedTableNames = async (queryInterface) => {
  const tables = await queryInterface.showAllTables();
  return tables.map((table) =>
    String(typeof table === "string" ? table : table.tableName || table.TABLE_NAME).toLowerCase()
  );
};

export const createAppointmentsTable = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableNames = await getNormalizedTableNames(queryInterface);

  if (!tableNames.includes("appointments")) {
    await queryInterface.createTable("Appointments", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      doctor_availability_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "DoctorAvailabilities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      appointment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      appointment_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected", "completed", "cancelled"),
        defaultValue: "pending",
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      doctor_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancelled_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancellation_reason: {
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
    return;
  }

  const columns = await queryInterface.describeTable("Appointments");
  if (!Object.prototype.hasOwnProperty.call(columns, "doctor_availability_id")) {
    await queryInterface.addColumn("Appointments", "doctor_availability_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "DoctorAvailabilities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  }
};

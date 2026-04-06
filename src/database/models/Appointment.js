import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./User.js";

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
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
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Appointment, { foreignKey: "patient_id", as: "patientAppointments" });
Appointment.belongsTo(User, { foreignKey: "patient_id", as: "patient" });

User.hasMany(Appointment, { foreignKey: "doctor_id", as: "doctorAppointments" });
Appointment.belongsTo(User, { foreignKey: "doctor_id", as: "doctor" });

User.hasMany(Appointment, { foreignKey: "approved_by", as: "approvedAppointments" });
Appointment.belongsTo(User, { foreignKey: "approved_by", as: "approvedBy" });

User.hasMany(Appointment, { foreignKey: "cancelled_by", as: "cancelledAppointments" });
Appointment.belongsTo(User, { foreignKey: "cancelled_by", as: "cancelledBy" });

export default Appointment;

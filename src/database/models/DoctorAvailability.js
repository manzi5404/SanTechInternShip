import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./User.js";

const DoctorAvailability = sequelize.define("DoctorAvailability", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
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
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(DoctorAvailability, {
  foreignKey: "doctor_id",
  as: "doctorAvailabilities",
});
DoctorAvailability.belongsTo(User, { foreignKey: "doctor_id", as: "doctor" });

export default DoctorAvailability;

import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./User.js";
import Appointment from "./Appointment.js";

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  related_appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Appointments",
      key: "id",
    },
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
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

Appointment.hasMany(Notification, {
  foreignKey: "related_appointment_id",
  as: "notifications",
});
Notification.belongsTo(Appointment, {
  foreignKey: "related_appointment_id",
  as: "appointment",
});

export default Notification;

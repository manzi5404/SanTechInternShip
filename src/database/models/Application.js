import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./User.js";
import Internship from "./Internship.js";

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  internshipId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Internships",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected", "interview"),
    defaultValue: "pending",
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(Application, { foreignKey: "userId" });
Application.belongsTo(User, { foreignKey: "userId" });

Internship.hasMany(Application, { foreignKey: "internshipId" });
Application.belongsTo(Internship, { foreignKey: "internshipId" });

export default Application;
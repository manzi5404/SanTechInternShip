import Notification from "../database/models/Notification.js";
import User from "../database/models/User.js";
import Appointment from "../database/models/Appointment.js";

const parseId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const createNotification = async (req, res) => {
  try {
    const { user_id, message, related_appointment_id } = req.body;
    if (!user_id || !message) {
      return res.status(400).json({ success: false, message: "user_id and message are required" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid user_id" });
    }

    if (related_appointment_id) {
      const appointment = await Appointment.findByPk(related_appointment_id);
      if (!appointment) {
        return res.status(400).json({ success: false, message: "Invalid related_appointment_id" });
      }
    }

    const notification = await Notification.create(req.body);
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const whereClause = userId ? { user_id: userId } : {};

    const notifications = await Notification.findAll({
      where: whereClause,
      include: [{ association: "user" }, { association: "appointment" }],
      order: [["id", "DESC"]],
    });
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch notifications", error: error.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    const notification = await Notification.findByPk(id, {
      include: [{ association: "user" }, { association: "appointment" }],
    });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch notification", error: error.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await notification.update(req.body);
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update notification", error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    await notification.destroy();
    return res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete notification", error: error.message });
  }
};

import Notification from "../models/Notification.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export const seedNotifications = async () => {
  const patient = await User.findOne({ where: { email: "patient@example.com" } });
  const appointment = await Appointment.findOne({
    where: patient ? { patient_id: patient.id } : undefined,
    order: [["createdAt", "DESC"]],
  });

  if (!patient) {
    return;
  }

  await Notification.findOrCreate({
    where: {
      user_id: patient.id,
      message: "Your appointment request has been received.",
    },
    defaults: {
      related_appointment_id: appointment?.id || null,
      type: "status_update",
      is_read: false,
    },
  });
};

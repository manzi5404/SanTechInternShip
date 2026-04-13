import DoctorAvailability from "../models/DoctorAvailability.js";
import User from "../models/User.js";

export const seedDoctorAvailabilities = async () => {
  const doctor = await User.findOne({ where: { email: "doctor@example.com" } });
  if (!doctor) {
    return;
  }

  const slotDate = new Date();
  slotDate.setDate(slotDate.getDate() + 1);
  const availableDate = slotDate.toISOString().slice(0, 10);

  await DoctorAvailability.findOrCreate({
    where: {
      doctor_id: doctor.id,
      available_date: availableDate,
      start_time: "09:00:00",
      end_time: "10:00:00",
    },
    defaults: {
      status: "available",
      notes: "Morning consultation block",
    },
  });
};

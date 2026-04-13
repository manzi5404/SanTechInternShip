import Appointment from "../models/Appointment.js";
import DoctorAvailability from "../models/DoctorAvailability.js";
import User from "../models/User.js";

export const seedAppointments = async () => {
  const patient = await User.findOne({ where: { email: "patient@example.com" } });
  const doctor = await User.findOne({ where: { email: "doctor@example.com" } });
  const availability = await DoctorAvailability.findOne({
    where: { doctor_id: doctor?.id },
    order: [["available_date", "ASC"]],
  });

  if (!patient || !doctor) {
    return;
  }

  const appointmentDate =
    availability?.available_date ||
    new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10);

  await Appointment.findOrCreate({
    where: {
      patient_id: patient.id,
      doctor_id: doctor.id,
      appointment_date: appointmentDate,
      appointment_time: availability?.start_time || "09:00:00",
    },
    defaults: {
      doctor_availability_id: availability?.id || null,
      status: "pending",
      reason: "Initial checkup consultation",
      location: "Main Clinic - Room 2",
      start_time: availability?.start_time || "09:00:00",
      end_time: availability?.end_time || "09:30:00",
      duration: "30 minutes",
    },
  });
};

import Appointment from "../database/models/Appointment.js";
import User from "../database/models/User.js";
import DoctorAvailability from "../database/models/DoctorAvailability.js";
import Notification from "../database/models/Notification.js";

const parseId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, doctor_availability_id, appointment_date, appointment_time } = req.body;
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: "patient_id, doctor_id, appointment_date and appointment_time are required",
      });
    }

    const [patient, doctor] = await Promise.all([
      User.findByPk(patient_id),
      User.findByPk(doctor_id),
    ]);
    if (!patient || !doctor) {
      return res.status(400).json({ success: false, message: "Invalid patient_id or doctor_id" });
    }

    if (doctor_availability_id) {
      const availability = await DoctorAvailability.findByPk(doctor_availability_id);
      if (!availability) {
        return res.status(400).json({ success: false, message: "Invalid doctor_availability_id" });
      }
    }

    const appointment = await Appointment.create(req.body);

    await Notification.create({
      user_id: doctor_id,
      message: `New appointment request from ${patient.firstName} ${patient.lastName} for ${appointment_date} at ${appointment_time}`,
      related_appointment_id: appointment.id,
    });

    return res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

export const getAppointments = async (_req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { association: "patient" },
        { association: "doctor" },
        { association: "doctorAvailability" },
      ],
      order: [["id", "DESC"]],
    });
    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointment = await Appointment.findByPk(id, {
      include: [
        { association: "patient" },
        { association: "doctor" },
        { association: "doctorAvailability" },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch appointment", error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointment = await Appointment.findByPk(id, {
      include: [
        { association: "patient" },
        { association: "doctor" },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const wasCancelled = req.body.status === "cancelled" && appointment.status !== "cancelled";
    const previousStatus = appointment.status;

    await appointment.update(req.body);

    if (wasCancelled) {
      await appointment.update({
        cancelled_by: req.user?.id,
        cancelled_at: new Date(),
      });

      await Notification.create({
        user_id: appointment.patient_id,
        message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been cancelled. Reason: ${req.body?.cancellation_reason || "No reason provided"}`,
        related_appointment_id: appointment.id,
      });
    }

    if (req.body.status === "approved" && previousStatus === "pending") {
      await Notification.create({
        user_id: appointment.patient_id,
        message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been approved.`,
        related_appointment_id: appointment.id,
      });
    }

    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update appointment", error: error.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const doctorId = parseId(req.params.doctorId);
    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Invalid doctor id" });
    }

    const appointments = await Appointment.findAll({
      where: { doctor_id: doctorId },
      include: [
        { association: "patient" },
        { association: "doctor" },
        { association: "doctorAvailability" },
      ],
      order: [["appointment_date", "DESC"], ["appointment_time", "DESC"]],
    });

    return res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch doctor appointments", error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const cancellation_reason = req.body?.cancellation_reason || null;

    const appointment = await Appointment.findByPk(id, {
      include: [
        { association: "patient" },
        { association: "doctor" },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Appointment already cancelled" });
    }

    await appointment.update({
      status: "cancelled",
      cancellation_reason: cancellation_reason || null,
      cancelled_by: req.user?.id,
      cancelled_at: new Date(),
    });

    await Notification.create({
      user_id: appointment.patient_id,
      message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} has been cancelled by the doctor. Reason: ${cancellation_reason || "No reason provided"}`,
      related_appointment_id: appointment.id,
    });

    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to cancel appointment", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await appointment.destroy();
    return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete appointment", error: error.message });
  }
};

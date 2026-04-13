import DoctorAvailability from "../database/models/DoctorAvailability.js";
import User from "../database/models/User.js";

const parseId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export const createDoctorAvailability = async (req, res) => {
  try {
    const { doctor_id, available_date, start_time, end_time } = req.body;
    if (!doctor_id || !available_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "doctor_id, available_date, start_time and end_time are required",
      });
    }

    const doctor = await User.findByPk(doctor_id);
    if (!doctor) {
      return res.status(400).json({ success: false, message: "Invalid doctor_id" });
    }

    const availability = await DoctorAvailability.create(req.body);
    return res.status(201).json({ success: true, data: availability });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create doctor availability",
      error: error.message,
    });
  }
};

export const getDoctorAvailabilities = async (_req, res) => {
  try {
    const data = await DoctorAvailability.findAll({
      include: [{ association: "doctor" }],
      order: [["available_date", "ASC"], ["start_time", "ASC"]],
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor availabilities",
      error: error.message,
    });
  }
};

export const getDoctorAvailabilityById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid availability id" });
    }

    const availability = await DoctorAvailability.findByPk(id, {
      include: [{ association: "doctor" }],
    });
    if (!availability) {
      return res.status(404).json({ success: false, message: "Doctor availability not found" });
    }

    return res.status(200).json({ success: true, data: availability });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor availability",
      error: error.message,
    });
  }
};

export const updateDoctorAvailability = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid availability id" });
    }

    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ success: false, message: "Doctor availability not found" });
    }

    await availability.update(req.body);
    return res.status(200).json({ success: true, data: availability });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor availability",
      error: error.message,
    });
  }
};

export const deleteDoctorAvailability = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid availability id" });
    }

    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ success: false, message: "Doctor availability not found" });
    }

    await availability.destroy();
    return res.status(200).json({ success: true, message: "Doctor availability deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete doctor availability",
      error: error.message,
    });
  }
};

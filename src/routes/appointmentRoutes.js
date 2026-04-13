import { Router } from "express";
import {
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  getAppointmentsByDoctor,
  updateAppointment,
} from "../controller/appointmentController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", createAppointment);
router.get("/", authMiddleware, getAppointments);
router.get("/doctor/:doctorId", authMiddleware, getAppointmentsByDoctor);
router.get("/:id", authMiddleware, getAppointmentById);
router.put("/:id", authMiddleware, updateAppointment);
router.post("/:id/cancel", authMiddleware, cancelAppointment);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteAppointment);

export default router;

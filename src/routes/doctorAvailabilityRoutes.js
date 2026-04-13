import { Router } from "express";
import {
  createDoctorAvailability,
  deleteDoctorAvailability,
  getDoctorAvailabilities,
  getDoctorAvailabilityById,
  updateDoctorAvailability,
} from "../controller/doctorAvailabilityController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, createDoctorAvailability);
router.get("/", authMiddleware, getDoctorAvailabilities);
router.get("/:id", authMiddleware, getDoctorAvailabilityById);
router.put("/:id", authMiddleware, updateDoctorAvailability);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteDoctorAvailability);

export default router;

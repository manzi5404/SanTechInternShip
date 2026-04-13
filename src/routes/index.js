import { Router } from "express";
import appointmentRoutes from "./appointmentRoutes.js";
import doctorAvailabilityRoutes from "./doctorAvailabilityRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/doctor-availabilities", doctorAvailabilityRoutes);
router.use("/notifications", notificationRoutes);

export default router;

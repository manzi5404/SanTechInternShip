import { Router } from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
} from "../controller/notificationController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, createNotification);
router.get("/", authMiddleware, getNotifications);
router.get("/:id", authMiddleware, getNotificationById);
router.put("/:id", authMiddleware, updateNotification);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteNotification);

export default router;

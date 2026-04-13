import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from "../controller/userController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.post("/", createUser);
router.get("/", authMiddleware, requireRole("admin"), getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteUser);

export default router;
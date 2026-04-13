import crypto from "crypto";
import User from "../database/models/User.js";
import { generateToken } from "../middleware/auth.js";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const parseUserId = (idParam) => {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber, profile_image, status } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "firstName, lastName, email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with this email already exists" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
      profile_image,
      status,
    });

    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll({ order: [["id", "ASC"]] });
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = parseUserId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = parseUserId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { email } = req.body;
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User with this email already exists" });
      }
    }

    await user.update(req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = parseUserId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    await user.update({ isVerified: true, verificationToken: null });
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000);

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset token generated",
      data: { resetToken },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Password reset request failed", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const user = await User.findOne({ where: { resetPasswordToken: token } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (user.resetPasswordExpires < new Date()) {
      await user.update({ resetPasswordToken: null, resetPasswordExpires: null });
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Password reset failed", error: error.message });
  }
};

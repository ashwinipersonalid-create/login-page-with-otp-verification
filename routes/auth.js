import express from "express";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendSMS } from "../utils/sendSMS.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router = express.Router();

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ------------------------
// 1️⃣ Login with Username & Password
// ------------------------
router.post("/login-password", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = generateToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------------
// 2️⃣ Login via Email OTP
// ------------------------
router.post("/login-email-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.emailOTP = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.emailOTP ||
      !user.otpExpires ||
      user.otpExpires < Date.now() ||
      !(await bcrypt.compare(otp, user.emailOTP))
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.emailOTP = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------------
// 3️⃣ Login via Phone OTP
// ------------------------
router.post("/login-phone-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).json({ success: false, message: "Phone number required" });

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(400).json({ success: false, message: "Phone not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.phoneOTP = hashedOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendSMS(phone, `Your OTP is: ${otp}. It will expire in 10 minutes.`);
    res.json({ success: true, message: "OTP sent via SMS" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/verify-phone-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp)
      return res.status(400).json({ success: false, message: "Phone and OTP required" });

    const user = await User.findOne({ phone });
    if (
      !user ||
      !user.phoneOTP ||
      !user.otpExpires ||
      user.otpExpires < Date.now() ||
      !(await bcrypt.compare(otp, user.phoneOTP))
    ) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.phoneOTP = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------------
// 4️⃣ Forgot Password (Email Link)
// ------------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Email not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Reset Password",
      text: `Click here to reset your password: ${resetUrl}`,
    });

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password)
      return res.status(400).json({ success: false, message: "Password required" });

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired token" });

    user.password = password; // hashed automatically in pre-save hook
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;


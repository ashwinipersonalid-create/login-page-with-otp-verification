import { User } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP to email
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Fix: Proper check for cooldown (1 minute)
    if (user.otpExpires && Date.now() < user.otpExpires - 9 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "OTP already sent. Please wait before requesting again.",
      });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // ✅ Save hashed OTP and expiry (10 min)
    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Verify OTP and generate JWT
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email & OTP required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP not requested" });
    }

    // ✅ Fix: Check expiry properly
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // ✅ Compare input OTP with hashed OTP
    const isMatch = await bcrypt.compare(otp.toString().trim(), user.otp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    // ✅ Clear OTP after success
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

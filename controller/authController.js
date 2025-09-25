import { User } from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.emailOTP = hashedOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

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

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.emailOTP || !user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP not requested" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp.trim(), user.emailOTP);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    // Clear OTP
    user.emailOTP = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, message: "OTP verified", token });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

import express from "express";
import { sendOtp, verifyOtp } from "../controller/otpController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { sendOtpValidation, verifyOtpValidation } from "../validation/otp.validation.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp", validate(sendOtpValidation), sendOtp);
router.post("/verify-otp", validate(verifyOtpValidation), verifyOtp);

export default router;

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otpRoutes.js";

// 1️⃣ Load environment variables
dotenv.config(); 

// 2️⃣ Debug: check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected to 'login_details'"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

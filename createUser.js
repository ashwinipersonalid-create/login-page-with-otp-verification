import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";

dotenv.config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const newUser = new User({
      username: "ash",
      email: "ashwinipersonalid@gmail.com",
      phone: "9080818613",
      password: "123456",
    });

    await newUser.save();
    console.log("User created with hashed password");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createUser();

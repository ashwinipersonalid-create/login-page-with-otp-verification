import jwt from "jsonwebtoken";
import { promisify } from "util";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    res.status(401).json({ success: false, message });
  }
};


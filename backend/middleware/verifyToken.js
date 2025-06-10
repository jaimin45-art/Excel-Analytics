// middleware/verifyToken.js
import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token payload" });
    }

    // Fetch full user from DB using ID
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user; // Full user object
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

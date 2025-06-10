// 📁 utils/generateJWTToken.js
import jwt from "jsonwebtoken";

export const generateJWTToken = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role }, // ✅ now includes role
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

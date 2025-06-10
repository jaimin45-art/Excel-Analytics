import { User } from "../model/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";

import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail
} from "../resend/email.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role, // ✅ admin or user
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    await user.save();

    generateJWTToken(res, user._id, user.role); // ✅ send role too
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ LOGIN
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(400).json({ success: false, message: "Incorrect password" });

//     if (!user.isVerified) {
//       return res.status(400).json({ success: false, message: "Email not verified" });
//     }

//     generateJWTToken(res, user._id, user.role); // ✅ send role in token

//     res.status(200).json({ success: true, message: "Login successful" });
//   } catch (error) {
//     console.log("Login error", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(400).json({ success: false, message: "Incorrect password" });

//     // ✅ If not verified, resend the token
//     if (!user.isVerified) {
//       const code = generateVerificationToken();
//       user.verificationToken = code;
//       user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
//       await user.save();

//       // Send verification email
//       await sendVerificationEmail(user.email, code);

//       return res.status(400).json({
//         success: false,
//         message: "Email not verified. Verification code sent again.",
//       });
//     }

//     // ✅ If verified, proceed
//     generateJWTToken(res, user._id, user.role);

//     res.status(200).json({ success: true, message: "Login successful" });
//   } catch (error) {
//     console.log("Login error", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(400).json({ success: false, message: "Incorrect password" });

//     if (!user.isVerified) {
//       // 🔁 Regenerate token each time login attempted without verification
//       const code = generateVerificationToken();
//       user.verificationToken = code;
//       user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
//       await user.save();

//       // 📧 Send verification code
//       await sendVerificationEmail(user.email, code);

//       return res.status(400).json({ success: false, message: "Email not verified. Code sent again." });
//     }

//     generateJWTToken(res, user._id, user.role); // ✅ JWT in cookie

//     res.status(200).json({ success: true, message: "Login successful" });
//   } catch (error) {
//     console.log("Login error", error);
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ success: false, message: "Incorrect password" });

    if (!user.isVerified) {
      const code = generateVerificationToken();
      user.verificationToken = code;
      user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendVerificationEmail(user.email, code);

      return res.status(400).json({ success: false, message: "Email not verified. Code sent again." });
    }

    generateJWTToken(res, user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    console.log("Login error", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


// ✅ LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ✅ VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
    );

    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ CHECK AUTH
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

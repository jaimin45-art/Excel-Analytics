import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { verificationTokenEmailTemplate, WELCOME_EMAIL_TEMPLATE } from "./email-template.js";
dotenv.config();



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,         // apna gmail address yahan daalein
    pass: process.env.GMAIL_PASS,            // yahan Google App Password daalein
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.GMAIL_USER}>`,  // from address
      to: email,
      subject: "Verify Your Email Address",
      html: verificationTokenEmailTemplate.replace("{verificationToken}", verificationToken),
    });
    console.log("Verification email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
    console.log("Welcome email sent: ", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};


export const sendPasswordResetEmail = async (email, resetURL)=>{
    try {
        const { data, error } = await transporter.sendMail({
           from: `"Your App Name" <${process.env.GMAIL_USER}>`,
           to:[email],
           subject: "Reset Your Password",
           html:`Click <a href ="${resetURL}">here</a> to reset your password`,
        });
    } catch (error) {
        console.log("error sending passwordeset email", error)
    }
}

export const sendResetSuccessEmail = async (email) =>{
    try {
         const { data, error } = await transporter.sendMail({
           from: `"Your App Name" <${process.env.GMAIL_USER}>`,
           to:[email],
           subject: "Password Reset Was Successfully",
           html:`Your Password Was Reset Successfully`,
        });
    } catch (error) {
        console.log("error sending password reset successful email", error);
    }
} 
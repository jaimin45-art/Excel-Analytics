import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    role: {
  type: String,
  required: true,
  enum: ["user", "admin"],
  default: "user"
},
    resetPasswordToken:String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
})

export const User = mongoose.model("User", userSchema);
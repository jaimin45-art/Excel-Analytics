import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const { verifyEmail, isLoading } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (value.length !== 6) {
      toast({
        title: "Invalid Code ❌",
        description: "Code must be 6 digits.",
        variant: "destructive",
      });
      return;
    }
    const success = await verifyEmail(value);

    if (success) {
      toast({
        title: "Email Verified ✅",
        description: "Please login to continue.",
      });
      navigate("/login");
    } else {
      toast({
        title: "Invalid Code ❌",
        description: "Please enter the correct code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <img
            src="/email.jpeg"
            alt="Email Icon"
            className="w-20 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-blue-700">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            We’ve sent a 6-digit code to your email. Enter it below.
          </p>
        </div>

        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup className="mx-auto">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <div className="text-center text-sm text-gray-500">
          {value === ""
            ? "Enter your verification email code."
            : `You entered: ${value}`}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white transition duration-300 rounded-xl"
        >
          {isLoading ? "Verifying..." : "Verify Email Now"}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Didn’t receive the code?{" "}
          <span className="text-blue-700 hover:underline cursor-pointer">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}

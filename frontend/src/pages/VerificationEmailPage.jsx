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
    <div className="space-y-2 flex flex-col w-full max-w-md mx-auto justify-center">
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
      <div className="text-center text-sm">
        {value === "" ? "Enter your verification email code." : `You entered: ${value}`}
      </div>
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify Email Now"}
      </Button>
    </div>
  );
}

"use client"

import { verifyOTPSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useUserStore } from "../_stores/useUserStore";
import Cookies from "js-cookie";
import { useNavigate } from "@/hooks/useNavigate";
import { authService } from "../_services/auth.service";
import { toast } from "@workspace/ui/components/sonner";

export const useOTP = () => {
  const navigate = useNavigate();
  const [emailForOTP, setEmailForOTP] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isMaxAttempt, setIsMaxAttempt] = useState(false);
  const { setUser, setIsLoggedIn } = useUserStore();

  const otpForm = useForm<z.infer<typeof verifyOTPSchema>>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      email: emailForOTP,
      otp: "",
    },
  });

  useEffect(() => {
    const email =
      Cookies.get("pendingEmail") || Cookies.get("emailForResetOTP") || "";
    setEmailForOTP(email);
    otpForm.setValue("email", email);
  }, [otpForm]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    const savedAttempt = Cookies.get("OTP_attempt_count");
    const savedExpireTime = Cookies.get("OTP_expires_at");

    if (savedAttempt) {
      const attempt = parseInt(savedAttempt);
      setAttemptCount(attempt);

      if (attempt >= 3) {
        setIsMaxAttempt(true);
      }
    }

    if (savedExpireTime) {
      const expireTime = new Date(savedExpireTime).getTime();
      const now = Date.now();
      const remainingSeconds = Math.floor((expireTime - now) / 1000);

      if (remainingSeconds > 0) {
        setCountdown(remainingSeconds);
        setCanResend(false);
      } else {
        setCountdown(0);
        setCanResend(true);
        Cookies.remove("OTP_expires_at");
      }
    } else {
      setCanResend(true);
    }
  }, []);

  const handleOnSubmit = useCallback(
    async (data: z.infer<typeof verifyOTPSchema>) => {
      const result = await authService.verifyOTP({
        email: emailForOTP,
        otp: data.otp,
      });

      if (result.ok) {
        toast.success(result.message, {
          toasterId: "global",
        });

        Cookies.remove("OTP_attempt_count");
        Cookies.remove("OTP_expires_at");
        setUser(result.data?.user_data);
        setIsLoggedIn(true);

        navigate.push("/");
      } else {
        toast.error(result.message, {
          toasterId: "global",
        });
      }
    },
    [emailForOTP, navigate, setIsLoggedIn, setUser],
  );

  const handleResendOTP = useCallback(async () => {
    setIsResending(true);

    const result = await authService.sendOTP({
      email: emailForOTP,
      context: "register",
    });

    if (result.ok) {
      toast.success(result.message, { toasterId: "global" });
      otpForm.resetField("otp");

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      Cookies.set("OTP_attempt_count", String(newAttemptCount));

      const waitTimeInSeconds = (newAttemptCount * 2 + 1) * 60;
      const expireTime = Date.now() + waitTimeInSeconds * 1000;
      Cookies.set("OTP_expires_at", String(expireTime));

      setCountdown(waitTimeInSeconds);
      setCanResend(false);

      if (newAttemptCount >= 3) {
        setIsMaxAttempt(true);
      }
    } else {
      if (
        result.message?.includes("tiga kali") ||
        result.message?.includes("admin")
      ) {
        setIsMaxAttempt(true);
        toast.error(result.message, { toasterId: "global" });
      } else {
        toast.error(result.message, { toasterId: "global" });
      }
    }

    setIsResending(false);
  }, [attemptCount, emailForOTP, otpForm]);

  return {
    otpForm,
    emailForOTP,
    isMaxAttempt,
    isResending,
    canResend,
    countdown,
    handleResendOTP,
    handleOnSubmit,
  };
};

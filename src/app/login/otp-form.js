"use client";

import { useActionState, useState, useEffect } from "react";
import { sendOTPAction } from "@/actions/auth";
import { signIn } from "next-auth/react";

export default function OTPLoginForm() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // email or otp
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [sendState, sendAction, isSending] = useActionState(sendOTPAction, null);

  useEffect(() => {
    if (sendState?.success) {
      setStep("otp");
      setEmail(sendState.email);
    }
    if (sendState?.error) {
      setError(sendState.error);
    }
  }, [sendState]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        otp,
        flow: "otp",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid or expired code");
        setIsVerifying(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === "email" ? (
        <form action={sendAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 ml-1 text-center block">Enter Your Email</label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              className="input-dark text-center"
              required
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="btn-primary w-full mt-4"
          >
            {isSending ? "Sending Code..." : "Send Access Code →"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-white/60 text-sm">Code sent to <b>{email}</b></p>
            <button 
              type="button" 
              onClick={() => { setStep("email"); setError(""); }}
              className="text-[#FFD700] text-xs hover:underline mt-1"
            >
              Change Email
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 ml-1 text-center block">Enter 6-Digit Code</label>
            <input
              name="otp"
              type="text"
              placeholder="••••••"
              maxLength={6}
              className="input-dark text-center text-2xl tracking-[10px] font-bold"
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="btn-primary w-full mt-4"
          >
            {isVerifying ? "Verifying..." : "Verify & Enter →"}
          </button>
        </form>
      )}
    </div>
  );
}

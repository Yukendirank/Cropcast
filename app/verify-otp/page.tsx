'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyOtp, forgotPassword } from "@/lib/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/forgot-password");
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await verifyOtp(email, otp);

      if (data.success || data.message?.includes("success")) {
        // Store verification status
        sessionStorage.setItem("otpVerified", "true");
        router.push("/reset-password");
      } else {
        setError(data.message || "Invalid verification code");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    setResendSuccess(false);

    try {
      const data = await forgotPassword(email);

      if (data.success || data.message?.includes("success")) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to resend code");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    }

    setResendLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#0A4D3C] text-center mb-2">
          Verify Code
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to {email}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
            Verification code sent successfully!
          </div>
        )}

        <form className="space-y-4" onSubmit={handleVerify}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              maxLength={6}
              className="w-full px-4 py-3 text-2xl text-center tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4D3C] font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="000000"
            />
            <p className="text-xs text-gray-500 mt-2">Enter the 6-digit code</p>
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#0A4D3C] text-white py-2 rounded-md hover:bg-[#083D2F] transition-colors disabled:bg-gray-400"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-[#0A4D3C] hover:text-[#083D2F] font-semibold text-sm disabled:text-gray-400"
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Link
              href="/forgot-password"
              className="text-[#0A4D3C] hover:text-[#083D2F] font-semibold"
            >
              Use different email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

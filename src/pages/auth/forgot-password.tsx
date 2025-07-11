// === FORGOT PASSWORD PAGE ===
// pages/auth/forgot-password.tsx
// **Commit**: `feat: implement authentication system`

import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { Lock, ArrowLeft, MessageText, TickCircle } from "iconsax-react";
import SpinLoader from "@/components/SpinLoader";


export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      // API call logic here
      console.log("Password reset request for:", email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
              <TickCircle size={32} color="#FFFFFF" variant="Bold" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
            <p className="text-gray-600 mt-2">We've sent password reset instructions to</p>
            <p className="text-gray-900 font-medium">{email}</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MessageText size={20} color="#2563EB" className="mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">Email sent successfully!</p>
                  <p className="text-blue-700 mt-1">
                    Check your inbox and click the reset link to create a new password.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  try again
                </button>
              </p>

              <Link
                to="/auth/login"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={16} color="currentColor" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4">
            <Lock size={32} color="#FFFFFF" variant="Bold" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600 mt-2">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleResetPassword} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email address"
            disabled={loading}
            required
            error={error}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <SpinLoader /> : "Send Reset Instructions"}
          </Button>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={16} color="currentColor" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
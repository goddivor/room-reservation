// === LOGIN PAGE ===
// pages/auth/login.tsx
// **Commit**: `feat: implement authentication system`

import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { Google, Lock } from "iconsax-react";
import SpinLoader from "@/components/SpinLoader";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call logic here
      console.log("Login attempt:", { email, password, rememberMe });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-md p-8">

         {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Lock size={32} color="#FFFFFF" variant="Bold" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Room Reservation</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your bookings</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
              className="w-full"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
              className="w-full"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <SpinLoader /> : "Sign In"}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">
              Or continue with
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            disabled={loading}
            className="w-full border hover:bg-blue-700 hover:text-white border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span className="flex items-center gap-2">
              <Google size={20} color="#4285F4" />
              Sign in with Google
            </span>
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

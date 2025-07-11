// === SIGNUP PAGE ===
// pages/auth/signup.tsx 
// **Commit**: `feat: implement authentication system`

import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import { Google, UserAdd, Eye, EyeSlash } from "iconsax-react";
import SpinLoader from "@/components/SpinLoader";


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password validation
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return validations;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (formData.password && !Object.values(passwordValidation).every(Boolean)) {
      newErrors.password = "Password does not meet requirements";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // API call logic here
      console.log("Sign up attempt:", formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
            <UserAdd size={32} color="#FFFFFF" variant="Bold" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join us to start booking rooms</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="John"
              disabled={loading}
              required
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Doe"
              disabled={loading}
              required
              error={errors.lastName}
            />
          </div>

          {/* Email */}
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john.doe@company.com"
            disabled={loading}
            required
            error={errors.email}
          />

          {/* Password with visibility toggle */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Create a strong password"
              disabled={loading}
              required
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? 
                <EyeSlash size={20} color="#6B7280" /> : 
                <Eye size={20} color="#6B7280" />
              }
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center ${passwordValidation.length ? "text-green-600" : "text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full mr-2 bg-current"></div>
                  8+ characters
                </div>
                <div className={`flex items-center ${passwordValidation.uppercase ? "text-green-600" : "text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full mr-2 bg-current"></div>
                  Uppercase letter
                </div>
                <div className={`flex items-center ${passwordValidation.lowercase ? "text-green-600" : "text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full mr-2 bg-current"></div>
                  Lowercase letter
                </div>
                <div className={`flex items-center ${passwordValidation.number ? "text-green-600" : "text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full mr-2 bg-current"></div>
                  Number
                </div>
                <div className={`flex items-center ${passwordValidation.special ? "text-green-600" : "text-gray-400"}`}>
                  <div className="w-2 h-2 rounded-full mr-2 bg-current"></div>
                  Special character
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
              disabled={loading}
              required
              error={errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? 
                <EyeSlash size={20} color="#6B7280" /> : 
                <Eye size={20} color="#6B7280" />
              }
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                disabled={loading}
              />
              <span className="text-sm text-gray-600 leading-5">
                I agree to the{" "}
                <Link to="/terms" className="text-green-600 hover:text-green-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-green-600 hover:text-green-700 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <SpinLoader /> : "Create Account"}
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

          {/* Google Sign Up */}
          <Button
            type="button"
            disabled={loading}
            className="w-full border hover:bg-blue-700 hover:text-white border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span className="flex items-center">
              <Google size={20} color="#4285F4" className="mr-2" />
              Sign up with Google
            </span>
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-green-600 hover:text-green-700 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
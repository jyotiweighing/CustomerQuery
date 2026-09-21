import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/Logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { login } from "../../../services/admin/authService";
import { showAlert } from "../../../utils/sweetAlert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const user = jwtDecode(credentialResponse.credential);
      setEmail(user.email);
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Google Login Failed",
        text: "Could not decode credentials.",
      });
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    // 1. Validation Checks
    if (!email.trim()) {
      return showAlert({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email.",
      });
    }

    if (!password.trim()) {
      return showAlert({
        icon: "warning",
        title: "Password Required",
        text: "Please enter your password.",
      });
    }

    try {
      setLoading(true);

      // 2. Await backend API response (IMPORTANT FIX)
      const res = await login({
        email: email.trim(),
        password: password.trim(),
      });

      // Backend returns data like { token: "...", user: { role: "admin", ... } }
      const user = res?.user || res?.data?.user;
      const token = res?.token || res?.data?.token;

      if (!token) {
        throw new Error("Invalid response from server");
      }

      // 3. Optional Role Check (Customize as needed)
      // Agaye agar aapko sirf specific role (e.g. "customer" ya "admin") ko hi login allow karna ho:
      /*
      if (user?.role !== "customer" && user?.role !== "admin") {
        return showAlert({
          icon: "error",
          title: "Access Denied",
          text: "You do not have permission to access this portal.",
        });
      }
      */

      // Save user & token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Show Success Alert
      showAlert({
        icon: "success",
        title: "Login Successful",
        text: `Welcome Back${user?.name ? `, ${user.name}` : ""}!`,
        timer: 1800,
        showConfirmButton: false,
      });

      // Redirect user
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      // Catch Backend invalid email/password or network error
      showAlert({
        icon: "error",
        title: "Login Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Invalid Email or Password",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      {/* Left Banner Section */}
      <div className="hidden lg:flex w-1/2 h-screen bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/10 -top-16 -left-20" />
        <div className="absolute w-80 h-80 rounded-full bg-white/10 bottom-0 right-0" />

        <div className="z-10 max-w-lg text-center px-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <img
                src={logo}
                alt="Company Logo"
                className="w-54 h-24 object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6">Customer Query Portal</h1>

          <p className="text-lg text-blue-100 leading-8">
            Manage customer queries, support tickets, and communication
            efficiently from one centralized dashboard.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 h-screen overflow-y-auto flex justify-center py-10 px-6">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10 my-auto"
        >
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="Company Logo"
                className="w-36 h-16 object-contain"
              />
            </div>
            <h2 className="text-4xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-3">Login to continue</p>
          </div>

          <div className="mt-10 space-y-6">
            {/* Email Field */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email Address
              </label>
              <div className="mt-2 flex items-center border rounded-xl px-4 h-14 focus-within:border-blue-600 transition">
                <Mail className="text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="ml-3 w-full outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>
              <div className="mt-2 flex items-center border rounded-xl px-4 h-14 focus-within:border-blue-600 transition">
                <Lock className="text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="ml-3 w-full outline-none"
                  required
                />
                {showPassword ? (
                  <EyeOff
                    className="text-gray-400 cursor-pointer hover:text-blue-600 transition shrink-0"
                    size={20}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="text-gray-400 cursor-pointer hover:text-blue-600 transition shrink-0"
                    size={20}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg hover:scale-[1.01] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-400 text-xs uppercase font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  showAlert({
                    icon: "error",
                    title: "Google Login Failed",
                    text: "Please try again.",
                  })
                }
              />
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8 text-sm">
            Don't have an account?
            <Link
              to="/signup"
              className="text-blue-600 font-semibold cursor-pointer ml-2 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, Headset } from "lucide-react";
import logo from "../../assets/Logo1.png";
import { Link, useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import { login } from "../services/authService";
import { showAlert } from "../../utils/sweetAlert";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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

      const user = await login({
        email: email.trim(),
        password: password.trim(),
        rememberMe: true,
      });

      // Role check for Admin vs Staff vs Unauthorized
      if (user.role === "Admin") {
        showAlert({
          icon: "success",
          title: "Login Successful",
          text: `Welcome Back Admin ${user.name}`,
          timer: 1800,
          showConfirmButton: false,
        });
        // Route to Admin Dashboard
        return navigate("/admindashboard");
      } else if (user.role === "staff") {
        showAlert({
          icon: "success",
          title: "Login Successful",
          text: `Welcome Back ${user.name}`,
          timer: 1800,
          showConfirmButton: false,
        });
        // Route to Staff Dashboard
        return navigate("/dashboard");
      } else {
        return showAlert({
          icon: "error",
          title: "Access Denied",
          text: "You do not have permission to access this portal.",
        });
      }
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Login Failed",
        text: err?.response?.data?.message || "Invalid Email or Password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 font-sans antialiased">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#06b6d4] opacity-95" />

      {/* Main Glass Outer Card Container */}
      <div className="relative z-10 mx-4 w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/10 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-3xl sm:p-3">
        <div className="flex flex-col overflow-hidden rounded-[2rem] bg-slate-900/20 backdrop-blur-2xl lg:flex-row">
          
          {/* Left Banner Section */}
          <div className="relative hidden w-1/2 flex-col justify-between border-r border-white/15 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-12 lg:flex">
            {/* Top Logo */}
            <div className="flex ml-20">
              <div className="rounded-2xl border border-white/40 bg-white p-3 shadow-xl backdrop-blur-xl transition-transform hover:scale-105">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>

            {/* Middle Main Content */}
            <div className="my-auto space-y-6 py-10">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur-md">
                <ShieldCheck size={16} /> Authorized Access Only
              </div>
              <h1 className="text-4xl font-black leading-tight text-white tracking-tight xl:text-5xl">
                Jyoti Weighing <br />
                <span className="bg-gradient-to-r from-cyan-200 via-blue-100 to-white bg-clip-text text-transparent">
                  Support Command Center
                </span>
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-blue-100/90">
                Manage incoming customer queries, monitor installations, track department tickets, and generate analytical reports in one centralized workspace.
              </p>

              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
                  <Headset size={18} className="text-cyan-300" />
                  <span className="text-xs font-semibold text-white">Query Desk</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
                  <ShieldCheck size={18} className="text-cyan-300" />
                  <span className="text-xs font-semibold text-white">Audit Access</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs font-medium text-cyan-100/70">
              <span>© {new Date().getFullYear()} Jyoti Weighing Systems Pvt. Ltd.</span>
            </div>
          </div>

          {/* Right Login Form */}
          <div className="flex w-full flex-col justify-center bg-white/95 p-8 backdrop-blur-2xl  sm:p-12 lg:w-1/2">
            <div className="mx-auto w-full max-w-sm">
              
              {/* Form Header */}
              <div className="text-center lg:text-left">
                <div className="mb-6 flex justify-center lg:hidden">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
                    <img
                      src={logo}
                      alt="Company Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-800">
                  Portal Login
                </h2>
                <p className="mt-2 text-xs font-medium text-slate-500 ">
                  Authenticate your credentials to gain workspace access
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                {/* Email Address */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 d">
                    Official Email
                  </label>
                  <div className="group relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 shadow-sm transition-all focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#2563eb]/10 ">
                    <Mail className="text-slate-400 transition-colors group-focus-within:text-[#2563eb]" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@jyotiweighing.com"
                      className="ml-3 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 ">
                    Security Password
                  </label>
                  <div className="group relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 shadow-sm transition-all focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#2563eb]/10">
                    <Lock className="text-slate-400 transition-colors group-focus-within:text-[#2563eb]" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="ml-3 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 "
                      required
                    />
                    {showPassword ? (
                      <EyeOff
                        className="cursor-pointer text-slate-400 transition-colors hover:text-[#2563eb] shrink-0"
                        size={18}
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer text-slate-400 transition-colors hover:text-[#2563eb] shrink-0"
                        size={18}
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>

                {/* Auxiliary Options */}
                <div className="flex items-center justify-between pt-1 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 ">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb]/30"
                    />
                    Keep me logged in
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[#2563eb] hover:underline "
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Gradient Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#06b6d4] p-4 text-sm font-extrabold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
                  {!loading && (
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;


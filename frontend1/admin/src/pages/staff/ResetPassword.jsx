
import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, Headset, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "../../assets/Logo1.png";
import { staffresetPassword } from "../../services/staff/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log({
        email,
        password: data.password,
      });

      // API Call Here
      await staffresetPassword({
        email,
        password: data.password,
      });

      alert("Password Reset Successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
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
          
          {/* Left Staff Banner Section */}
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

            {/* Middle Staff Info */}
            <div className="my-auto space-y-6 py-10">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur-md">
                <ShieldCheck size={16} /> Account Security Center
              </div>
              <h1 className="text-4xl font-black leading-tight text-white tracking-tight xl:text-5xl">
                Set New <br />
                <span className="bg-gradient-to-r from-cyan-200 via-blue-100 to-white bg-clip-text text-transparent">
                  Access Password
                </span>
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-blue-100/90">
                Create a strong password to keep your staff account secure and continue managing customer queries safely.
              </p>

              {/* Quick Feature Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
                  <Headset size={18} className="text-cyan-300" />
                  <span className="text-xs font-semibold text-white">Query Support</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-md">
                  <KeyRound size={18} className="text-cyan-300" />
                  <span className="text-xs font-semibold text-white">Encrypted Data</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs font-medium text-cyan-100/70">
              <span>© {new Date().getFullYear()} Jyoti Weighing Systems Pvt. Ltd.</span>
            </div>
          </div>

          {/* Right Reset Password Form Section */}
          <div className="flex w-full flex-col justify-center bg-white/95 p-8 backdrop-blur-2xl dark:bg-slate-900/95 sm:p-12 lg:w-1/2">
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
                <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                  Reset Password
                </h2>
                <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Create a new password for <span className="font-bold text-slate-700 dark:text-slate-200">{email || "your account"}</span>.
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                
                {/* New Password Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    New Password
                  </label>
                  <div className="group relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 shadow-sm transition-all focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#2563eb]/10 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:bg-slate-800">
                    <Lock className="text-slate-400 transition-colors group-focus-within:text-[#2563eb]" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter New Password"
                      className="ml-3 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Minimum 8 characters required",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="group relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 shadow-sm transition-all focus-within:border-[#2563eb] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#2563eb]/10 dark:border-slate-700 dark:bg-slate-800/80 dark:focus-within:bg-slate-800">
                    <Lock className="text-slate-400 transition-colors group-focus-within:text-[#2563eb]" size={18} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm New Password"
                      className="ml-3 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                      {...register("confirm", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {errors.confirm.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#06b6d4] p-4 text-sm font-extrabold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
                >
                  <span>{loading ? "Updating..." : "Reset Password"}</span>
                  {!loading && (
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-[#2563eb] transition-transform hover:-translate-x-1 hover:underline dark:text-cyan-400"
                >
                  <ArrowLeft size={16} /> Back to Staff Login
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
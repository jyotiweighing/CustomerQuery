import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "../../../assets/Logo1.png";
import { resetPassword } from "../../../services/admin/authService";
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

  const onSubmit = async (data) => {
    console.log({
      email,
      password: data.password,
    });

    // API Call Here
    await resetPassword({
       email,
       password:data.password
    })

    alert("Password Reset Successfully");

    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      {/* Left Section */}

      <div className="hidden lg:flex w-1/2 h-screen bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/10 -top-16 -left-20"></div>

        <div className="absolute w-80 h-80 rounded-full bg-white/10 bottom-0 right-0"></div>

        <div className="z-10 max-w-lg text-center px-8 -translate-y-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <img
                src={logo}
                alt="logo"
                className="w-56 h-24 object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            Customer Query Portal
          </h1>

          <p className="text-lg text-blue-100 leading-8">
            Create a strong password to keep your account secure and continue
            managing customer queries safely.
          </p>
        </div>
      </div>

      {/* Right Section */}

      <div className="flex-1 flex justify-center items-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="logo"
                className="w-36 h-16 object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Reset Password
            </h2>

            <p className="text-gray-500 mt-3">
              Create your new password below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            {/* Password */}

            <div>
              <label className="text-sm font-semibold text-gray-600">
                New Password
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Lock className="text-gray-400" size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  className="ml-3 w-full outline-none"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" />
                  ) : (
                    <Eye className="text-gray-400" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Confirm Password
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Lock className="text-gray-400" size={20} />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="ml-3 w-full outline-none"
                  {...register("confirm", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password ||
                      "Passwords do not match",
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="text-gray-400" />
                  ) : (
                    <Eye className="text-gray-400" />
                  )}
                </button>
              </div>

              {errors.confirm && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirm.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg hover:scale-[1.02] transition"
            >
              Reset Password
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
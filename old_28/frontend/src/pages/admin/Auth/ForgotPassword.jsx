import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/Logo1.png";
import { forgotPassword } from "../../../services/admin/authService";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../../services/admin/authService";
import { resendOtp } from "../../../services/admin/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await forgotPassword({
        email,
      });

      alert(res.message);

      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const res = await verifyOtp({
        email,
        otp,
      });

      alert(res.message);

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);

      const res = await resendOtp({
        email,
      });

      alert(res.message);
    } catch (err) {
      console.log("err",err)
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
              <img src={logo} alt="logo" className="w-56 h-24 object-contain" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6">Customer Query Portal</h1>

          <p className="text-lg text-blue-100 leading-8">
            Recover your account securely and continue managing customer queries
            without interruption.
          </p>
        </div>
      </div>

      {/* Right Section */}

      <div className="flex-1 flex justify-center items-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {/* <div className="rounded-2xl shadow-md p-3"> */}

              <img src={logo} alt="logo" className="w-36 h-16 object-contain" />

              {/* </div> */}
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Forgot Password
            </h2>

            <p className="text-gray-500 mt-3">
              Enter your registered email address to receive an OTP.
            </p>
          </div>

          {/* <form onSubmit={handleSubmit} className="mt-8 space-y-6"> */}
          <form onSubmit={handleSendOTP} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email Address
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Mail size={20} className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-3 w-full outline-none"
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  OTP
                </label>

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter 6 Digit OTP"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-14 border rounded-xl px-4 outline-none"
                  />
                </div>

                <div className="flex justify-end mt-2">
  <button
    type="button"
    onClick={handleResendOTP}
    disabled={loading}
    className="text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
  >
    Resend OTP
  </button>
</div>
              </div>
            )}
            {/* <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button> */}
            {!otpSent ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold text-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            )}
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

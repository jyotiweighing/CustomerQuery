import React, { useState } from "react";
import { User, Building2, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/Logo1.png";
import { Link } from "react-router-dom";
import { signup } from "../../../services/admin/authService";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async () => {
    console.log("Signup button clicked");
    try {
      if (
        !formData.name ||
        !formData.companyName ||
        !formData.email ||
        !formData.mobile ||
        !formData.password
      ) {
        return alert("Please fill all fields");
      }

      if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match");
      }

      if (!formData.terms) {
        return alert("Please accept Terms & Conditions");
      }

      setLoading(true);

      const payload = {
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      };

      const res = await signup(payload);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      alert(res.message);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 h-screen bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/10 -top-10 -left-20"></div>
        <div className="absolute w-80 h-80 rounded-full bg-white/10 bottom-0 right-0"></div>

        <div className="z-10 max-w-lg text-center px-8 -translate-y-8">
          <div className="bg-white rounded-3xl p-5 inline-block shadow-xl mb-6">
            <img src={logo} alt="logo" className="w-54 h-24 object-contain" />
          </div>

          <h1 className="text-4xl font-bold mt-3">Customer Query Portal</h1>

          <p className="mt-6 text-blue-100 text-lg leading-8">
            Join our customer support platform and manage customer requests
            efficiently.
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div className="flex-1 h-screen overflow-y-auto flex justify-center items-start px-8 py-8">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10">
          <div className="text-center">
            <img src={logo} alt="logo" className="w-36 mx-auto mb-4" />

            <h2 className="text-4xl font-bold text-gray-800">Create Account</h2>

            <p className="text-gray-500 mt-2">
              Register to access the Customer Query Portal
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {/* Full Name */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <User size={20} className="text-gray-400" />
                {/* <input
                  type="text"
                  placeholder="Enter full name"
                  className="ml-3 w-full outline-none"
                /> */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="ml-3 w-full outline-none"
                />
              </div>
            </div>

            {/* Company */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Company Name
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Building2 size={20} className="text-gray-400" />
                {/* <input
                  type="text"
                  placeholder="Company name"
                  className="ml-3 w-full outline-none"
                /> */}
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="ml-3 w-full outline-none"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Mail size={20} className="text-gray-400" />
                {/* <input
                  type="email"
                  placeholder="Email Address"
                  className="ml-3 w-full outline-none"
                /> */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="ml-3 w-full outline-none"
                />
              </div>
            </div>

            {/* Mobile */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Mobile Number
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Phone size={20} className="text-gray-400" />
                {/* <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="ml-3 w-full outline-none"
                /> */}
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="ml-3 w-full outline-none"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Lock size={20} className="text-gray-400" />

                {/* <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="ml-3 w-full outline-none"
                /> */}
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="ml-3 w-full outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" />
                  ) : (
                    <Eye className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-4 h-14">
                <Lock size={20} className="text-gray-400" />

                {/* <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="ml-3 w-full outline-none"
                /> */}
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="ml-3 w-full outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="text-gray-400" />
                  ) : (
                    <Eye className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600">
              {/* <input type="checkbox" className="mt-1" /> */}
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1"
              />
              I agree to the Terms & Conditions and Privacy Policy.
            </label>

            {/* <button className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg hover:scale-[1.02] transition-all">
              Create Account
            </button> */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

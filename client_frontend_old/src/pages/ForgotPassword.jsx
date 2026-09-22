// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { customerApi } from "../services/api";
// import logo from "../assets/Logo1.png";
// export default function ForgotPassword() {
//   const nav = useNavigate();
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");
//   const send = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       const r = await customerApi.forgotPassword(email);
//       setMsg(r.message);
//       setStep(2);
//     } catch (x) {
//       setError(x.message);
//     }
//   };
//   const verify = async (e) => {
//     e.preventDefault();
//     try {
//       setError("");
//       await customerApi.verifyOtp(email, otp);
//       nav("/reset-password", { state: { email } });
//     } catch (x) {
//       setError(x.message);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
//       <div className="card w-full max-w-md p-7">
//         <img src={logo} className="mx-auto h-16 object-contain" />
//         <h1 className="mt-6 text-2xl font-bold text-slate-900">
//           Forgot Password
//         </h1>
//         <p className="mt-2 text-sm text-slate-500">
//           {step === 1
//             ? "Enter your registered customer email."
//             : "Enter the 6-digit OTP sent to your email."}
//         </p>
//         <form onSubmit={step === 1 ? send : verify} className="mt-6 space-y-4">
//           <div>
//             <label className="label">Email</label>
//             <input
//               type="email"
//               required
//               disabled={step === 2}
//               className="field"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           {step === 2 && (
//             <div>
//               <label className="label">OTP</label>
//               <input
//                 required
//                 maxLength="6"
//                 className="field"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//             </div>
//           )}
//           {msg && (
//             <p className="text-xs font-semibold text-emerald-600">{msg}</p>
//           )}
//           {error && (
//             <p className="text-xs font-semibold text-rose-600">{error}</p>
//           )}
//           <button className="primary w-full">
//             {step === 1 ? "Send OTP" : "Verify OTP"}
//           </button>
//           {step === 2 && (
//             <button
//               type="button"
//               className="secondary w-full"
//               onClick={async () => {
//                 try {
//                   const r = await customerApi.resendOtp(email);
//                   setMsg(r.message);
//                 } catch (x) {
//                   setError(x.message);
//                 }
//               }}
//             >
//               Resend OTP
//             </button>
//           )}
//         </form>
//         <Link
//           to="/"
//           className="mt-5 block text-center text-xs font-bold text-blue-600"
//         >
//           Back to Login
//         </Link>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Headphones,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { customerApi } from "../services/api";
import logo from "../assets/Logo1.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState(1);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // ==============================
  // SEND OTP
  // ==============================

  const send = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMsg("");

      const response =
        await customerApi.forgotPassword(cleanEmail);

      setMsg(
        response?.message ||
          "OTP has been sent successfully to your registered email."
      );

      setStep(2);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // VERIFY OTP
  // ==============================

  const verify = async (e) => {
    e.preventDefault();

    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setError("Please enter the OTP.");
      return;
    }

    if (cleanOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMsg("");

      await customerApi.verifyOtp(
        email.trim(),
        cleanOtp
      );

      navigate("/reset-password", {
        state: {
          email: email.trim(),
          otp: cleanOtp,
        },
      });
    } catch (err) {
      setError(
        err?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RESEND OTP
  // ==============================

  const handleResendOtp = async () => {
    try {
      setResending(true);
      setError("");
      setMsg("");

      const response =
        await customerApi.resendOtp(email.trim());

      setMsg(
        response?.message ||
          "A new OTP has been sent successfully."
      );
    } catch (err) {
      setError(
        err?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#172a73]
        via-[#2258c7]
        to-[#11a9d8]
      "
    >
      {/* ===================================
          BACKGROUND DECORATION
      =================================== */}

      <div
        className="
          pointer-events-none
          absolute -left-32 -top-32
          h-96 w-96
          rounded-full
          bg-blue-200/40
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute -bottom-40 -right-24
          h-[28rem] w-[28rem]
          rounded-full
          bg-cyan-200/40
          blur-3xl
        "
      />

      {/* ===================================
          MAIN WRAPPER
      =================================== */}

      <div
        className="
          relative
          mx-auto
          flex min-h-screen
          w-full
          max-w-[1100px]
          items-center
          justify-center
          p-3
          sm:p-6
          lg:p-8
        "
      >
        <section
          className="
            grid
            min-h-[720px]
            w-full
            overflow-hidden
            rounded-[32px]
            border border-white/80
            bg-white
            shadow-[0_30px_90px_rgba(15,55,95,0.14)]
            lg:grid-cols-[1.08fr_.92fr]
          "
        >
          {/* ===================================
              LEFT BRANDING PANEL
          =================================== */}

          <aside
            className="
              relative
              hidden
              overflow-hidden
              bg-gradient-to-br
              from-[#172a73]
              via-[#2258c7]
              to-[#11a9d8]
              p-10
              text-white
              lg:flex
              lg:flex-col
              xl:p-14
            "
          >
            {/* decorative circles */}

            <div
              className="
                absolute
                -right-24 -top-20
                h-72 w-72
                rounded-full
                border border-white/10
                bg-white/5
              "
            />

            <div
              className="
                absolute
                right-20 top-44
                h-36 w-36
                rounded-full
                border border-white/10
                bg-cyan-300/10
              "
            />

            <div
              className="
                absolute
                -bottom-2 -left-20
                h-80 w-80
                rounded-full
                bg-cyan-300/10
                blur-sm
              "
            />

            <div
              className="
                absolute inset-0
                opacity-20
                [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)]
                [background-size:24px_24px]
              "
            />

            {/* LOGO */}

            <div className="relative z-10 flex justify-center">
              <div
                className="
                  rounded-2xl
                  bg-white
                  px-5 py-3
                  shadow-xl
                  shadow-blue-950/15
                "
              >
                <img
                  src={logo}
                  alt="Jyoti Weighing Systems"
                  className="
                    h-20
                    w-auto
                    object-contain
                  "
                />
              </div>
            </div>

            {/* LEFT CONTENT */}

            <div
              className="
                relative z-10
                my-auto
                max-w-xl
                py-1
                
              "
            >
              {/* <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border border-cyan-200/20
                  bg-cyan-100/10
                  px-5 py-2
                  text-xs
                  font-semibold
                  text-cyan-50
                  backdrop-blur
                "
              >
                <ShieldCheck size={15} />

                Secure Account Recovery
              </div> */}

              <h1
                className="
                  max-w-lg
                  text-4xl
                  font-extrabold
                  leading-[1.12]
                  tracking-tight
                  xl:text-[50px]
                "
              >
                Recover your
                <span className="block text-cyan-200">
                  account securely.
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-lg
                  text-[15px]
                  leading-7
                  text-blue-50/85
                "
              >
                Verify your registered email address
                using a secure OTP and create a new
                password for your Jyoti Customer
                Portal account.
              </p>

              {/* INFO BOXES */}

              <div className="mt-9 space-y-3">
                <div
                  className="
                    flex items-center
                    gap-3
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.08]
                    p-4
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/15
                      text-cyan-100
                    "
                  >
                    <Mail size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Email Verification
                    </p>

                    <p className="mt-1 text-xs text-blue-100/80">
                      OTP will be sent only to your
                      registered email address.
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex items-center
                    gap-3
                    rounded-2xl
                    border border-white/10
                    bg-white/[0.08]
                    p-4
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      flex h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/15
                      text-cyan-100
                    "
                  >
                    <KeyRound size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Secure Password Reset
                    </p>

                    <p className="mt-1 text-xs text-blue-100/80">
                      After verification you can safely
                      create your new password.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div
              className="
                relative z-10
                flex
                items-center
                justify-between
                border-t
                border-white/10
                pt-6
                text-[11px]
                text-blue-100/70
              "
            >
              <span>
                © 2026 Jyoti Weighing Systems Pvt. Ltd.
              </span>
            </div>
          </aside>

          {/* ===================================
              RIGHT FORM PANEL
          =================================== */}

          <div
            className="
              relative
              flex
              items-center
              justify-center
              px-5 py-8
              sm:px-10
              lg:px-12
              xl:px-16
            "
          >
            <div className="w-full max-w-[460px]">
              {/* MOBILE LOGO */}

              <div className="mb-8 flex justify-center lg:hidden">
                <div
                  className="
                    rounded-2xl
                    border border-slate-100
                    bg-white
                    px-5 py-3
                    shadow-md
                  "
                >
                  <img
                    src={logo}
                    alt="Jyoti Weighing Systems"
                    className="
                      h-16
                      w-auto
                      object-contain
                    "
                  />
                </div>
              </div>

              {/* ===================================
                  STEP INDICATOR
              =================================== */}

              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`
                    flex h-9 w-9
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-extrabold
                    ${
                      step >= 1
                        ? `
                          bg-gradient-to-r
                          from-[#2457cf]
                          to-[#10a8d0]
                          text-white
                          shadow-md
                        `
                        : `
                          bg-slate-100
                          text-slate-400
                        `
                    }
                  `}
                >
                  1
                </div>

                <div
                  className={`
                    h-1 flex-1
                    rounded-full
                    ${
                      step === 2
                        ? `
                          bg-gradient-to-r
                          from-[#2457cf]
                          to-[#10a8d0]
                        `
                        : "bg-slate-100"
                    }
                  `}
                />

                <div
                  className={`
                    flex h-9 w-9
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-extrabold
                    ${
                      step === 2
                        ? `
                          bg-gradient-to-r
                          from-[#2457cf]
                          to-[#10a8d0]
                          text-white
                          shadow-md
                        `
                        : `
                          bg-slate-100
                          text-slate-400
                        `
                    }
                  `}
                >
                  2
                </div>
              </div>

              {/* ===================================
                  TITLE
              =================================== */}

              <div className="mb-8">
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.17em]
                    text-blue-600
                  "
                >
                  {step === 1
                    ? "Account Recovery"
                    : "OTP Verification"}
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-extrabold
                    tracking-tight
                    text-slate-900
                    sm:text-4xl
                  "
                >
                  {step === 1
                    ? "Forgot password?"
                    : "Verify your OTP"}
                </h2>

                {/* <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  {step === 1
                    ? "Enter the email address registered with your customer account. We’ll send you a 6-digit OTP."
                    : `Enter the 6-digit OTP sent to ${email}.`}
                </p> */}
              </div>

              {/* ===================================
                  SUCCESS MESSAGE
              =================================== */}

              {msg && (
                <div
                  className="
                    mb-5
                    rounded-xl
                    border border-emerald-100
                    bg-emerald-50
                    px-4 py-3
                  "
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                        text-emerald-600
                      "
                    />

                    <div>
                      <p
                        className="
                          text-sm
                          font-extrabold
                          text-emerald-700
                        "
                      >
                        Success
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-emerald-700/80
                        "
                      >
                        {msg}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================
                  ERROR MESSAGE
              =================================== */}

              {error && (
                <div
                  role="alert"
                  className="
                    mb-5
                    rounded-xl
                    border border-rose-100
                    bg-rose-50
                    px-4 py-3
                    text-sm
                    font-semibold
                    text-rose-600
                  "
                >
                  {error}
                </div>
              )}

              {/* ===================================
                  FORM
              =================================== */}

              <form
                onSubmit={
                  step === 1
                    ? send
                    : verify
                }
                className="space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="forgot-email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-bold
                      text-slate-700
                    "
                  >
                    Registered Email
                  </label>

                  <div className="group relative">
                    <Mail
                      size={19}
                      className="
                        pointer-events-none
                        absolute
                        left-4 top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        group-focus-within:text-blue-600
                      "
                    />

                    <input
                      id="forgot-email"
                      type="email"
                      required
                      autoComplete="email"
                      disabled={step === 2}
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="name@email.com"
                      className="
                        w-full
                        rounded-xl
                        border border-slate-200
                        bg-slate-50/60
                        py-3.5
                        pl-12 pr-4
                        text-sm
                        font-medium
                        text-slate-800
                        outline-none
                        transition
                        placeholder:font-normal
                        placeholder:text-slate-400
                        focus:border-blue-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-100
                        disabled:cursor-not-allowed
                        disabled:bg-slate-100
                        disabled:text-slate-500
                      "
                    />
                  </div>
                </div>

                {/* OTP */}

                {step === 2 && (
                  <div>
                    <label
                      htmlFor="forgot-otp"
                      className="
                        mb-2
                        block
                        text-sm
                        font-bold
                        text-slate-700
                      "
                    >
                      6-digit OTP
                    </label>

                    <div className="group relative">
                      <KeyRound
                        size={19}
                        className="
                          pointer-events-none
                          absolute
                          left-4 top-1/2
                          -translate-y-1/2
                          text-slate-400
                          transition
                          group-focus-within:text-blue-600
                        "
                      />

                      <input
                        id="forgot-otp"
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          setOtp(value);
                        }}
                        placeholder="Enter 6-digit OTP"
                        className="
                          w-full
                          rounded-xl
                          border border-slate-200
                          bg-slate-50/60
                          py-3.5
                          pl-12 pr-4
                          text-sm
                          font-bold
                          tracking-[0.25em]
                          text-slate-800
                          outline-none
                          transition
                          placeholder:font-normal
                          placeholder:tracking-normal
                          placeholder:text-slate-400
                          focus:border-blue-400
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-100
                        "
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-[11px] text-slate-400">
                        OTP is valid for a limited time.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setOtp("");
                          setMsg("");
                          setError("");
                        }}
                        className="
                          text-[11px]
                          font-bold
                          text-blue-600
                          transition
                          hover:text-blue-800
                        "
                      >
                        Change email
                      </button>
                    </div>
                  </div>
                )}

                {/* ===================================
                    MAIN BUTTON
                =================================== */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    flex w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#2457cf]
                    via-[#2378dc]
                    to-[#10a8d0]
                    px-5 py-3.5
                    text-sm
                    font-extrabold
                    text-white
                    shadow-lg
                    shadow-blue-200/80
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    disabled:hover:translate-y-0
                  "
                >
                  {loading ? (
                    <>
                      <span
                        className="
                          h-4 w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/40
                          border-t-white
                        "
                      />

                      {step === 1
                        ? "Sending OTP..."
                        : "Verifying OTP..."}
                    </>
                  ) : (
                    <>
                      {step === 1
                        ? "Send OTP"
                        : "Verify OTP"}

                      <ArrowRight
                        size={18}
                        className="
                          transition
                          group-hover:translate-x-1
                        "
                      />
                    </>
                  )}
                </button>

                {/* ===================================
                    RESEND OTP
                =================================== */}

                {step === 2 && (
                  <button
                    type="button"
                    disabled={resending}
                    onClick={handleResendOtp}
                    className="
                      flex w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border border-blue-200
                      bg-blue-50/60
                      px-5 py-3.5
                      text-sm
                      font-extrabold
                      text-blue-700
                      transition
                      hover:border-blue-300
                      hover:bg-blue-100/70
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <RefreshCw
                      size={17}
                      className={
                        resending
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {resending
                      ? "Resending OTP..."
                      : "Resend OTP"}
                  </button>
                )}
              </form>

              {/* ===================================
                  BACK TO LOGIN
              =================================== */}

              <div
                className="
                  mt-7
                  rounded-2xl
                  border border-blue-100
                  bg-blue-50/60
                  p-4
                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-600
                  "
                >
                  Remember your password?
                </p>

                <Link
                  to="/"
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-extrabold
                    text-blue-700
                    transition
                    hover:text-blue-900
                  "
                >
                  <ArrowLeft size={15} />

                  Back to Login
                </Link>
              </div>

              {/* HELP */}

              <div
                className="
                  mt-4
                  flex items-start
                  gap-3
                  rounded-2xl
                  border border-slate-100
                  bg-slate-50/70
                  p-4
                "
              >
                <div
                  className="
                    flex h-8 w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-100
                    text-blue-700
                  "
                >
                  <Headphones size={16} />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-bold
                      text-slate-700
                    "
                  >
                    Didn't receive the OTP?
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-slate-500
                    "
                  >
                    Check your spam folder or use
                    Resend OTP. Make sure you entered
                    the email registered with your
                    customer account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  LockKeyhole,
  Mail,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import logo from "../assets/Logo1.png";
import { useAuth } from "../context/AuthContext";

const benefits = [
  {
    icon: MessageSquareText,
    title: "Raise queries easily",
    text: "Submit billing, service and product-related queries from one place.",
  },
  {
    icon: Headphones,
    title: "Stay connected",
    text: "Choose Call, Email or Chat as your preferred contact method.",
  },
  {
    icon: CheckCircle2,
    title: "Track every update",
    text: "See query status, support replies and progress without follow-ups.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  const [identifier, setIdentifier] = useState(
    () => location.state?.email || "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setError("Please enter your Email / Customer ID and password.");
      return;
    }

    setLoading(true);
    try {
      await login(cleanIdentifier, password);
      if (!rememberMe) sessionStorage.setItem("customer_session_only", "true");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.message || "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#172a73] via-[#2258c7] to-[#11a9d8]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1100px] items-center justify-center p-3 sm:p-6 lg:p-8">
        <section className="grid min-h-[720px] w-full max-w-[1280px] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(15,55,95,0.14)] lg:grid-cols-[1.08fr_.92fr]">
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#172a73] via-[#2258c7] to-[#11a9d8] p-10 text-white lg:flex lg:flex-col xl:p-14">
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute right-20 top-44 h-36 w-36 rounded-full border border-white/10 bg-cyan-300/10" />
            <div className="absolute -bottom-2 -left-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-sm" />
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className=" z-10 flex items-center justify-between ml-20">
              <div className="rounded-2xl bg-white px-5 py-3 shadow-xl shadow-blue-950/15">
                <img
                  src={logo}
                  alt="Jyoti logo"
                  className="h-20 w-auto object-contain xl:h-20"
                />
              </div>
            </div>

            <div className="relative z-10 my-auto max-w-xl py-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3.5 py-2 text-xs font-semibold text-cyan-50 backdrop-blur">
                <ShieldCheck size={15} /> Secure Customer Support
              </div>
              <h1 className="max-w-lg text-4xl font-extrabold leading-[1.12] tracking-tight xl:text-[52px]">
                Your queries.
                <span className="block text-cyan-200">One simple portal.</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-blue-50/85">
                Raise a service request, share billing or PO details and stay
                connected with the Jyoti support team from submission to
                resolution.
              </p>

              {/* <div className="mt-9 space-y-4">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-cyan-100">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-blue-100/80">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-[11px] text-blue-100/70">
              <span>© 2026 Jyoti Weighing Systems Pvt. Ltd.</span>
              {/* <span>Customer Query Management</span> */}
            </div>
          </aside>

          <div className="relative flex items-center justify-center px-2 py-3 sm:px-10 lg:px-12 xl:px-16">
            <div className="w-full max-w-[460px]">
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-md">
                  <img
                    src={logo}
                    alt="Jyoti logo"
                    className="h-16 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="mb-8">
                {/* <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.17em] text-blue-700">
                  Customer Login
                </span> */}
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your registered email address or Customer ID to access
                  your query portal.
                </p>
              </div>

              {location.state?.registrationSuccess && (
                <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <div>
                      <p className="text-sm font-extrabold text-emerald-700">
                        Account created successfully
                      </p>
                      <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                        {location.state?.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={submit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="customer-identifier"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email or Customer ID
                  </label>
                  <div className="group relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                      size={19}
                    />
                    <input
                      id="customer-identifier"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@email.com"
                      className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      htmlFor="customer-password"
                      className="text-sm font-bold text-slate-700"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-bold text-blue-600 transition hover:text-blue-800"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="group relative">
                    <LockKeyhole
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                      size={19}
                    />
                    <input
                      id="customer-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />
                  Keep me signed in
                </label>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2457cf] via-[#2378dc] to-[#10a8d0] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-200/80 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to Customer Portal
                      <ArrowRight
                        size={18}
                        className="transition group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center">
                <p className="text-sm font-semibold text-slate-600">
                  New to the Customer Portal?
                </p>
                <Link
                  to="/register"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-blue-700 transition hover:text-blue-900"
                >
                  Create a customer account <ArrowRight size={15} />
                </Link>
              </div>

              {/* <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Headphones size={17} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Need help accessing your account?
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Use Forgot Password to recover access. For account-related
                      help, contact your Jyoti support representative.
                    </p>
                  </div>
                </div>
              </div> */}

              {/* <p className="mt-7 text-center text-[11px] leading-5 text-slate-400">
                By signing in, you are accessing the authorized Jyoti Customer
                Query Portal.
              </p> */}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

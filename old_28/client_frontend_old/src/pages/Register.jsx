import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Headphones,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import logo from '../assets/Logo1.png';
import { customerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const features = [
  'Raise service, billing and product queries',
  'Track every query from open to resolved',
  'Connect through Call, Email or Chat',
];

const initialForm = {
  name: '',
  companyName: '',
  email: '',
  mobile: '',
  address: '',
  location: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 6,
      match: !!form.password && form.password === form.confirmPassword,
    }),
    [form.password, form.confirmPassword]
  );

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const change = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    const required = ['name', 'email', 'mobile', 'password', 'confirmPassword'];
    if (required.some((key) => !form[key].trim())) {
      setError('Please fill all required fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(form.mobile.trim())) {
      setError('Please enter a valid mobile number.');
      return;
    }
    if (!passwordChecks.length) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!passwordChecks.match) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (!agree) {
      setError('Please accept the portal terms to create your account.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        password: form.password,
        address: form.address.trim(),
        location: form.location.trim(),
      };
      const result = await customerApi.register(payload);
      const customerId = result?.data?.customerId || '';
      navigate('/', {
        replace: true,
        state: {
          registrationSuccess: true,
          email: payload.email,
          customerId,
          message: customerId
            ? `Account created successfully. Your Customer ID is ${customerId}. Please sign in.`
            : 'Account created successfully. Please sign in with your registered email.',
        },
      });
    } catch (err) {
      setError(err?.message || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8fc]">
      <div className="pointer-events-none absolute -left-28 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] items-center justify-center p-3 sm:p-6 lg:p-8">
        <section className="grid w-full max-w-[1280px] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(15,55,95,0.14)] lg:min-h-[800px] lg:grid-cols-[.86fr_1.14fr]">
          <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#172a73] via-[#2258c7] to-[#11a9d8] p-10 text-white lg:flex lg:flex-col xl:p-14">
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/10" />
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="rounded-2xl bg-white px-5 py-3 shadow-xl shadow-blue-950/15">
                <img src={logo} alt="Jyoti logo" className="h-14 w-auto object-contain xl:h-16" />
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-md">
                Customer Portal
              </span>
            </div>

            <div className="relative z-10 my-auto max-w-lg py-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3.5 py-2 text-xs font-semibold text-cyan-50 backdrop-blur">
                <ShieldCheck size={15} /> Create your secure account
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight xl:text-[48px]">
                Support starts with
                <span className="block text-cyan-200">one simple account.</span>
              </h1>
              <p className="mt-5 text-[15px] leading-7 text-blue-50/85">
                Register once to raise customer queries, attach your order and billing details, and follow every support update in one place.
              </p>

              <div className="mt-9 space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3.5 backdrop-blur-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-cyan-100">
                      <Check size={17} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-semibold text-blue-50">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 border-t border-white/10 pt-6 text-[11px] text-blue-100/70">
              Jyoti Weighing Systems Pvt. Ltd. · Customer Query Management
            </div>
          </aside>

          <div className="flex items-center justify-center px-5 py-8 sm:px-9 lg:px-10 xl:px-14">
            <div className="w-full max-w-[610px]">
              <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
                <div className="rounded-xl border border-slate-100 bg-white px-4 py-2 shadow-sm">
                  <img src={logo} alt="Jyoti logo" className="h-12 w-auto object-contain" />
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-700">
                  Customer Portal
                </span>
              </div>

              <Link to="/" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-700">
                <ArrowLeft size={15} /> Back to login
              </Link>

              <div className="mb-7">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.17em] text-blue-700">
                  New Customer
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[38px]">
                  Create your account
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in your details below. After registration, sign in using your email or generated Customer ID.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field icon={UserRound} label="Customer Name" required>
                    <input name="name" value={form.name} onChange={change} placeholder="Enter full name" className={inputClass} />
                  </Field>
                  <Field icon={Building2} label="Company Name">
                    <input name="companyName" value={form.companyName} onChange={change} placeholder="Enter company name" className={inputClass} />
                  </Field>
                  <Field icon={Mail} label="Email Address" required>
                    <input name="email" type="email" autoComplete="email" value={form.email} onChange={change} placeholder="name@company.com" className={inputClass} />
                  </Field>
                  <Field icon={Phone} label="Mobile Number" required>
                    <input name="mobile" inputMode="tel" autoComplete="tel" value={form.mobile} onChange={change} placeholder="9876543210" className={inputClass} />
                  </Field>
                  <Field icon={MapPin} label="Location">
                    <input name="location" value={form.location} onChange={change} placeholder="City / location" className={inputClass} />
                  </Field>
                  <Field icon={MapPin} label="Address">
                    <input name="address" value={form.address} onChange={change} placeholder="Office / site address" className={inputClass} />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordField
                    label="Password"
                    name="password"
                    value={form.password}
                    show={showPassword}
                    setShow={setShowPassword}
                    onChange={change}
                    autoComplete="new-password"
                  />
                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                    onChange={change}
                    autoComplete="new-password"
                  />
                </div>

                {(form.password || form.confirmPassword) && (
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold">
                    <span className={passwordChecks.length ? 'text-emerald-600' : 'text-slate-400'}>
                      <Check size={13} className="mr-1 inline" /> Minimum 6 characters
                    </span>
                    <span className={passwordChecks.match ? 'text-emerald-600' : 'text-slate-400'}>
                      <Check size={13} className="mr-1 inline" /> Passwords match
                    </span>
                  </div>
                )}

                <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-500">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />
                  <span>I confirm that these details are correct and agree to use the Jyoti Customer Query Portal for authorized support requests.</span>
                </label>

                {error && (
                  <div role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Customer Account
                      <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                <span>Already have an account?</span>
                <Link to="/" className="font-extrabold text-blue-700 hover:text-blue-900">Sign in</Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <Headphones size={13} /> Need help? Contact your Jyoti support representative.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-11 pr-3 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100';

function Field({ icon: Icon, label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="group relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" size={18} />
        {children}
      </div>
    </div>
  );
}

function PasswordField({ label, name, value, show, setShow, onChange, autoComplete }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="group relative">
        <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={18} />
        <input
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={name === 'password' ? 'Create password' : 'Re-enter password'}
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

import {
  Building2,
  Mail,
  MapPin,
  Phone,
  UserRound,
  BadgeCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getInitials(name = '') {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return 'CU';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function display(value) {
  return value || '—';
}

export default function Profile() {
  const { customer } = useAuth();

  const name = customer?.name || 'Customer';
  const initials = getInitials(name);

  const details = [
    [Mail, 'Email', display(customer?.email)],
    [Phone, 'Phone', display(customer?.mobile || customer?.phone)],
    [Building2, 'Customer Code', display(customer?.customerId || customer?.customerCode)],
    [MapPin, 'Location', display(customer?.location)],
    [UserRound, 'Role', display(customer?.role)],
    [BadgeCheck, 'Address', display(customer?.address)],
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Customer account and contact information.
        </p>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(30,55,90,0.06)]">
        <div className="h-20 bg-gradient-to-r from-[#2b57ea] via-[#1c83df] to-[#10bad1] sm:h-32" />

        <div className="px-5 pb-7 sm:px-6 lg:px-8">
          <div className="flex gap-5">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 text-3xl font-extrabold text-blue-700 shadow-md">
            {initials}
          </div>

          <div className="-mt-8">
            <h2 className="text-2xl font-bold capitalize text-slate-100">
              {name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 font-semibold">
              {customer?.companyName || customer?.customerId || 'Customer Account'}
            </p>
          </div>
</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map(([Icon, label, value]) => (
              <div
                key={label}
                className="flex min-w-0 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <Icon size={18} className="mt-0.5 shrink-0 text-sky-600" />

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold  text-slate-700">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

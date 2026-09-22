import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function getInitials(name = '') {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return 'CU';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { customer, logout } = useAuth();

  const customerName = customer?.name || 'Customer';
  const accountLabel = customer?.customerId || 'Customer Account';
  const initials = getInitials(customerName);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center gap-3 border-b border-slate-100 bg-white/95 px-4 shadow-[0_1px_8px_rgba(15,43,82,0.03)] backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>


      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex min-w-0 items-center gap-2 border-l border-slate-200 pl-2.5 text-left sm:pl-3"
          title="Open My Profile"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e52d0] via-[#2581e9] to-[#12b8dd] text-xs font-extrabold text-white shadow-sm">
            {initials}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-[170px] truncate text-sm font-bold capitalize text-slate-800">
              {customerName}
            </p>
            <p className="max-w-[170px] truncate text-[11px] font-medium text-slate-500">
              {accountLabel}
            </p>
          </div>
        </button>
        
      </div>
    </header>
  );
}

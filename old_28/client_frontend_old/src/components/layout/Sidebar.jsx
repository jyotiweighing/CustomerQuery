import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessagesSquare,
  PlusCircle,
  LifeBuoy,
  UserRound,
  LogOut,
  X,
} from 'lucide-react';
import logo from '../../assets/Logo1.png';
import { useAuth } from '../../context/AuthContext';

const nav = [
  ['/dashboard', 'Dashboard', LayoutDashboard],
  ['/queries', 'My Queries', MessagesSquare],
  ['/new-query', 'Raise Query', PlusCircle],
  ['/support', 'Help & Support', LifeBuoy],
  ['/profile', 'My Profile', UserRound],
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/', { replace: true });
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`${open ? 'block' : 'hidden'} fixed inset-0 z-30 bg-slate-950/40 lg:hidden`}
      />

      <aside
        className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-gradient-to-b from-[#2e3ec7] via-[#1a82f4] to-[#00c6ff] shadow-2xl transition-transform lg:static lg:translate-x-0`}
      >
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative border-b border-white/15 p-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X />
          </button>

          <div className="rounded-2xl bg-white p-3 shadow-lg">
            <img
              src={logo}
              alt="Jyoti Weighing Systems"
              className="h-14 w-full object-contain"
            />
          </div>

          {/* <p className="mt-3 text-center text-xs font-semibold tracking-wide text-white/75">
            CUSTOMER QUERY PORTAL
          </p> */}
        </div>

        <nav className="relative flex-1 space-y-2 px-4 py-6">
          {nav.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-[#1e3cba] shadow-lg'
                    : 'text-white/90 hover:bg-white/15'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="relative px-4 pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#244bc8]"
          >
            <LogOut size={19} />
            Logout
          </button>

          <div className="mt-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
            <p className="text-xs font-bold">Need urgent assistance?</p>
            <p className="mt-1 text-xs leading-5 text-white/75">
              Raise a High priority query and our support team will review it.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

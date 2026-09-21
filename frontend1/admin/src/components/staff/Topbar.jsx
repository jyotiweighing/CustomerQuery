import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useEffect, useState } from 'react';
import { fetchNotifications } from '../../api/api';

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchNotifications().then((n) => setUnread(n.filter((x) => !x.read).length));
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-5 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="btn-ghost p-2 lg:hidden">
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-800 sm:text-xl">{title}</h1>
          {subtitle && <p className="truncate text-xs text-slate-400 sm:text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* <div className="relative hidden md:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Quick search..." className="input-field w-56 pl-9" />
        </div> */}

        {/* <button onClick={toggleTheme} className="btn-ghost p-2.5" title="Toggle theme">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button> */}

        <button onClick={() => navigate('/notifications')} className="btn-ghost relative p-2.5">
          <Bell size={19} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

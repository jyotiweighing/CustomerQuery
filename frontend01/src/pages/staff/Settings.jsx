import { useState } from 'react';
import { Sun, Moon, Bell, Lock, Globe, LogOut } from 'lucide-react';
import Layout from '../../components/staff/Layout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function ToggleRow({ icon: Icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-none dark:border-slate-800">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <Layout title="Settings" subtitle="Customize your workspace preferences.">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card p-5 sm:p-6">
          <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-white">Appearance</h3>
          <p className="mb-4 text-xs text-slate-400">Switch between light and dark mode.</p>
          <div className="flex gap-3">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${theme === 'light' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <Sun size={22} className="text-amber-500" /> <span className="text-sm font-semibold">Light</span>
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${theme === 'dark' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <Moon size={22} className="text-indigo-500" /> <span className="text-sm font-semibold">Dark</span>
            </button>
          </div>

          <h3 className="mb-1 mt-7 text-base font-bold text-slate-800 dark:text-white">Notifications</h3>
          <p className="mb-1 text-xs text-slate-400">Choose how you'd like to be notified.</p>
          <ToggleRow icon={Bell} title="Email Alerts" description="Get task updates via email" checked={emailAlerts} onChange={setEmailAlerts} />
          <ToggleRow icon={Bell} title="Push Notifications" description="Real-time alerts on this device" checked={pushAlerts} onChange={setPushAlerts} />
        </div>

        <div className="glass-card p-5 sm:p-6">
          <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-white">Security</h3>
          <p className="mb-1 text-xs text-slate-400">Manage account protection.</p>
          <ToggleRow icon={Lock} title="Two-Factor Authentication" description="Add an extra layer of security" checked={twoFactor} onChange={(v) => { setTwoFactor(v); showToast(v ? '2FA enabled.' : '2FA disabled.', 'success'); }} />

          <h3 className="mb-1 mt-7 text-base font-bold text-slate-800 dark:text-white">Preferences</h3>
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                <Globe size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Language & Region</p>
                <p className="text-xs text-slate-400">English (India)</p>
              </div>
            </div>
            <select className="input-field w-40 !py-2 text-sm">
              <option>English (India)</option>
              <option>Hindi</option>
            </select>
          </div>

          <button onClick={logout} className="btn-danger mt-6 w-full">
            <LogOut size={16} /> Logout from all devices
          </button>
        </div>
      </div>
    </Layout>
  );
}

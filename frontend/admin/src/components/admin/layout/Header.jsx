import { useState, useEffect } from 'react'
import { Menu, Search, Bell, Sun, ChevronDown, LogOut, User, Settings as SettingsIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { notifications } from '../../../data/analytics'
import { Link } from 'react-router-dom'
import { getProfile } from '../../../services/admin/userService' // Profile fetch karne ke liye import
import { useNavigate } from "react-router-dom";
const typeDot = {
  new: 'bg-blue-500',
  assigned: 'bg-indigo-500',
  resolved: 'bg-emerald-500',
  escalated: 'bg-rose-500',
}

// Name se Initials extract karne ke liye helper function
const getInitials = (name = "") => {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export default function Header({ onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState({ name: "", image: "" })
  const navigate = useNavigate();
  const unread = notifications.filter(n => n.unread).length

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getProfile();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error("Failed to load user profile in header:", err);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-100 bg-white/80 backdrop-blur px-4 sm:px-6">
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-800">
        <Menu size={22} />
      </button>

      {/* <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search queries, customers, staff…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-300 focus-ring transition-colors"
        />
      </div> */}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        {/* <button
          title="Toggle theme"
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Sun size={18} />
        </button> */}

        {/* Notifications */}
        {/* <div className="relative">
          <button
        onClick={() => navigate("/notification")}
        className="relative h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        title="View Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        )}
      </button>
      
        </div> */}

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
            className="flex items-center gap-2 rounded-lg pl-1.5 pr-2 py-1 hover:bg-slate-100 transition-colors"
          >
            {/* Condition: Pehle DB ki image check hogi, warna Name ke Initial Letters ka Avatar banega */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {getInitials(user.name)}
              </div>
            )}

            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {user.name || "User"}
            </span>
            <ChevronDown size={14} className="hidden sm:block text-slate-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-100 bg-white shadow-xl overflow-hidden py-1"
              >
                <Link to="/adminsettings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  <User size={15} /> Profile
                </Link>
                {/* <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  <SettingsIcon size={15} /> Settings
                </Link> */}
                <Link to="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={15} /> Logout
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  Users,
  UserCog,
  Building2,
  FileBarChart2,
  LineChart,
  Settings,
  LogOut,
  MessagesSquare,
  X,
  Download
} from "lucide-react";
import { cn } from "../../../utils/cn";
import logo from "../../../assets/Logo1.png"; 

const nav = [
  { to: "/admindashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/installation", label: "Installation", icon: Download },
  // { to: "/queries", label: "All Queries", icon: Inbox },
  // { to: "/customers", label: "Customers", icon: Users },
  { to: "/staff", label: "Support Staff", icon: UserCog },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/adminreports", label: "Reports", icon: FileBarChart2 },
  // { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/adminsettings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-300",
          "bg-gradient-to-b from-[#2e3ec7] via-[#1a82f4] to-[#00c6ff]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:static"
        )}
      >
        {/* Background Blur */}
        <div className="absolute top-[-10%] left-[-20%] w-52 h-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-20%] w-60 h-60 rounded-full bg-cyan-300/20 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center justify-between p-4 border-b border-white/10 ">
            <div className="bg-white rounded-xl p-2 shadow-md ml-8">
              <img
                src={logo}
                alt="logo"
                className="h-12 object-contain"
              />
            </div>

            <button
              onClick={onClose}
              className="lg:hidden text-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 mt-6 space-y-2">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group font-medium",
                    isActive
                      ? "bg-white text-[#1e3cba] shadow-lg font-bold"
                      : "text-white/90 hover:bg-white/15"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-[#1e3cba]"
                          : "text-white/70 group-hover:text-white"
                      }
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="relative z-10 p-2 border-t border-white/50">
          <NavLink
            to="/"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-white/90 hover:bg-red-500/20 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Logout
          </NavLink>

          {/* <p className="text-center text-[11px] text-white/60 mt-6">
            Customer Query Portal v1.0
          </p> */}
        </div>
      </aside>
    </>
  );
}

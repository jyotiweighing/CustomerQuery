import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  UserCog,
  Building2,
  FileBarChart2,
  Settings,
  LogOut,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import logo from "../../../assets/Logo1.png";

const nav = [
  { to: "/admindashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/installation", label: "Installation", icon: Download },
  { to: "/queries", label: "Customer Queries", icon: Inbox },
  { to: "/staff", label: "Support Staff", icon: UserCog },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/adminreports", label: "Reports", icon: FileBarChart2 },
  { to: "/adminsettings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onClose?.();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col justify-between overflow-hidden shadow-2xl",
          "bg-gradient-to-b from-[#2e3ec7] via-[#1a82f4] to-[#00c6ff]",
          "transition-all duration-300 ease-in-out lg:static",
          collapsed ? "w-[76px]" : "w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="pointer-events-none absolute left-[-20%] top-[-10%] h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-[-20%] h-60 w-60 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo / Sidebar Header */}
          <div
            className={cn(
              "relative flex h-[76px] items-center border-b border-white/10",
              collapsed ? "justify-center px-1" : "justify-between px-4"
            )}
          >
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-xl bg-white shadow-md",
                collapsed ? "h-12 w-12 p-1" : "h-14 w-[185px] px-3 py-2"
              )}
            >
              <img
                src={logo}
                alt="Jyoti Weighing Systems"
                className={cn(
                  "block object-contain",
                  collapsed ? "h-8 w-10" : "h-10 w-full"
                )}
              />
            </div>

            {/* Mobile close */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-white hover:bg-white/15 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={22} />
            </button>

            {/* Desktop collapse control */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                "rounded-lg p-2 text-white/90 transition-colors hover:bg-white/15",
                "hidden lg:block",
                collapsed ? "absolute right-1 top-1/2 -translate-y-1/2" : ""
              )}
              title={collapsed ? "Show sidebar" : "Hide sidebar"}
              aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="mt-6 space-y-2 px-3">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-300",
                    collapsed ? "justify-center" : "gap-4",
                    isActive
                      ? "bg-white font-bold text-[#1e3cba] shadow-lg"
                      : "text-white/90 hover:bg-white/15"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      className={cn(
                        "shrink-0",
                        isActive
                          ? "text-[#1e3cba]"
                          : "text-white/70 group-hover:text-white"
                      )}
                    />
                    <span className={cn("whitespace-nowrap", collapsed && "hidden")}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="relative z-10 border-t border-white/30 p-2">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "flex w-full items-center rounded-xl px-4 py-3 text-left text-white/90 transition-all hover:bg-red-500/20 hover:text-white",
              collapsed ? "justify-center" : "gap-4"
            )}
          >
            <LogOut size={19} className="shrink-0" />
            <span className={cn("whitespace-nowrap", collapsed && "hidden")}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

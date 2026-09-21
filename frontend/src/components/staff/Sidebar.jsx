// import { NavLink } from 'react-router-dom';
// import {
//   LayoutDashboard, ListChecks, CalendarDays, Bell, TrendingUp,
//   FileBarChart2, UserCircle2, Settings, LogOut, X,
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import logo from '../../assets/Logo1.png';

// const navItems = [
//   { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   { to: '/tasks', label: 'My Tasks', icon: ListChecks },
//   { to: '/calendar', label: 'Calendar', icon: CalendarDays },
//   { to: '/notifications', label: 'Notifications', icon: Bell },
//   { to: '/performance', label: 'Performance', icon: TrendingUp },
//   { to: '/profile', label: 'Profile', icon: UserCircle2 },
// ];

// export default function Sidebar({ open, onClose }) {
//   const { staff, logout } = useAuth();

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {open && (
//         <div 
//           onClick={onClose} 
//           className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" 
//         />
//       )}

//       {/* Sidebar - Fixed Height Screen View */}
//       <aside
//         className={`fixed top-0 bottom-0 left-0 z-40 flex h-screen w-64 flex-col bg-gradient-to-b from-[#2a3b8f] via-[#2f6fd6] to-[#29b6f6]
//         transition-transform duration-300 lg:translate-x-0
//         ${open ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* Header / Logo */}
//         <div className="flex items-center justify-between px-5 py-5 shrink-0">
//           <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-md">
//             <img src={logo} alt="Company Logo" className="h-full w-auto object-contain" />
//           </div>
//           <button onClick={onClose} className="ml-2 text-white/70 hover:text-white lg:hidden">
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation Items */}
//         <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-2">
//           {navItems.map(({ to, label, icon: Icon }) => (
//             <NavLink
//               key={to}
//               to={to}
//               onClick={onClose}
//               className={({ isActive }) =>
//                 `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'bg-white text-[#2f6fd6] shadow-md font-semibold'
//                     : 'text-white/85 hover:bg-white/10'
//                 }`
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   <Icon size={18} className={isActive ? 'text-[#2f6fd6]' : 'text-white/80 group-hover:text-white'} />
//                   {label}
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer / User Profile & Logout */}
//         <div className="border-t border-white/15 p-4 shrink-0 space-y-2">
//           <div className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 backdrop-blur-sm capitalize">
//             <img 
//               src={staff?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff?.name || 'User')}&background=ffff`} 
//               alt={staff?.name} 
//               className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40 " 
//             />
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-semibold text-white">{staff?.name || "User"}</p>
//             </div>
//           </div>

//           <button 
//             onClick={logout} 
//             className="flex w-full items-center justify-start gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
//           >
//             <LogOut size={17} /> Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }


import { NavLink, useNavigate } from 'react-router-dom';  
import {
  LayoutDashboard, ListChecks, CalendarDays, Bell, TrendingUp,
  FileBarChart2, UserCircle2, Settings, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/Logo1.png';


const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/performance', label: 'Performance', icon: TrendingUp },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
];


export default function Sidebar({ open, onClose }) {
  const { staff, logout } = useAuth();
  const navigate = useNavigate(); // 2. Navigate hook initialize karein

  // 3. Logout handler function
  const handleLogout = async () => {
    if (logout) {
      await logout(); // Context wala logout call karein
    }
    navigate('/'); // Login page ('/') path par bhej dein
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" 
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex h-screen w-64 flex-col bg-gradient-to-b from-[#2a3b8f] via-[#2f6fd6] to-[#29b6f6]
        transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-5 py-5 shrink-0">
          <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-md">
            <img src={logo} alt="Company Logo" className="h-full w-auto object-contain" />
          </div>
          <button onClick={onClose} className="ml-2 text-white/70 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#2f6fd6] shadow-md font-semibold'
                    : 'text-white/85 hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-[#2f6fd6]' : 'text-white/80 group-hover:text-white'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile & Logout */}
        <div className="border-t border-white/15 p-4 shrink-0 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 backdrop-blur-sm capitalize">
            <img 
              src={staff?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff?.name || 'User')}&background=ffff`} 
              alt={staff?.name} 
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/40 " 
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{staff?.name || "User"}</p>
            </div>
          </div>

          {/* 4. onClick handler yahan update kar diya hai */}
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center justify-start gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
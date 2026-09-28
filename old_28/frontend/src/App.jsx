import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/staff/ProtectedRoute";

import Login from "./pages/staff/Login";
import ForgotPassword from "./pages/staff/ForgotPassword";
import Dashboard from "./pages/staff/Dashboard";
import MyTasks from "./pages/staff/MyTasks";
import TaskDetails from "./pages/staff/TaskDetails";
import Performance from "./pages/staff/Performance";
import Notifications from "./pages/staff/Notifications";
import Profile from "./pages/staff/Profile";
import CalendarPage from "./pages/staff/Calendar";
import Reports from "./pages/staff/Reports";
import Settings from "./pages/staff/Settings";
import ResetPassword from "./pages/staff/ResetPassword";

//Admin
import OtpVerification from "./pages/admin/Auth/OtpVerification";
import AppShell from "./components/admin/layout/AppShell";
import AdminProtectedRoute from "./pages/admin/Auth/ProtectedRoute";
import AdminLogin from "./pages/admin/Auth/Login";
import AdminSignup from "./pages/admin/Auth/Signup";
import AdminForgotPassword from "./pages/admin/Auth/ForgotPassword";
import AdminOtpVerification from "./pages/admin/Auth/OtpVerification";
import AdminResetPassword from "./pages/admin/Auth/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard/Dashboard";
import QueriesList from "./pages/admin/Queries/QueriesList";
import QueryDetails from "./pages/admin/Queries/QueryDetails";
import Customers from "./pages/admin/Customers/Customers";
import StaffManagement from "./pages/admin/Staff/StaffManagement";
import Departments from "./pages/admin/Staff/Departments";
import AdminReports from "./pages/admin/Reports/Reports";
import Analytics from "./pages/admin/Analytics/Analytics";
import AdminSettings from "./pages/admin/Settings/Settings";
import Installation from "./pages/admin/Installation/Installation";
import AdminNotifications from "./pages/admin/Notification/Notifications";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["staff"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <MyTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <TaskDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <Performance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}

              {/* //admin */}
              {/* <Route path="/" element={<Login />} /> */}
              {/* <Route path="/signup" element={<Signup />} /> */}
              {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
              <Route path="/otp-verification" element={<OtpVerification />} />
              {/* <Route path="/reset-password" element={<ResetPassword />} /> */}

              <Route element={<AdminProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route
                    element={
                      <AdminProtectedRoute allowedRoles={["Admin", "manager"]} />
                    }
                  >
                    <Route path="/installation" element={<Installation />} />
                    <Route path="/staff" element={<StaffManagement />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/adminreports" element={<AdminReports />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/admindashboard" element={<AdminDashboard />} />
                    <Route path="/queries" element={<QueriesList />} />
                    <Route path="/queries/:id" element={<QueryDetails />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/adminsettings" element={<AdminSettings />} />
                    <Route path="/adminnotification" element={<AdminNotifications />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

// import AppShell from "./components/layout/AppShell";
// import ProtectedRoute from "./pages/Auth/ProtectedRoute";
// import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";
// import ForgotPassword from "./pages/Auth/ForgotPassword";
// import OtpVerification from "./pages/Auth/OtpVerification";
// import ResetPassword from "./pages/Auth/ResetPassword";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import QueriesList from "./pages/Queries/QueriesList";
// import QueryDetails from "./pages/Queries/QueryDetails";
// import Customers from "./pages/Customers/Customers";
// import StaffManagement from "./pages/Staff/StaffManagement";
// import Departments from "./pages/Staff/Departments";
// import Reports from "./pages/Reports/Reports";
// import Analytics from "./pages/Analytics/Analytics";
// import Settings from "./pages/Settings/Settings";
// import Installation from "./pages/Installation/Installation"
// import Notifications from "./pages/Notification/Notifications";
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/otp-verification" element={<OtpVerification />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         <Route element={<ProtectedRoute />}>
//           <Route element={<AppShell />}>
//             <Route
//               element={<ProtectedRoute allowedRoles={["Admin", "manager"]} />}
//             >
//               <Route path="/installation" element={<Installation />} />
//               <Route path="/staff" element={<StaffManagement />} />
//               <Route path="/departments" element={<Departments />} />
//               <Route path="/reports" element={<Reports />} />
//               <Route path="/analytics" element={<Analytics />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/queries" element={<QueriesList />} />
//               <Route path="/queries/:id" element={<QueryDetails />} />
//               <Route path="/customers" element={<Customers />} />
//               <Route path="/settings" element={<Settings />} />
//               <Route path="/notification" element={<Notifications />} />
//             </Route>
//           </Route>
//         </Route>

//         {/* ---------------- FALLBACK ROUTE ---------------- */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

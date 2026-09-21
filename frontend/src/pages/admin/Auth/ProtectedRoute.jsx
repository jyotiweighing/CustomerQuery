// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles }) => {
//   // LocalStorage se token aur user fetch karein
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   // 1. Agar Token hi nahi hai -> Login page par bhej do
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // 2. Agar Route me Role restriction hai aur user ka role match nahi kar raha
//   if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
//     return <Navigate to="/" replace />; // Unauthorized hone par home ya custom error page par redirct karein
//   }

//   // Conditions fulfill hone par requested component render karein
//   return <Outlet />;
// };

// export default ProtectedRoute;

import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // LocalStorage se token aur user fetch karein
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Back button click hone par page cache re-validate karne ke liye
  useEffect(() => {
    const handlePageShow = (event) => {
      // Agar page browser ke back-forward cache se load ho raha ho
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // 1. Agar Token ya User Object hi nahi hai -> Clear & Redirect to Login
  if (!token || !user) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 2. Role Check: Agar user ka role allowedRoles me nahi hai
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    // Agar Staff admin page par aane ki koshish kare -> Staff Dashboard par bhej do
    // Agar Admin unauthorized page par jaye -> Admin Dashboard par bhej do
    const fallbackRedirect = user.role === "staff" ? "/dashboard" : "/admindashboard";
    return <Navigate to={fallbackRedirect} replace />;
  }

  // 3. Sab Sahi hone par Nested Routes Render karein
  return <Outlet />;
};

export default ProtectedRoute;
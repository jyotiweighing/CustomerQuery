// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-50 ">
//         <Loader2 className="animate-spin text-brand-600" size={32} />
//       </div>
//     );
//   }

//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   return children;
// }


import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRole = "staff"  }) {
  const { isAuthenticated, isLoading, staff, token } = useAuth();
  const navigate = useNavigate();

  // Local storage se active session detail fetch karein
  const savedToken = token || localStorage.getItem('token');
  const userRole = staff?.role || localStorage.getItem('userRole'); 

  // Back-button click karne par session re-verify karne ke liye
  useEffect(() => {
    const handlePageShow = (event) => {
      // Agar page back/forward cache se aa raha hai
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-[#2563eb]" size={32} /> 
      </div>
    );
  }

  // 1. Agar Token hi nahi hai -> Clear everything and redirect to Login
  if (!savedToken || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Agar logged-in user ka role match nahi karta (e.g. Admin staff page par back dabaye)
  if (userRole !== allowedRole) {
    return <Navigate to={userRole === 'admin' ? '/admindashboard' : '/'} replace />;
  }

  return children;
}
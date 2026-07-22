import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role for this page — send them to their own dashboard
    const fallback = user.role === 'GYM_OWNER' ? '/owner/dashboard' : '/user/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
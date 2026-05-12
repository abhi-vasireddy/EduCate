import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = useAppStore((state) => state.user);
  const loading = useAppStore((state) => state.loading);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Optionally redirect to a 'Forbidden' or 'Not Authorized' page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

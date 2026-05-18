/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

// 1. Define the props to include 'requiredPermission'
interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string; // Optional: some routes just need login, not specific permissions
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, loading, roles } = useAppStore();
  const location = useLocation();

  // Show nothing (or a spinner) while checking auth status
  if (loading) {
    return null; 
  }

  // 2. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check for specific permissions if required
  if (requiredPermission) {
    // Find the current user's role configuration
    const userRoleConfig = roles.find(r => r.name === user.role);
    const permissions = userRoleConfig?.permissions || [];

    // Bypass check for Admins, otherwise check permission array
    const isAdmin = ['Admin', 'Super Admin', 'super_admin'].includes(user.role);
    const hasAccess = isAdmin || permissions.includes(requiredPermission);

    if (!hasAccess) {
      // Redirect to dashboard if they don't have permission
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
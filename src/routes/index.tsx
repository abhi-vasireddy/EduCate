/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { Teachers } from '../pages/Teachers';
import { Attendance } from '../pages/Attendance';
import { Leaves } from '../pages/Leaves';
import { Tickets } from '../pages/Tickets';
import { Hierarchy } from '../pages/Hierarchy';
import { Roles } from '../pages/Roles';
import { Payroll } from '../pages/Payroll';
import { Settings } from '../pages/Settings';
import { Login } from '../pages/Login';
import { TeacherProfile } from '../pages/TeacherProfile';
import { SetupAdmin } from '../pages/SetupAdmin';
import { ProtectedRoute } from '../components/ProtectedRoute'; // Import ProtectedRoute

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'teachers',
        element: (
          <ProtectedRoute requiredPermission="view_teachers">
            <Teachers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teachers/:id',
        element: (
          <ProtectedRoute requiredPermission="view_teachers">
            <TeacherProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'attendance',
        element: (
          <ProtectedRoute requiredPermission="view_attendance">
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leaves',
        element: (
          <ProtectedRoute requiredPermission="view_leaves">
            <Leaves />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tickets',
        element: (
          <ProtectedRoute requiredPermission="view_tickets">
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: 'hierarchy',
        element: (
          <ProtectedRoute requiredPermission="view_hierarchy">
            <Hierarchy />
          </ProtectedRoute>
        ),
      },
      {
        path: 'roles',
        element: (
          <ProtectedRoute requiredPermission="view_roles">
            <Roles />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payroll',
        element: (
          <ProtectedRoute requiredPermission="view_payroll">
            <Payroll />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredPermission="view_settings">
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: '/setup-secret-admin', // You can visit this URL directly
        element: <SetupAdmin />,
      },
    ],
  },
]);
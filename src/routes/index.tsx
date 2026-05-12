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

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'teachers',
        element: <Teachers />,
      },
      {
        path: 'teachers/:id',
        element: <TeacherProfile />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'leaves',
        element: <Leaves />,
      },
      {
        path: 'tickets',
        element: <Tickets />,
      },
      {
        path: 'hierarchy',
        element: <Hierarchy />,
      },
      {
        path: 'roles',
        element: <Roles />,
      },
      {
        path: 'payroll',
        element: <Payroll />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

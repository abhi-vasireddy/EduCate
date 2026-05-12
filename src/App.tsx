/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const initializeAuth = useAppStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <RouterProvider router={router} />;
}

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto h-full w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

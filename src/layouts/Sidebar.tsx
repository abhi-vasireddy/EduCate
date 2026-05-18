/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CalendarDays, 
  TicketCheck, 
  Network, 
  ShieldCheck, 
  Banknote, 
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

// 1. Define the nav items with their required permission keys
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', permission: 'view_dashboard' },
  { icon: Users, label: 'Teachers', path: '/teachers', permission: 'view_teachers' },
  { icon: CalendarCheck, label: 'Attendance', path: '/attendance', permission: 'view_attendance' },
  { icon: CalendarDays, label: 'Leaves', path: '/leaves', permission: 'view_leaves' },
  { icon: TicketCheck, label: 'Tickets', path: '/tickets', permission: 'view_tickets' },
  { icon: Network, label: 'Hierarchy', path: '/hierarchy', permission: 'view_hierarchy' },
  { icon: ShieldCheck, label: 'Roles', path: '/roles', permission: 'view_roles' },
  { icon: Banknote, label: 'Payroll', path: '/payroll', permission: 'view_payroll' },
  { icon: Settings, label: 'Settings', path: '/settings', permission: 'view_settings' },
];

export function Sidebar() {
  const logout = useAppStore(state => state.logout);
  const { sidebarOpen, setSidebarOpen, user, roles } = useAppStore(); // 2. Access user and roles from store
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 3. Filter navigation items based on current user's permissions
  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    
    // Find the role object that matches the user's role string
    const userRoleData = roles.find(r => r.name === user.role);
    const userPermissions = userRoleData?.permissions || [];

    // 'Admin' and 'Super Admin' typically see everything, 
    // otherwise filter by specific permission strings
    if (user.role === 'Admin' || user.role === 'Super Admin' || user.role === 'super_admin') {
      return navItems;
    }

    return navItems.filter(item => userPermissions.includes(item.permission));
  }, [user, roles]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col h-[100dvh] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 w-64 shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
                S
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">EduStaff</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -mr-2"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group",
                isActive 
                  ? "text-primary font-medium shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20 -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50 bg-muted/10 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full text-left transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
import { Bell, Search, Menu, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function Header() {
  const { user, toggleSidebar, notifications, markNotificationRead } = useAppStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search teachers, tickets..." 
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-2 font-medium border-b">
              <span>Notifications ({unreadCount})</span>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</div>
            ) : (
              notifications.map(notification => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex flex-col items-start p-3 gap-1 cursor-default ${!notification.isRead ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-sm">{notification.title}</span>
                    {!notification.isRead && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markNotificationRead(notification.id)}>
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">{notification.message}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {notification.createdAt ? (typeof (notification.createdAt as any).toDate === 'function' ? format((notification.createdAt as any).toDate(), 'MMM d, h:mm a') : format(new Date(notification.createdAt), 'MMM d, h:mm a')) : 'Just now'}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.role}</p>
          </div>
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

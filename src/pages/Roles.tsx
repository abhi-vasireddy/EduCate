import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Plus, Settings2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function Roles() {
  const { roles } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-1">Configure access control levels and permissions.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <Card key={role.id} className="border-border/50 hover:shadow-md transition-all">
             <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                   <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground -mr-2 -mt-2">
                     <Settings2 className="w-4 h-4" />
                   </Button>
                </div>
                <CardTitle className="text-xl mt-4">{role.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">{role.description}</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">{role.users || 0} Active Users</span>
                  <Badge variant={role.name === 'Admin' ? 'default' : 'outline'}>{role.name === 'Admin' ? 'System' : 'Custom'}</Badge>
                </div>
             </CardContent>
          </Card>
        ))}
        {roles.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No roles configured yet.
          </div>
        )}
      </div>
    </div>
  );
}

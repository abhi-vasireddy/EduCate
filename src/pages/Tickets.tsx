import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export function Tickets() {
  const { tickets, teachers } = useAppStore();

  const enrichedTickets = tickets.map(ticket => ({
    ...ticket,
    teacher: teachers.find(t => t.id === ticket.teacherId)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">Manage IT, HR, and facility requests.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Raise Issue
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ticket # or subject..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {enrichedTickets.map(ticket => (
          <Card key={ticket.id} className="border-border/50 hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs font-mono">{ticket.id}</Badge>
                <Badge variant={
                  ticket.status === 'Open' ? 'destructive' :
                  ticket.status === 'In Progress' ? 'secondary' : 'default'
                } className={
                  ticket.status === 'Open' ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0' :
                  ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0' :
                   'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0'
                }>
                  {ticket.status}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-1">{ticket.subject}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                {ticket.description}
              </p>
              <div className="flex justify-between items-end mt-auto text-xs">
                <div>
                  <p className="font-medium text-foreground">{ticket.teacher?.name}</p>
                  <p className="text-muted-foreground">{ticket.category} • {ticket.createdAt ? (typeof (ticket.createdAt as any).toDate === 'function' ? format((ticket.createdAt as any).toDate(), 'MMM d, yyyy') : format(new Date(ticket.createdAt), 'MMM d, yyyy')) : 'N/A'}</p>
                </div>
                <Badge variant="outline" className="opacity-70">{ticket.priority}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

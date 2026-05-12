import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';

export function Leaves() {
  const { leaves, teachers, updateLeaveStatus } = useAppStore();

  const enrichedLeaves = leaves.map(leave => ({
    ...leave,
    teacher: teachers.find(t => t.id === leave.teacherId)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground mt-1">Review and manage staff leave applications.</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Teacher</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedLeaves.map((leave) => (
                  <TableRow key={leave.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-medium">
                      {leave.teacher?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">{leave.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{leave.startDate ? format(new Date(leave.startDate), 'MMM d, yyyy') : 'N/A'} - {leave.endDate ? format(new Date(leave.endDate), 'MMM d, yyyy') : 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">{leave.days} day(s)</p>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {leave.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        leave.status === 'Approved' ? 'default' : 
                        leave.status === 'Pending' ? 'secondary' : 'destructive'
                      } className={
                        leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0' :
                        leave.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0' :
                        'bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0'
                      }>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {leave.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-none px-2"
                            onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 border-none px-2"
                            onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {enrichedLeaves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No leave requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-border/50">
            {enrichedLeaves.map((leave) => (
              <div key={leave.id} className="p-4 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-base">{leave.teacher?.name || 'Unknown'}</p>
                    <Badge variant="outline" className="font-normal mt-1">{leave.type}</Badge>
                  </div>
                  <Badge variant={
                    leave.status === 'Approved' ? 'default' : 
                    leave.status === 'Pending' ? 'secondary' : 'destructive'
                  } className={
                    leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0' :
                    leave.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0' :
                    'bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0'
                  }>
                    {leave.status}
                  </Badge>
                </div>
                
                <div className="bg-muted/20 rounded-md p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration ({leave.days}d)</span>
                    <span className="font-medium text-right shrink-0">
                      {leave.startDate ? format(new Date(leave.startDate), 'MMM d, yyyy') : 'N/A'} <br className="sm:hidden" />- {leave.endDate ? format(new Date(leave.endDate), 'MMM d, yyyy') : 'N/A'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/50 text-sm">
                     <p className="text-muted-foreground mb-1">Reason</p>
                     <p className="line-clamp-2">{leave.reason}</p>
                  </div>
                </div>

                {leave.status === 'Pending' && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                      className="flex-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-700 border-none"
                    >
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                      className="flex-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 border-none"
                    >
                      <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {enrichedLeaves.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No leave requests found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

export function Payroll() {
  const { payroll, teachers } = useAppStore();

  const enrichedPayroll = payroll.map(record => ({
    ...record,
    teacher: teachers.find(t => t.id === record.teacherId)
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground mt-1">Process and review staff salaries.</p>
        </div>
        <Button className="gap-2">
          Run Payroll
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
           <CardTitle>April 2026</CardTitle>
           <CardDescription>Processed on {format(new Date('2026-04-28'), 'MMMM d, yyyy')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Employee</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead className="font-bold">Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedPayroll.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-medium">
                      {record.teacher?.name || 'Unknown'}
                      <div className="text-xs text-muted-foreground font-normal">{record.teacher?.department}</div>
                    </TableCell>
                    <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-emerald-600">+${record.allowances.toLocaleString()}</TableCell>
                    <TableCell className="text-destructive">-${record.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">${record.netPay.toLocaleString()}</TableCell>
                    <TableCell>
                       <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0">
                         {record.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-border/50">
            {enrichedPayroll.map((record) => (
              <div key={record.id} className="p-4 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-base">{record.teacher?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{record.teacher?.department}</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0">
                    {record.status}
                  </Badge>
                </div>
                
                <div className="bg-muted/20 rounded-md p-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Basic Salary</p>
                    <p className="font-mono">${record.basicSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Net Pay</p>
                    <p className="font-mono font-bold text-base leading-tight">${record.netPay.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 gap-3 pt-2 border-t border-border/50 mt-1">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Allowances</p>
                      <p className="font-mono text-emerald-600">+${record.allowances.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Deductions</p>
                      <p className="font-mono text-destructive">-${record.deductions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button variant="outline" className="w-full text-primary hover:bg-primary/10 hover:text-primary border-primary/20">
                    <Download className="w-4 h-4 mr-2" /> Download Payslip
                  </Button>
                </div>
              </div>
            ))}
            {enrichedPayroll.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No payroll records found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

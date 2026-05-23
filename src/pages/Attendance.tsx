/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function Attendance() {
  const { attendance, teachers } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. Cross-reference streaming records with local teacher structural profiles
  const enrichedAttendance = attendance.map(record => {
    const teacherProfile = teachers.find(t => t.id === record.teacherId || t.uid === record.teacherId);
    return {
      ...record,
      teacher: teacherProfile
    };
  }).filter(record => 
    // Fallback safe name filtering matching standard input terms
    (record.teacher?.name || 'Unknown Staff').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Attendance</h1>
          <p className="text-muted-foreground mt-1">
            Biometric scan logs tracking window: {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="w-4 h-4" /> Date Filter
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
               <p className="text-2xl font-bold">{enrichedAttendance.length}</p>
             </div>
             <Clock className="w-8 h-8 text-primary opacity-50" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="py-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by teacher name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Teacher</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedAttendance.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 font-medium">
                      {record.teacher?.name || 'Unknown Staff'}
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {record.teacher?.employeeId || 'System Record'}
                      </p>
                    </TableCell>
                    <TableCell>
                      {record.date ? format(new Date(record.date), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-emerald-600 font-semibold">
                      {record.checkIn || '--:--'}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-amber-600 font-semibold">
                      {record.checkOut || '--:--'}
                    </TableCell>
                    <TableCell>{record.workingHours ? `${record.workingHours}h` : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={
                          record.status === 'Present' ? 'bg-emerald-500/10 text-emerald-600 border-0 shadow-none' :
                          record.status === 'Late' ? 'bg-amber-500/10 text-amber-600 border-0 shadow-none' :
                          'bg-red-500/10 text-red-600 border-0 shadow-none'
                        }
                      >
                        {record.status || 'Present'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {enrichedAttendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-5 h-5 opacity-40" />
                        <span>No live attendance records found matching criteria.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-border/50">
            {enrichedAttendance.map((record) => (
              <div key={record.id} className="p-4 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-base">{record.teacher?.name || 'Unknown Staff'}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.date ? format(new Date(record.date), 'MMM d, yyyy') : 'N/A'}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={
                      record.status === 'Present' ? 'bg-emerald-500/10 text-emerald-600 border-0 shadow-none' :
                      record.status === 'Late' ? 'bg-amber-500/10 text-amber-600 border-0 shadow-none' :
                      'bg-red-500/10 text-red-600 border-0 shadow-none'
                    }
                  >
                    {record.status || 'Present'}
                  </Badge>
                </div>
                
                <div className="bg-muted/20 rounded-md p-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Check In</p>
                    <p className="font-mono font-medium text-emerald-600">{record.checkIn || '--:--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Check Out</p>
                    <p className="font-mono font-medium text-amber-600">{record.checkOut || '--:--'}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-border/50 mt-1">
                    <p className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Total Hours</span>
                      <span className="font-medium">{record.workingHours ? `${record.workingHours}h` : 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {enrichedAttendance.length === 0 && (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-1">
                <AlertCircle className="w-5 h-5 opacity-40" />
                <span>No attendance records found.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
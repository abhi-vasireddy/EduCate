import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function Teachers() {
  const { teachers } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(t => 
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground mt-1">Manage all teaching and non-teaching staff.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Staff Member
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader className="py-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or department..."
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
                  <TableHead className="pl-6">Employee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher, i) => (
                  <TableRow key={teacher.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={teacher.avatar} />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{teacher.designation}</p>
                      <p className="text-xs text-muted-foreground">{teacher.department}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{teacher.email}</p>
                      <p className="text-xs text-muted-foreground">{teacher.phone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        teacher.status === 'Active' ? 'default' : 
                        teacher.status === 'On Leave' ? 'secondary' : 'destructive'
                      } className={
                        teacher.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0' :
                        teacher.status === 'On Leave' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0' :
                        'bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0'
                      }>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "opacity-0 group-hover:opacity-100 transition-opacity" })}>
                            <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem render={<Link to={`/teachers/${teacher.id}`} className="flex items-center cursor-pointer" />}>
                              <Eye className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Terminate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTeachers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No staff members found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y divide-border/50">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="p-4 space-y-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-base">{teacher.name}</p>
                      <p className="text-xs text-muted-foreground">{teacher.employeeId} • {teacher.department}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "-mr-2" })}>
                        <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem render={<Link to={`/teachers/${teacher.id}`} className="flex items-center cursor-pointer" />}>
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Terminate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <p className="font-medium">{teacher.designation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant={
                      teacher.status === 'Active' ? 'default' : 
                      teacher.status === 'On Leave' ? 'secondary' : 'destructive'
                    } className={
                      teacher.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0' :
                      teacher.status === 'On Leave' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0' :
                      'bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0'
                    }>
                      {teacher.status}
                    </Badge>
                  </div>
                </div>
                <div className="pt-2 flex flex-col gap-1 text-sm bg-muted/20 p-2 rounded-md">
                  <p className="flex items-center justify-between"><span className="text-muted-foreground text-xs">Email</span> <span>{teacher.email}</span></p>
                  <p className="flex items-center justify-between"><span className="text-muted-foreground text-xs">Phone</span> <span>{teacher.phone}</span></p>
                </div>
              </div>
            ))}
            {filteredTeachers.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No staff members found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

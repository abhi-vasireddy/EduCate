/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreVertical, Eye, Trash2, Briefcase, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { userService } from '../services/firebase/userService';
import { authService } from '../services/firebase/authService';
import { User, UserRole } from '../types';

interface UserWithPassword extends User {
  tempPassword?: string;
}

export function Teachers() {
  const { addTeacher, roles, designations } = useAppStore();
  const [allUsers, setAllUsers] = useState<UserWithPassword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = userService.subscribeToUsers((users) => {
      setAllUsers(users as UserWithPassword[]);
    });
    return () => unsub();
  }, []);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    designation: '', // Replaced department
    role: '' as UserRole,
    managerId: '',
    employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`
  });

  const handleSave = async () => {
    // Validation updated to check for role and designation instead of department
    if (!newStaff.name || !newStaff.email || !newStaff.password || !newStaff.role || !newStaff.designation) {
      alert("Please fill in all fields including Role and Designation.");
      return;
    }

    setLoading(true);
    try {
      // Create Auth account and user profile
      const { user } = await authService.registerUser(newStaff.email, newStaff.password, {
        name: newStaff.name,
        role: newStaff.role,
        designation: newStaff.designation, // Designation is now part of the profile
        employeeId: newStaff.employeeId,
        managerId: newStaff.managerId,
        status: 'Active',
        tempPassword: newStaff.password 
      });

      // Create detailed teacher/staff record
      await addTeacher({
        uid: user.uid,
        name: newStaff.name,
        email: newStaff.email,
        employeeId: newStaff.employeeId,
        designation: newStaff.designation,
        status: 'Active',
      });

      setIsDialogOpen(false);
      setNewStaff({ 
        name: '', 
        email: '', 
        password: '', 
        designation: '', 
        role: '' as UserRole,
        managerId: '',
        employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}` 
      });
      alert("Staff member created successfully!");
    } catch (error: any) {
      console.error("Staff creation failed:", error);
      alert("Failed to create staff: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground mt-1">Manage all registered staff and users.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={newStaff.name} 
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@school.com" 
                  value={newStaff.email} 
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Minimum 6 characters" 
                  value={newStaff.password} 
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} 
                />
              </div>

              {/* System Role Selection */}
              <div className="grid gap-2">
                <Label>System Role</Label>
                <Select onValueChange={(val) => setNewStaff({...newStaff, role: val as UserRole})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Designation Selection */}
              <div className="grid gap-2">
                <Label>Professional Designation</Label>
                <Select onValueChange={(val) => setNewStaff({...newStaff, designation: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title/subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="manager">Reporting Manager</Label>
                <Select onValueChange={(val) => setNewStaff({...newStaff, managerId: val})}>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.map((u) => u.uid && (
                      <SelectItem key={u.uid} value={u.uid}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Creating..." : "Save Staff"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardHeader className="py-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">User / Employee</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.uid} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                      {user.designation || 'Staff'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
                      <span className="text-sm">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-0 shadow-none' : ''}>
                      {user.status || 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/teachers/${user.uid}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
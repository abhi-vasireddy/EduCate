import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreVertical, Eye, Trash2 } from 'lucide-react';
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
import { userService } from '../services/firebase/userService';
import { authService } from '../services/firebase/authService';
import { User, UserRole } from '../types';

// Extended type to include the tempPassword we store in Firestore
interface UserWithPassword extends User {
  tempPassword?: string;
}

export function Teachers() {
  const { addTeacher } = useAppStore();
  const [allUsers, setAllUsers] = useState<UserWithPassword[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Subscribe to the 'users' collection for real-time updates
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
    department: '',
    role: 'Teacher' as UserRole,
    employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`
  });

  const handleSave = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      alert("Please fill in Name, Email, and a Temporary Password.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await authService.registerUser(newStaff.email, newStaff.password, {
        name: newStaff.name,
        role: newStaff.role,
        department: newStaff.department,
        employeeId: newStaff.employeeId,
        status: 'Active',
        tempPassword: newStaff.password 
      });

      await addTeacher({
        uid: user.uid,
        name: newStaff.name,
        email: newStaff.email,
        employeeId: newStaff.employeeId,
        department: newStaff.department,
        designation: newStaff.role,
        status: 'Active',
      });

      setIsDialogOpen(false);
      setNewStaff({ 
        name: '', 
        email: '', 
        password: '', 
        department: '', 
        role: 'Teacher', 
        employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}` 
      });
      alert("Staff member created successfully!");
    } catch (error: any) {
      // Handling specific Firebase errors for a better user experience
      if (error.code === 'auth/email-already-in-use' || error.message.includes('email-already-in-use')) {
        alert("This email address is already in use. Please try a different email.");
      } else if (error.code === 'auth/weak-password') {
        alert("The password is too weak. Please use at least 6 characters.");
      } else {
        console.error("Staff creation failed:", error);
        alert("Failed to create staff: " + error.message);
      }
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
          <DialogTrigger>
            <div className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 cursor-pointer shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> Add Staff Member
            </div>
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
              <div className="grid gap-2">
                <Label htmlFor="dept">Department</Label>
                <Input 
                  id="dept" 
                  placeholder="Administration" 
                  value={newStaff.department} 
                  onChange={(e) => setNewStaff({...newStaff, department: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Creating Account..." : "Save Staff"}
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
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">User / Employee</TableHead>
                  <TableHead>Email</TableHead>
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
                          <p className="text-xs text-muted-foreground">{user.employeeId || 'System User'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-0 shadow-none' : 'border-0'}>
                        {user.status || 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem asChild>
                            <Link to={`/teachers/${user.uid}`} className="flex items-center cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
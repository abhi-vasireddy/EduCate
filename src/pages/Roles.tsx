/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Plus, MoreVertical, Edit, Trash2, GraduationCap, Layers } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { roleService } from '../services/firebase/roleService';
import { designationService } from '../services/firebase/designationService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role } from '../types';

const SECTION_ACCESS_LIST = [
  { id: 'view_dashboard', label: 'Dashboard Access' },
  { id: 'view_teachers', label: 'Manage Teachers' },
  { id: 'view_attendance', label: 'View Attendance' },
  { id: 'view_leaves', label: 'Manage Leaves' },
  { id: 'view_tickets', label: 'Support Tickets' },
  { id: 'view_hierarchy', label: 'Organization Hierarchy' },
  { id: 'view_roles', label: 'Role Management' },
  { id: 'view_payroll', label: 'Payroll Access' },
  { id: 'view_settings', label: 'System Settings' },
];

export function Roles() {
  const { roles, designations } = useAppStore();
  const [loading, setLoading] = useState(false);
  
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDesignationOpen, setIsDesignationOpen] = useState(false);
  
  // CRITICAL: This must store the full Role object including the 'id'
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingDesignation, setEditingDesignation] = useState<any>(null);

  const [roleData, setRoleData] = useState({
    name: '',
    permissions: [] as string[]
  });

  const [designationData, setDesignationData] = useState({
    name: '',
    description: ''
  });

  // --- ROLE HANDLERS ---
  const openCreateRole = () => {
    setEditingRole(null); // Clear ID
    setRoleData({ name: '', permissions: [] });
    setIsRoleOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role); // Store the role (with its ID)
    setRoleData({
      name: role.name,
      permissions: role.permissions || []
    });
    setIsRoleOpen(true);
  };

  const togglePermission = (permId: string) => {
    setRoleData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleSaveRole = async () => {
    if (!roleData.name) return alert("Please enter a role name.");
    setLoading(true);
    try {
      // Check if we have an ID. If yes, it's an UPDATE.
      if (editingRole?.id) {
        await roleService.updateRole(editingRole.id, {
          name: roleData.name,
          permissions: roleData.permissions
        });
      } else {
        // Otherwise, it's a NEW role.
        await roleService.addRole({ 
          ...roleData, 
          roleId: `role_${Date.now()}`, 
          users: 0 
        });
      }
      setIsRoleOpen(false);
      setEditingRole(null);
    } catch (e) {
      console.error("Error saving role:", e);
      alert("Failed to save role updates.");
    } finally {
      setLoading(false);
    }
  };

  // --- DESIGNATION HANDLERS ---
  const handleSaveDesignation = async () => {
    if (!designationData.name) return alert("Please enter a designation name.");
    setLoading(true);
    try {
      if (editingDesignation?.id) {
        await designationService.updateDesignation(editingDesignation.id, designationData);
      } else {
        await designationService.addDesignation(designationData);
      }
      setIsDesignationOpen(false);
      setEditingDesignation(null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Management Center</h1>
          <p className="text-muted-foreground mt-1">Configure section access and professional titles.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setEditingDesignation(null); setDesignationData({name:'', description:''}); setIsDesignationOpen(true); }} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Add Designation
          </Button>
          <Button onClick={openCreateRole} className="gap-2">
            <Plus className="w-4 h-4" /> Create System Role
          </Button>
        </div>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="roles" className="gap-2"><ShieldCheck className="w-4 h-4"/> System Roles</TabsTrigger>
          <TabsTrigger value="designations" className="gap-2"><GraduationCap className="w-4 h-4"/> Designations</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card className="border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Role Name</TableHead>
                  <TableHead>Section Access</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="pl-6 font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.permissions?.length || 0} Sections Enabled</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditRole(role)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Access
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { if(confirm("Delete this role?")) roleService.deleteRole(role.id!); }} className="text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="designations">
          <Card className="border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Designation Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {designations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="pl-6 font-medium flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> {d.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.description}</TableCell>
                    <TableCell className="text-right pr-6">
                       <Button variant="ghost" size="sm" onClick={() => { setEditingDesignation(d); setDesignationData({name: d.name, description: d.description}); setIsDesignationOpen(true); }}><Edit className="w-4 h-4"/></Button>
                       <Button variant="ghost" size="sm" onClick={() => { if(confirm("Delete this designation?")) designationService.deleteDesignation(d.id!); }} className="text-destructive"><Trash2 className="w-4 h-4"/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SYSTEM ROLE DIALOG */}
      <Dialog open={isRoleOpen} onOpenChange={(open) => { setIsRoleOpen(open); if(!open) setEditingRole(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Section Access' : 'New System Role'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Role Name</Label>
              <Input 
                value={roleData.name} 
                onChange={(e) => setRoleData({...roleData, name: e.target.value})} 
                placeholder="e.g. HR Manager"
              />
            </div>
            <div className="grid gap-3">
              <Label>Grant Section Access</Label>
              <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-muted/20 max-h-[250px] overflow-y-auto">
                {SECTION_ACCESS_LIST.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={perm.id} 
                      checked={roleData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <label htmlFor={perm.id} className="text-sm font-medium cursor-pointer">
                      {perm.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRole} disabled={loading}>
              {loading ? "Saving..." : "Save Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DESIGNATION DIALOG */}
      <Dialog open={isDesignationOpen} onOpenChange={(open) => { setIsDesignationOpen(open); if(!open) setEditingDesignation(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDesignation ? 'Edit' : 'Add'} Designation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Designation Name</Label>
              <Input 
                value={designationData.name} 
                onChange={(e) => setDesignationData({...designationData, name: e.target.value})} 
                placeholder="e.g. Senior Math Teacher" 
              />
            </div>
            <div className="space-y-2">
              <Label>Description / Department</Label>
              <Input 
                value={designationData.description} 
                onChange={(e) => setDesignationData({...designationData, description: e.target.value})} 
                placeholder="e.g. Science Faculty" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDesignationOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDesignation} disabled={loading}>Save Designation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
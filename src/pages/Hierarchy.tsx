/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { userService } from '../services/firebase/userService';
import { User, UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Network, 
  Search, 
  Users, 
  ChevronRight, 
  ChevronDown, 
  Briefcase, 
  Mail, 
  Layers, 
  FolderTree,
  Building,
  UserCheck,
  Info
} from 'lucide-react';

interface TreeNode extends User {
  children: TreeNode[];
}

export function Hierarchy() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = userService.subscribeToUsers((data) => {
      setUsers(data);
      setLoading(false);
      
      // Auto-select the top person or first person as default if none selected
      if (data.length > 0 && !selectedUser) {
        const topUser = data.find(u => !u.managerId) || data[0];
        setSelectedUser(topUser);
      }
    });
    return () => unsub();
  }, [selectedUser]);

  // Build Hierarchy Tree
  const buildTree = (userList: User[]): TreeNode[] => {
    const nodeMapByUid: Record<string, TreeNode> = {};
    const nodeMapByEmpId: Record<string, TreeNode> = {};
    
    userList.forEach(user => {
      const node: TreeNode = { ...user, children: [] };
      if (user.uid) nodeMapByUid[user.uid] = node;
      if (user.employeeId) nodeMapByEmpId[user.employeeId] = node;
    });

    const roots: TreeNode[] = [];
    const placedUids = new Set<string>();

    userList.forEach(user => {
      const node = nodeMapByUid[user.uid];
      if (!node) return;

      const managerId = user.managerId;
      const parentNode = managerId ? (nodeMapByUid[managerId] || nodeMapByEmpId[managerId]) : null;

      if (parentNode && parentNode.uid !== user.uid) {
        parentNode.children.push(node);
        placedUids.add(user.uid);
      }
    });

    userList.forEach(user => {
      if (!placedUids.has(user.uid)) {
        const node = nodeMapByUid[user.uid];
        if (node) roots.push(node);
      }
    });

    return roots;
  };

  const toggleNode = (uid: string, e:   React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes(prev => ({ ...prev, [uid]: !prev[uid] }));
  };

  const getRoleBadgeVariant = (role: string) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('admin')) return 'destructive';
    if (r.includes('manager')) return 'default';
    if (r.includes('hr')) return 'secondary';
    return 'outline';
  };

  const formatRole = (role: string) => {
    if (!role) return 'Staff';
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const treeData = buildTree(users);

  // Helper to check if a node or any of its children matches search query
  const matchSearch = (node: TreeNode): boolean => {
    const nameMatch = (node.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const designationMatch = (node.designation || '').toLowerCase().includes(searchQuery.toLowerCase());
    const empIdMatch = (node.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = roleFilter === 'all' || (node.role || '').toLowerCase() === roleFilter.toLowerCase();

    const matchesCurrent = (nameMatch || designationMatch || empIdMatch) && roleMatch;
    if (matchesCurrent) return true;
    return node.children.some(child => matchSearch(child));
  };

  // Metrics summary
  const totalStaff = users.length;
  const totalManagers = users.filter(u => ['manager', 'Manager', 'admin', 'Admin', 'super_admin', 'Super Admin', 'Principal'].includes(u.role)).length;

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: TreeNode, depth = 0) => {
    const isCollapsed = collapsedNodes[node.uid];
    const hasChildren = node.children.length > 0;
    const isSelected = selectedUser?.uid === node.uid;
    
    if (searchQuery && !matchSearch(node)) return null;

    const isMatchingQuery = searchQuery && (
      (node.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div key={node.uid} className="flex flex-col mt-2">
        <div 
          onClick={() => setSelectedUser(node)}
          className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none relative
            ${isSelected 
              ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/20' 
              : isMatchingQuery 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-900 dark:text-amber-200'
                : 'bg-card border-border/60 hover:border-border hover:bg-accent/40'
            }
          `}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {depth > 0 && (
            <div 
              className="absolute top-1/2 -left-4 w-4 h-[1px] bg-border/80"
              style={{ left: `-16px`, width: `16px` }}
            />
          )}

          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={node.avatar} alt={node.name} />
                <AvatarFallback className="text-xs bg-muted font-medium">
                  {node.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${node.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {node.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  ({node.employeeId || 'N/A'})
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Briefcase className="h-3 w-3 inline opacity-70" />
                <span>{node.designation || 'Staff Member'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Badge variant={getRoleBadgeVariant(node.role)} className="text-[10px] px-2 py-0.5 capitalize">
              {formatRole(node.role)}
            </Badge>

            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg hover:bg-muted"
                onClick={(e) => toggleNode(node.uid, e)}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            {!hasChildren && <div className="w-7 h-7" />}
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="relative pl-2 border-l border-border/40 ml-[18px] mt-1 transition-all">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getManagerName = (managerId: string) => {
    if (!managerId) return 'None (Top Level Management)';
    const mgr = users.find(u => u.uid === managerId || u.employeeId === managerId);
    return mgr ? `${mgr.name} (${mgr.designation})` : 'Unknown Manager';
  };

  const getDirectReports = (userId: string, empId: string) => {
    return users.filter(u => u.managerId === userId || (empId && u.managerId === empId));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Organization Hierarchy
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, search, and navigate through the organizational breakdown and reporting structure.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-card border border-border/50 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-xs">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Total Staff</p>
              <p className="text-lg font-semibold tracking-tight">{totalStaff}</p>
            </div>
          </div>

          <div className="bg-card border border-border/50 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-xs">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <FolderTree className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Leaders / Managers</p>
              <p className="text-lg font-semibold tracking-tight">{totalManagers}</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-border/50 shadow-xs bg-card/60 backdrop-blur-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search staff by name, designation, or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full rounded-lg bg-background"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <span className="text-xs text-muted-foreground font-medium hidden md:inline">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 text-sm px-3 py-1.5 rounded-lg border border-input bg-background font-medium shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring w-full sm:w-44"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-[450px] border border-border/40 rounded-xl bg-card flex flex-col items-center justify-center text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground text-sm mt-3 font-medium">Loading reporting channels...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="h-[400px] border border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center text-center p-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Network className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold">No organizational data found</h3>
          <p className="text-muted-foreground max-w-xs mt-1 text-sm">
            Add staff members and set up their reporting managers in the Staff section to visualize the hierarchy tree.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="tree" className="w-full">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <TabsList className="bg-muted/60 p-1 rounded-lg">
                  <TabsTrigger value="tree" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md">
                    <FolderTree className="h-3.5 w-3.5" />
                    Interactive Tree
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md">
                    <Layers className="h-3.5 w-3.5" />
                    Managers Index
                  </TabsTrigger>
                </TabsList>
                <span className="text-xs text-muted-foreground font-mono">
                  Showing {users.filter(u => roleFilter === 'all' || u.role?.toLowerCase() === roleFilter.toLowerCase()).length} records
                </span>
              </div>

              <TabsContent value="tree" className="mt-4 focus-visible:outline-hidden">
                <Card className="border-border/50 shadow-xs bg-card overflow-hidden">
                  <CardHeader className="bg-muted/20 border-b border-border/40 py-3 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Network className="h-4 w-4 text-primary" />
                      Organizational Reporting Nodes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 max-h-[600px] overflow-y-auto">
                    <div className="space-y-1">
                      {treeData.map(rootNode => renderTreeNode(rootNode))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list" className="mt-4 focus-visible:outline-hidden">
                <Card className="border-border/50 shadow-xs bg-card">
                  <CardHeader className="bg-muted/20 border-b border-border/40 py-3 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" />
                      Leadership Teams Index
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ScrollArea className="h-[520px] pr-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {users
                          .filter(u => ['manager', 'Manager', 'admin', 'Admin', 'super_admin', 'Super Admin', 'Principal'].includes(u.role))
                          .map(mgr => {
                            const reports = getDirectReports(mgr.uid, mgr.employeeId);
                            return (
                              <div 
                                key={mgr.uid}
                                onClick={() => setSelectedUser(mgr)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-36
                                  ${selectedUser?.uid === mgr.uid 
                                    ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/15' 
                                    : 'bg-card border-border/60 hover:bg-accent/40'
                                  }
                                `}
                              >
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={mgr.avatar} />
                                    <AvatarFallback>{mgr.name?.[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-semibold text-sm line-clamp-1">{mgr.name}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{mgr.designation}</p>
                                    <Badge variant="outline" className="text-[9px] mt-1.5 capitalize py-0">
                                      {formatRole(mgr.role)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="border-t border-border/50 pt-2 flex items-center justify-between text-xs text-muted-foreground mt-2">
                                  <span className="flex items-center gap-1 font-medium">
                                    <UserCheck className="h-3 w-3 text-emerald-500" />
                                    {reports.length} Direct Reports
                                  </span>
                                  <span className="text-[10px] font-mono">{mgr.employeeId}</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            {selectedUser ? (
              <Card className="sticky top-6 border-primary/20 shadow-md bg-card overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/40" />
                <CardContent className="p-5 pt-0 relative">
                  <div className="flex justify-center -mt-10 mb-4">
                    <Avatar className="h-20 w-20 ring-4 ring-background shadow-md border">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback className="text-xl font-bold bg-muted">
                        {selectedUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold tracking-tight text-foreground">{selectedUser.name}</h3>
                    <p className="text-sm font-medium text-primary">{selectedUser.designation || 'Staff Member'}</p>
                    <div className="flex justify-center gap-1.5 pt-1.5">
                      <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="text-xs px-2.5 py-0.5 uppercase tracking-wide font-semibold text-[10px]">
                        {formatRole(selectedUser.role)}
                      </Badge>
                      <Badge variant={selectedUser.status?.toLowerCase() === 'active' ? 'default' : 'secondary'} className="text-xs px-2.5 py-0.5 text-[10px]">
                        {selectedUser.status || 'Active'}
                      </Badge>
                    </div>
                  </div>

                  <div className="my-4 border-t border-border/60" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      <Info className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Employee ID</p>
                        <p className="font-mono text-xs font-semibold text-foreground truncate mt-0.5">{selectedUser.employeeId || 'Not Configured'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Email Address</p>
                        <p className="text-xs text-foreground font-medium truncate mt-0.5">{selectedUser.email || 'No email associated'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      <Layers className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Reports To</p>
                        <p className="text-xs text-foreground font-semibold truncate mt-0.5">{getManagerName(selectedUser.managerId)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="my-4 border-t border-border/60" />

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                      <span>Direct Reports Line</span>
                      <Badge variant="outline" className="font-mono text-[10px] bg-muted/50 font-semibold px-2 py-0">
                        {getDirectReports(selectedUser.uid, selectedUser.employeeId).length}
                      </Badge>
                    </h4>

                    <ScrollArea className="h-[180px] rounded-lg border border-border/50 bg-muted/10 p-2">
                      {getDirectReports(selectedUser.uid, selectedUser.employeeId).length === 0 ? (
                        <div className="h-[150px] flex flex-col items-center justify-center text-center p-4">
                          <p className="text-xs text-muted-foreground italic font-medium">No direct reports reporting to this member.</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {getDirectReports(selectedUser.uid, selectedUser.employeeId).map(report => (
                            <div 
                              key={report.uid}
                              onClick={() => setSelectedUser(report)}
                              className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Avatar className="h-7 w-7 border shrink-0">
                                  <AvatarImage src={report.avatar} />
                                  <AvatarFallback className="text-[10px]">{report.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{report.name}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{report.designation}</p>
                                </div>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-border p-6 text-center text-muted-foreground h-[400px] flex flex-col items-center justify-center">
                <Network className="h-8 w-8 text-muted-foreground/60 mb-2 animate-pulse" />
                <p className="text-sm font-medium">Select any employee card to explore their team insights, position details, and reporting chains.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
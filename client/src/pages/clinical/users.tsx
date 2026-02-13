import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, isSuperAdmin, getAdminUser } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Users, Shield, UserCheck, Building2, Key, ChevronDown, ChevronUp, UserX, UserCheck2 } from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Practice {
  id: number;
  name: string;
  status?: string;
  departments?: string;
}

interface PracticeAssignment {
  practiceId: number;
  department: string | null;
}

interface PracticeEntry {
  practiceId: number;
  department: string | null;
  displayName: string;
}

const LYNK_PRACTICE_NAME = "Lynk Healthcare";

const ROLES = [
  { value: "super_admin", label: "Super Admin", color: "bg-red-100 text-red-800", description: "Full access to everything" },
  { value: "admin", label: "Admin", color: "bg-purple-100 text-purple-800", description: "Full access except financials" },
  { value: "care_coordinator", label: "Care Coordinator", color: "bg-blue-100 text-blue-800", description: "Clinical care with custom permissions" },
  { value: "enrollment_specialist", label: "Enrollment Specialist", color: "bg-green-100 text-green-800", description: "Patient enrollment with custom permissions" },
  { value: "billing_specialist", label: "Billing Specialist", color: "bg-amber-100 text-amber-800", description: "Billing & invoices with custom permissions" },
  { value: "practice_admin", label: "Practice Admin", color: "bg-slate-100 text-slate-800", description: "Single practice access only" },
];

const PERMISSION_GROUPS: Record<string, { label: string; permissions: string[] }> = {
  clinical: {
    label: "Clinical",
    permissions: ["VIEW_PATIENTS", "MANAGE_PATIENTS", "VIEW_CLINICAL", "MANAGE_CLINICAL"],
  },
  scheduling: {
    label: "Scheduling & Tasks",
    permissions: ["VIEW_SCHEDULE", "MANAGE_SCHEDULE", "VIEW_TASKS", "MANAGE_TASKS"],
  },
  enrollment: {
    label: "Enrollment",
    permissions: ["VIEW_ENROLLMENT", "MANAGE_ENROLLMENT"],
  },
  billing: {
    label: "Billing & Finance",
    permissions: ["VIEW_BILLING", "MANAGE_BILLING", "VIEW_INVOICES", "MANAGE_INVOICES", "VIEW_ERA_EOB", "MANAGE_ERA_EOB", "VIEW_REVENUE"],
  },
  data: {
    label: "Data & Sync",
    permissions: ["VIEW_INQUIRIES", "VIEW_REFERRALS", "VIEW_TC_SAMPLES", "TRIGGER_SYNC", "VIEW_SNAPSHOTS"],
  },
  admin: {
    label: "Administration",
    permissions: ["VIEW_DASHBOARD", "VIEW_PRACTICES", "MANAGE_PRACTICES", "VIEW_AUDIT_LOGS", "MANAGE_USERS", "VIEW_TEMPLATES", "MANAGE_TEMPLATES", "VIEW_FORMS", "MANAGE_FORMS"],
  },
  access: {
    label: "Practice Access",
    permissions: ["DROP_IN_ASSIGNED_PRACTICES"],
  },
};

function formatPermission(p: string): string {
  return p.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export default function UserManagement() {
  const { toast } = useToast();
  const currentUser = getAdminUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [permUser, setPermUser] = useState<AdminUser | null>(null);
  const [practiceUser, setPracticeUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "care_coordinator" });
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", password: "" });
  const [selectedAssignments, setSelectedAssignments] = useState<PracticeAssignment[]>([]);
  const [permOverrides, setPermOverrides] = useState<Record<string, boolean>>({});
  const [roleDefaults, setRoleDefaults] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => adminFetch("/api/admin/users").then(r => r.json()),
  });

  const { data: practicesData } = useQuery<{ success: boolean; practices: Practice[] }>({
    queryKey: ["/api/admin/practices"],
    queryFn: () => adminFetch("/api/admin/practices").then(r => r.json()),
  });

  const activePractices = (practicesData?.practices || []).filter(p => p.status !== "inactive");

  const practiceEntries: PracticeEntry[] = activePractices.flatMap(p => {
    if (p.name === LYNK_PRACTICE_NAME && p.departments) {
      try {
        const depts: string[] = JSON.parse(p.departments);
        return depts
          .filter(d => !d.startsWith("(NA)"))
          .map(d => ({
            practiceId: p.id,
            department: d,
            displayName: d.replace(/\s*\[.*?\]\s*$/, ""),
          }))
          .sort((a, b) => a.displayName.localeCompare(b.displayName));
      } catch {
        return [{ practiceId: p.id, department: null, displayName: p.name }];
      }
    }
    return [{ practiceId: p.id, department: null, displayName: p.name }];
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await adminFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User created successfully" });
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", role: "care_coordinator" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to create user", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await adminFetch(`/api/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated successfully" });
      setEditUser(null);
    },
    onError: (err: any) => {
      toast({ title: "Failed to update user", description: err.message, variant: "destructive" });
    },
  });

  const savePracticesMutation = useMutation({
    mutationFn: async ({ userId, assignments }: { userId: number; assignments: PracticeAssignment[] }) => {
      const res = await adminFetch(`/api/admin/users/${userId}/practice-assignments`, {
        method: "PUT",
        body: JSON.stringify({ assignments }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Practice assignments updated" });
      setPracticeUser(null);
    },
    onError: (err: any) => {
      toast({ title: "Failed to update assignments", description: err.message, variant: "destructive" });
    },
  });

  const savePermissionsMutation = useMutation({
    mutationFn: async ({ userId, permissions }: { userId: number; permissions: { permission: string; allowed: boolean }[] }) => {
      const res = await adminFetch(`/api/admin/users/${userId}/permissions`, {
        method: "PUT",
        body: JSON.stringify({ permissions }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Permissions updated" });
      setPermUser(null);
    },
    onError: (err: any) => {
      toast({ title: "Failed to update permissions", description: err.message, variant: "destructive" });
    },
  });

  const toggleUserStatus = (user: AdminUser) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const action = newStatus === "inactive" ? "deactivate" : "reactivate";
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;
    updateMutation.mutate({ id: user.id, data: { status: newStatus } });
  };

  const openPracticeAssignments = async (user: AdminUser) => {
    setPracticeUser(user);
    try {
      const res = await adminFetch(`/api/admin/users/${user.id}/practice-assignments`);
      const data = await res.json();
      setSelectedAssignments(
        (data.assignments || []).map((a: any) => ({
          practiceId: a.practiceId,
          department: a.department || null,
        }))
      );
    } catch {
      setSelectedAssignments([]);
    }
  };

  const openPermissions = async (user: AdminUser) => {
    setPermUser(user);
    try {
      const res = await adminFetch(`/api/admin/users/${user.id}/permissions`);
      const data = await res.json();
      setRoleDefaults(data.roleDefaults || []);
      const overrideMap: Record<string, boolean> = {};
      (data.overrides || []).forEach((o: any) => {
        overrideMap[o.permission] = o.allowed;
      });
      setPermOverrides(overrideMap);
    } catch {
      setRoleDefaults([]);
      setPermOverrides({});
    }
  };

  const isEntrySelected = (entry: PracticeEntry): boolean => {
    return selectedAssignments.some(
      a => a.practiceId === entry.practiceId && a.department === entry.department
    );
  };

  const toggleEntry = (entry: PracticeEntry) => {
    setSelectedAssignments(prev => {
      const exists = prev.some(
        a => a.practiceId === entry.practiceId && a.department === entry.department
      );
      if (exists) {
        return prev.filter(
          a => !(a.practiceId === entry.practiceId && a.department === entry.department)
        );
      }
      return [...prev, { practiceId: entry.practiceId, department: entry.department }];
    });
  };

  const isPermEnabled = (perm: string): boolean => {
    if (perm in permOverrides) return permOverrides[perm];
    return roleDefaults.includes(perm);
  };

  const togglePerm = (perm: string) => {
    const isDefault = roleDefaults.includes(perm);
    const currentlyEnabled = isPermEnabled(perm);

    if (isDefault && currentlyEnabled) {
      setPermOverrides(prev => ({ ...prev, [perm]: false }));
    } else if (isDefault && !currentlyEnabled) {
      const newOverrides = { ...permOverrides };
      delete newOverrides[perm];
      setPermOverrides(newOverrides);
    } else if (!isDefault && !currentlyEnabled) {
      setPermOverrides(prev => ({ ...prev, [perm]: true }));
    } else {
      const newOverrides = { ...permOverrides };
      delete newOverrides[perm];
      setPermOverrides(newOverrides);
    }
  };

  const savePermissions = () => {
    if (!permUser) return;
    const permList = Object.entries(permOverrides).map(([permission, allowed]) => ({
      permission,
      allowed,
    }));
    savePermissionsMutation.mutate({ userId: permUser.id, permissions: permList });
  };

  const getRoleBadge = (role: string) => {
    const r = ROLES.find(r => r.value === role);
    return <Badge className={r?.color || "bg-slate-100 text-slate-800"}>{r?.label || role}</Badge>;
  };

  const canEditRole = (targetRole: string) => {
    if (currentUser?.role === "super_admin") return true;
    if (targetRole === "super_admin") return false;
    return false;
  };

  const availableRoles = ROLES.filter(r => {
    if (currentUser?.role === "super_admin") return true;
    if (r.value === "super_admin") return false;
    return true;
  });

  const hasCustomPermissions = (role: string) => {
    return ["care_coordinator", "enrollment_specialist", "billing_specialist"].includes(role);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    const updates: any = {};
    if (editForm.name !== editUser.name) updates.name = editForm.name;
    if (editForm.email !== editUser.email) updates.email = editForm.email;
    if (editForm.role !== editUser.role) updates.role = editForm.role;
    if (editForm.password) updates.password = editForm.password;
    updateMutation.mutate({ id: editUser.id, data: updates });
  };

  const openEdit = (user: AdminUser) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, password: "" });
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const roleCounts = ROLES.map(r => ({
    ...r,
    count: users.filter(u => u.role === r.value).length,
  })).filter(r => r.count > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage users, practice assignments, and permissions</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(r => (
                      <SelectItem key={r.value} value={r.value}>
                        <div>
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-slate-400 ml-2">{r.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {roleCounts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {roleCounts.map(r => (
            <Card key={r.value} className="border-l-4" style={{ borderLeftColor: r.color.includes("red") ? "#ef4444" : r.color.includes("purple") ? "#a855f7" : r.color.includes("blue") ? "#3b82f6" : r.color.includes("green") ? "#22c55e" : r.color.includes("amber") ? "#f59e0b" : "#64748b" }}>
              <CardContent className="pt-3 pb-2">
                <p className="text-xs text-slate-500">{r.label}s</p>
                <p className="text-xl font-bold">{r.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No users found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id} className={user.status === "inactive" ? "opacity-60" : ""}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {user.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Practice Assignments" onClick={() => openPracticeAssignments(user)}>
                          <Building2 className="w-4 h-4" />
                        </Button>
                        {hasCustomPermissions(user.role) && (
                          <Button variant="ghost" size="sm" title="Permissions" onClick={() => openPermissions(user)}>
                            <Key className="w-4 h-4" />
                          </Button>
                        )}
                        {user.id !== currentUser?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title={user.status === "active" ? "Deactivate User" : "Reactivate User"}
                            onClick={() => toggleUserStatus(user)}
                            className={user.status === "active" ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                          >
                            {user.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck2 className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editUser} onOpenChange={open => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
            </div>
            <div>
              <Label>New Password (leave blank to keep current)</Label>
              <Input type="password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={editForm.role} onValueChange={v => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {availableRoles.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!practiceUser} onOpenChange={open => !open && setPracticeUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Practice Assignments - {practiceUser?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {practiceEntries.length === 0 ? (
              <p className="text-sm text-slate-500">No practices available.</p>
            ) : (
              practiceEntries.map((entry, idx) => (
                <div key={`${entry.practiceId}-${entry.department || idx}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <Checkbox
                    checked={isEntrySelected(entry)}
                    onCheckedChange={() => toggleEntry(entry)}
                  />
                  <span className="text-sm">{entry.displayName}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-slate-400">{selectedAssignments.length} practice(s) selected</p>
            <Button
              onClick={() => practiceUser && savePracticesMutation.mutate({ userId: practiceUser.id, assignments: selectedAssignments })}
              disabled={savePracticesMutation.isPending}
            >
              {savePracticesMutation.isPending ? "Saving..." : "Save Assignments"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!permUser} onOpenChange={open => !open && setPermUser(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Permissions - {permUser?.name}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-500 -mt-2">
            Toggle individual permissions on/off. Checkmarks with a blue background are role defaults.
          </p>
          <div className="space-y-2">
            {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
              <div key={groupKey} className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => toggleGroup(groupKey)}
                >
                  {group.label}
                  {expandedGroups[groupKey] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedGroups[groupKey] && (
                  <div className="px-3 pb-2 space-y-1">
                    {group.permissions.map(perm => {
                      const enabled = isPermEnabled(perm);
                      const isDefault = roleDefaults.includes(perm);
                      const isOverridden = perm in permOverrides;
                      return (
                        <div key={perm} className={`flex items-center gap-3 p-1.5 rounded text-sm ${isOverridden ? "bg-amber-50" : ""}`}>
                          <Checkbox checked={enabled} onCheckedChange={() => togglePerm(perm)} />
                          <span className={enabled ? "text-slate-700" : "text-slate-400"}>
                            {formatPermission(perm)}
                          </span>
                          {isDefault && !isOverridden && (
                            <Badge variant="outline" className="text-[10px] ml-auto bg-blue-50 text-blue-600 border-blue-200">default</Badge>
                          )}
                          {isOverridden && (
                            <Badge variant="outline" className="text-[10px] ml-auto bg-amber-50 text-amber-600 border-amber-200">custom</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={savePermissions} disabled={savePermissionsMutation.isPending}>
              {savePermissionsMutation.isPending ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminFetch } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Users, Shield, UserCheck } from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const ROLES = [
  { value: "admin", label: "Admin", color: "bg-purple-100 text-purple-800" },
  { value: "supervisor", label: "Supervisor", color: "bg-blue-100 text-blue-800" },
  { value: "care_manager", label: "Care Manager", color: "bg-green-100 text-green-800" },
  { value: "provider", label: "Provider", color: "bg-teal-100 text-teal-800" },
];

export default function UserManagement() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "care_manager" });
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", password: "" });

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/users");
      return res.json();
    },
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
      setForm({ name: "", email: "", password: "", role: "care_manager" });
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

  const getRoleBadge = (role: string) => {
    const r = ROLES.find((r) => r.value === role);
    return <Badge className={r?.color || ""}>{r?.label || role}</Badge>;
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

  const roleCounts = ROLES.map((r) => ({
    ...r,
    count: users.filter((u) => u.role === r.value).length,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage care coordinators, supervisors, and admins</p>
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
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
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

      <div className="grid grid-cols-4 gap-4 mb-6">
        {roleCounts.map((r) => (
          <Card key={r.value}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{r.label}s</p>
                  <p className="text-2xl font-bold">{r.count}</p>
                </div>
                {r.value === "admin" ? <Shield className="w-8 h-8 text-purple-300" /> : r.value === "supervisor" ? <UserCheck className="w-8 h-8 text-blue-300" /> : <Users className="w-8 h-8 text-green-300" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No users found. Create the first user above.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
            </div>
            <div>
              <Label>New Password (leave blank to keep current)</Label>
              <Input type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

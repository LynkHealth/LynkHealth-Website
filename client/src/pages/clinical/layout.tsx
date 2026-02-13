import { Link, useLocation } from "wouter";
import { Users, ClipboardList, LayoutDashboard, LogOut, Home, CheckSquare, Calendar, FileText, FormInput, Building2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminUser, hasPermission, clearAdminAuth, adminFetch, updateAdminUser } from "@/lib/admin-auth";
import TimeTracker from "@/components/clinical/time-tracker";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface Practice {
  id: number;
  name: string;
  active?: boolean;
  status?: string;
}

const navItems = [
  { label: "Dashboard", path: "/clinical/dashboard", icon: Home },
  { label: "Patients", path: "/clinical/patients", icon: Users, permission: "VIEW_PATIENTS" },
  { label: "Worklists", path: "/clinical/worklists", icon: ClipboardList, permission: "VIEW_CLINICAL" },
  { label: "Tasks", path: "/clinical/tasks", icon: CheckSquare, permission: "VIEW_TASKS" },
  { label: "Schedule", path: "/clinical/schedule", icon: Calendar, permission: "VIEW_SCHEDULE" },
  { label: "Templates", path: "/clinical/templates", icon: FileText, permission: "VIEW_TEMPLATES" },
  { label: "Forms", path: "/clinical/forms", icon: FormInput, permission: "VIEW_FORMS" },
  { label: "ERA/EOB", path: "/clinical/era-eob", icon: FileSpreadsheet, permission: "VIEW_ERA_EOB" },
  { label: "Admin", path: "/admin", icon: LayoutDashboard, permission: "VIEW_DASHBOARD" },
];

export default function ClinicalLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const user = getAdminUser();
  const userRole = user?.role || "practice_admin";
  const canSwitchPractice = userRole === "super_admin" || userRole === "admin" ||
    hasPermission("DROP_IN_ASSIGNED_PRACTICES") || hasPermission("DROP_IN_ANY_PRACTICE");
  const [activePracticeId, setActivePracticeId] = useState<string>(user?.activePracticeId?.toString() || "all");

  const { data: practicesData } = useQuery<{ success: boolean; practices: Practice[] }>({
    queryKey: ["/api/admin/practices"],
    queryFn: () => adminFetch("/api/admin/practices").then(r => r.json()),
    enabled: canSwitchPractice,
  });

  const practices = practicesData?.practices || [];
  const activePractices = practices.filter(p => p.status !== "inactive");

  const availablePractices = (userRole === "super_admin" || userRole === "admin")
    ? activePractices
    : activePractices.filter(p => user?.assignedPracticeIds?.includes(p.id));

  const filteredNav = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const handlePracticeSwitch = async (value: string) => {
    setActivePracticeId(value);
    const practiceId = value === "all" ? null : parseInt(value);
    try {
      await adminFetch("/api/admin/switch-practice", {
        method: "POST",
        body: JSON.stringify({ practiceId }),
      });
      updateAdminUser({ activePracticeId: practiceId });
    } catch (error) {
      console.error("Failed to switch practice:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: "Super Admin",
      admin: "Admin",
      care_coordinator: "Care Coordinator",
      enrollment_specialist: "Enrollment Specialist",
      billing_specialist: "Billing Specialist",
      practice_admin: "Practice Admin",
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-4 border-b border-slate-200">
          <Link href="/clinical/dashboard">
            <span className="text-lg font-bold text-blue-700 cursor-pointer">Lynk Health</span>
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">Care Coordination</p>
        </div>

        {canSwitchPractice && availablePractices.length > 0 && (
          <div className="px-3 py-2 border-b border-slate-200">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Practice</label>
            <Select value={activePracticeId} onValueChange={handlePracticeSwitch}>
              <SelectTrigger className="h-8 text-xs mt-1">
                <Building2 className="w-3 h-3 mr-1 shrink-0" />
                <SelectValue placeholder="Select practice" />
              </SelectTrigger>
              <SelectContent>
                {(userRole === "super_admin" || userRole === "admin") && (
                  <SelectItem value="all">All Practices</SelectItem>
                )}
                {availablePractices.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <nav className="flex-1 py-3 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = item.path === "/clinical/dashboard"
              ? location === "/clinical/dashboard" || location === "/clinical"
              : location.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="px-4 py-2 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-700 truncate">{user.name}</p>
            <p className="text-xs text-slate-400">{getRoleLabel(user.role)}</p>
          </div>
        )}
        <div className="p-3 border-t border-slate-200">
          <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500 hover:text-red-600" onClick={() => { clearAdminAuth(); window.location.href = "/admin/login"; }}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 ml-56 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
      <TimeTracker />
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { Users, ClipboardList, LayoutDashboard, LogOut, UserCog, Home, CheckSquare, Calendar, FileText, FormInput, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminUser } from "@/lib/admin-auth";
import { clearAdminAuth } from "@/lib/admin-auth";
import TimeTracker from "@/components/clinical/time-tracker";
import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", path: "/clinical/dashboard", icon: Home },
  { label: "Patients", path: "/clinical/patients", icon: Users },
  { label: "Worklists", path: "/clinical/worklists", icon: ClipboardList },
  { label: "Tasks", path: "/clinical/tasks", icon: CheckSquare },
  { label: "Schedule", path: "/clinical/schedule", icon: Calendar },
  { label: "Templates", path: "/clinical/templates", icon: FileText },
  { label: "Forms", path: "/clinical/forms", icon: FormInput },
  { label: "Scan Form", path: "/clinical/scan-form", icon: ScanLine },
  { label: "Users", path: "/clinical/users", icon: UserCog, roles: ["admin", "supervisor"] },
  { label: "Admin", path: "/admin", icon: LayoutDashboard, roles: ["admin"] },
];

export default function ClinicalLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const user = getAdminUser();
  const userRole = user?.role || "care_manager";

  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(userRole));

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-4 border-b border-slate-200">
          <Link href="/clinical/dashboard">
            <span className="text-lg font-bold text-blue-700 cursor-pointer">Lynk Health</span>
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">Care Coordination</p>
        </div>
        <nav className="flex-1 py-3">
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
            <p className="text-xs text-slate-400 capitalize">{user.role?.replace("_", " ")}</p>
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

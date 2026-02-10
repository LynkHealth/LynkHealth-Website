import { Link, useLocation } from "wouter";
import { Users, ClipboardList, LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

const navItems = [
  { label: "Patients", path: "/clinical/patients", icon: Users },
  { label: "Worklists", path: "/clinical/worklists", icon: ClipboardList },
  { label: "Users", path: "/clinical/users", icon: UserCog },
  { label: "Admin", path: "/admin", icon: LayoutDashboard },
];

export default function ClinicalLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-4 border-b border-slate-200">
          <Link href="/clinical/patients">
            <span className="text-lg font-bold text-blue-700 cursor-pointer">Lynk Health</span>
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">Care Coordination</p>
        </div>
        <nav className="flex-1 py-3">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.path);
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
        <div className="p-3 border-t border-slate-200">
          <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500 hover:text-red-600" onClick={() => { document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; window.location.href = "/admin/login"; }}>
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
    </div>
  );
}

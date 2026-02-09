import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFetch, getAdminUser, clearAdminAuth } from "@/lib/admin-auth";
import {
  LayoutDashboard,
  Heart,
  Brain,
  Monitor,
  ClipboardCheck,
  FileText,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Menu,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Activity,
  Stethoscope,
  Shield,
  Zap,
} from "lucide-react";
import type { ProgramSnapshot, Practice, ContactInquiry, RevenueSnapshot } from "@shared/schema";
import { DollarSign, TrendingUp } from "lucide-react";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES: Record<string, string> = {
  JAN: "January", FEB: "February", MAR: "March", APR: "April",
  MAY: "May", JUN: "June", JUL: "July", AUG: "August",
  SEP: "September", OCT: "October", NOV: "November", DEC: "December",
};

function ProgramCard({ title, icon: Icon, programType, snapshots, color }: {
  title: string;
  icon: any;
  programType: string;
  snapshots: ProgramSnapshot[];
  color: string;
}) {
  const data = snapshots.filter((s) => s.programType === programType);
  const totals = data.reduce(
    (acc, s) => {
      acc.patientsEnrolled += s.patientsEnrolled || 0;
      acc.notEnrolled += s.notEnrolled || 0;
      acc.inactive += s.inactive || 0;
      acc.mins0 += s.mins0 || 0;
      acc.mins60Plus += s.mins60Plus || 0;
      acc.mins40to59 += s.mins40to59 || 0;
      acc.mins30to59 += s.mins30to59 || 0;
      acc.mins20to39 += s.mins20to39 || 0;
      acc.mins20Plus += s.mins20Plus || 0;
      acc.mins15to19 += s.mins15to19 || 0;
      acc.mins10to19 += s.mins10to19 || 0;
      acc.mins10to14 += s.mins10to14 || 0;
      acc.mins5to9 += s.mins5to9 || 0;
      acc.mins1to9 += s.mins1to9 || 0;
      acc.mins1to4 += s.mins1to4 || 0;
      acc.mins1to29 += s.mins1to29 || 0;
      acc.patientsWithDevices += s.patientsWithDevices || 0;
      acc.patientsTakingReadings += s.patientsTakingReadings || 0;
      acc.qualifiedSuppliedDevice += s.qualifiedSuppliedDevice || 0;
      acc.dueForVisit += s.dueForVisit || 0;
      acc.inProgress += s.inProgress || 0;
      acc.hraSent += s.hraSent || 0;
      acc.hraReceived += s.hraReceived || 0;
      acc.readyToFinalize += s.readyToFinalize || 0;
      acc.unknownDates += s.unknownDates || 0;
      acc.mins40Plus += s.mins40Plus || 0;
      return acc;
    },
    {
      patientsEnrolled: 0, notEnrolled: 0, inactive: 0, mins0: 0,
      mins60Plus: 0, mins40to59: 0, mins30to59: 0, mins20to39: 0, mins20Plus: 0,
      mins15to19: 0, mins10to19: 0, mins10to14: 0, mins5to9: 0,
      mins1to9: 0, mins1to4: 0, mins1to29: 0,
      patientsWithDevices: 0, patientsTakingReadings: 0, qualifiedSuppliedDevice: 0,
      dueForVisit: 0, inProgress: 0, hraSent: 0, hraReceived: 0,
      readyToFinalize: 0, unknownDates: 0, mins40Plus: 0,
    }
  );

  const getColumns = () => {
    switch (programType) {
      case "CCM":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "60+ Mins", value: totals.mins60Plus, color: "text-green-600" },
          { label: "40-59 Mins", value: totals.mins40to59, color: "text-green-600" },
          { label: "20-39 Mins", value: totals.mins20to39, color: "text-yellow-600" },
          { label: "10-19 Mins", value: totals.mins10to19, color: "text-orange-500" },
          { label: "1-9 Mins", value: totals.mins1to9, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
          { label: "Not Enrolled", value: totals.notEnrolled },
        ];
      case "PCM":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "60+ Mins", value: totals.mins60Plus, color: "text-green-600" },
          { label: "30-59 Mins", value: totals.mins30to59, color: "text-yellow-600" },
          { label: "1-29 Mins", value: totals.mins1to29, color: "text-orange-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
          { label: "Not Enrolled", value: totals.notEnrolled },
        ];
      case "AWV":
        return [
          { label: "Due for Visit", value: totals.dueForVisit, highlight: true },
          { label: "In Progress", value: totals.inProgress, color: "text-yellow-600" },
          { label: "HRA Sent", value: totals.hraSent, color: "text-blue-600" },
          { label: "HRA Received", value: totals.hraReceived, color: "text-green-600" },
          { label: "Ready To Finalize", value: totals.readyToFinalize, color: "text-green-600" },
          { label: "Unknown Dates", value: totals.unknownDates },
        ];
      case "BHI":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "20+ Mins", value: totals.mins20Plus, color: "text-green-600" },
          { label: "15-19 Mins", value: totals.mins15to19, color: "text-green-600" },
          { label: "10-14 Mins", value: totals.mins10to14, color: "text-yellow-600" },
          { label: "5-9 Mins", value: totals.mins5to9, color: "text-orange-500" },
          { label: "1-4 Mins", value: totals.mins1to4, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
          { label: "Not Enrolled", value: totals.notEnrolled },
        ];
      case "RPM":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "With Devices", value: totals.patientsWithDevices },
          { label: "Taking Readings", value: totals.patientsTakingReadings },
          { label: "Qualified Device", value: totals.qualifiedSuppliedDevice },
          { label: "40+ Mins", value: totals.mins40Plus, color: "text-green-600" },
          { label: "20-39 Mins", value: totals.mins20to39, color: "text-yellow-600" },
          { label: "10-19 Mins", value: totals.mins10to19, color: "text-orange-500" },
          { label: "1-9 Mins", value: totals.mins1to9, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
          { label: "Not Enrolled", value: totals.notEnrolled },
        ];
      case "RTM":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "40+ Mins", value: totals.mins40Plus, color: "text-green-600" },
          { label: "20-39 Mins", value: totals.mins20to39, color: "text-yellow-600" },
          { label: "10-19 Mins", value: totals.mins10to19, color: "text-orange-500" },
          { label: "1-9 Mins", value: totals.mins1to9, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
        ];
      case "APCM":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "60+ Mins", value: totals.mins60Plus, color: "text-green-600" },
          { label: "40-59 Mins", value: totals.mins40to59, color: "text-green-600" },
          { label: "20-39 Mins", value: totals.mins20to39, color: "text-yellow-600" },
          { label: "10-19 Mins", value: totals.mins10to19, color: "text-orange-500" },
          { label: "1-9 Mins", value: totals.mins1to9, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
        ];
      case "CCCM":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "60+ Mins", value: totals.mins60Plus, color: "text-green-600" },
          { label: "40-59 Mins", value: totals.mins40to59, color: "text-green-600" },
          { label: "20-39 Mins", value: totals.mins20to39, color: "text-yellow-600" },
          { label: "10-19 Mins", value: totals.mins10to19, color: "text-orange-500" },
          { label: "1-9 Mins", value: totals.mins1to9, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
        ];
      case "CCO":
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "60+ Mins", value: totals.mins60Plus, color: "text-green-600" },
          { label: "40-59 Mins", value: totals.mins40to59, color: "text-green-600" },
          { label: "20-39 Mins", value: totals.mins20to39, color: "text-yellow-600" },
          { label: "1-9 Mins", value: totals.mins1to9, color: "text-red-500" },
          { label: "0 Mins", value: totals.mins0, color: "text-red-600" },
          { label: "Inactive", value: totals.inactive },
        ];
      default:
        return [
          { label: "Patients Enrolled", value: totals.patientsEnrolled, highlight: true },
          { label: "Inactive", value: totals.inactive },
        ];
    }
  };

  const columns = getColumns();

  const hasAnyData = data.length > 0 && (
    totals.patientsEnrolled > 0 || totals.inactive > 0 || totals.notEnrolled > 0 || totals.dueForVisit > 0
  );
  if (!hasAnyData) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((col) => (
                  <th key={col.label} className="px-3 py-2 text-xs font-medium text-slate-500 text-center whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {columns.map((col) => (
                  <td key={col.label} className={`px-3 py-3 text-center text-lg font-bold ${col.color || (col.highlight ? "text-blue-600" : "text-slate-700")}`}>
                    {col.value.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [snapshots, setSnapshots] = useState<ProgramSnapshot[]>([]);
  const [revenue, setRevenue] = useState<RevenueSnapshot[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [inquiries, setInquiries] = useState<{
    contactInquiries: ContactInquiry[];
    nightInquiries: any[];
    woundReferrals: any[];
  }>({ contactInquiries: [], nightInquiries: [], woundReferrals: [] });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    status: string;
    step: string;
    progress: number;
    details: string;
  } | null>(null);
  const [selectedPracticeId, setSelectedPracticeId] = useState<number | "all">("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">("all");
  const [departmentsByPractice, setDepartmentsByPractice] = useState<Record<number, string[]>>({});
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return MONTHS[now.getMonth()];
  });
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

  const user = getAdminUser();

  useEffect(() => {
    if (!user) {
      setLocation("/admin/login");
      return;
    }
    loadDashboard();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (!syncing) return;
    const interval = setInterval(async () => {
      try {
        const res = await adminFetch("/api/admin/tc/status");
        const data = await res.json();
        if (data.success) {
          setSyncStatus(data);
          if (data.status === "completed" || data.status === "error") {
            setSyncing(false);
            if (data.status === "completed") {
              loadDashboard();
            }
          }
        }
      } catch {}
    }, 2000);
    return () => clearInterval(interval);
  }, [syncing]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, inquiryRes] = await Promise.all([
        adminFetch(`/api/admin/dashboard?month=${currentMonth}&year=${currentYear}`),
        adminFetch("/api/admin/inquiries"),
      ]);
      const dashData = await dashRes.json();
      const inquiryData = await inquiryRes.json();
      if (dashData.success) {
        setSnapshots(dashData.snapshots);
        setPractices(dashData.practices);
        setDepartmentsByPractice(dashData.departmentsByPractice || {});
        setRevenue(dashData.revenue || []);
      }
      if (inquiryData.success) {
        setInquiries(inquiryData);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus({ status: "running", step: "Starting", progress: 0, details: "Initiating sync..." });
    try {
      await adminFetch("/api/admin/tc/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: currentMonth, year: currentYear }),
      });
    } catch (err) {
      setSyncing(false);
      setSyncStatus({ status: "error", step: "Error", progress: 0, details: "Failed to start sync" });
    }
  };

  const handleHistoricalSync = async () => {
    setSyncing(true);
    setSyncStatus({ status: "running", step: "Starting", progress: 0, details: "Initiating 24-month historical sync..." });
    try {
      await adminFetch("/api/admin/tc/sync-historical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months: 24 }),
      });
    } catch (err) {
      setSyncing(false);
      setSyncStatus({ status: "error", step: "Error", progress: 0, details: "Failed to start historical sync" });
    }
  };

  const handleRevenueSync = async () => {
    setSyncing(true);
    setSyncStatus({ status: "running", step: "Starting", progress: 0, details: "Initiating revenue sync..." });
    try {
      await adminFetch("/api/admin/tc/sync-revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: currentMonth, year: currentYear }),
      });
    } catch (err) {
      setSyncing(false);
      setSyncStatus({ status: "error", step: "Error", progress: 0, details: "Failed to start revenue sync" });
    }
  };

  const handleHistoricalRevenueSync = async () => {
    setSyncing(true);
    setSyncStatus({ status: "running", step: "Starting", progress: 0, details: "Initiating 24-month revenue sync..." });
    try {
      await adminFetch("/api/admin/tc/sync-revenue-historical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ months: 24 }),
      });
    } catch (err) {
      setSyncing(false);
      setSyncStatus({ status: "error", step: "Error", progress: 0, details: "Failed to start historical revenue sync" });
    }
  };

  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch {}
    clearAdminAuth();
    setLocation("/admin/login");
  };

  const navigateMonth = (direction: number) => {
    const idx = MONTHS.indexOf(currentMonth);
    let newIdx = idx + direction;
    let newYear = currentYear;
    if (newIdx < 0) { newIdx = 11; newYear--; }
    if (newIdx > 11) { newIdx = 0; newYear++; }
    setCurrentMonth(MONTHS[newIdx]);
    setCurrentYear(newYear);
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inquiries", label: "Inquiries", icon: Mail },
    { id: "practices", label: "Practices", icon: Building2 },
  ];

  const totalInquiries =
    inquiries.contactInquiries.length +
    inquiries.nightInquiries.length +
    inquiries.woundReferrals.length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-slate-800 text-white z-50 transition-all duration-300 flex flex-col
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${sidebarOpen ? "w-64" : "w-16"}`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <span className="font-bold text-lg">Lynk Admin</span>}
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700 hidden lg:flex"
                  onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700 lg:hidden"
                  onClick={() => setMobileSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white hover:bg-slate-700 justify-start gap-2"
                  onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-800">
              {activeTab === "dashboard" && "Clinic Dashboard"}
              {activeTab === "inquiries" && "Contact Inquiries"}
              {activeTab === "practices" && "Partner Practices"}
            </h1>
          </div>
          {activeTab === "dashboard" && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                className="gap-1.5 text-xs"
              >
                {syncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {syncing ? "Syncing..." : "Sync Month"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHistoricalSync}
                disabled={syncing}
                className="gap-1.5 text-xs"
              >
                {syncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Activity className="w-3.5 h-3.5" />
                )}
                Sync 24 Months
              </Button>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevenueSync}
                disabled={syncing}
                className="gap-1.5 text-xs text-green-700 border-green-200 hover:bg-green-50"
              >
                {syncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <DollarSign className="w-3.5 h-3.5" />
                )}
                Sync Revenue
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHistoricalRevenueSync}
                disabled={syncing}
                className="gap-1.5 text-xs text-green-700 border-green-200 hover:bg-green-50"
              >
                {syncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5" />
                )}
                Revenue 24 Mo
              </Button>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <select
                value={selectedPracticeId === "all" ? "all" : String(selectedPracticeId)}
                onChange={(e) => {
                  const val = e.target.value === "all" ? "all" as const : Number(e.target.value);
                  setSelectedPracticeId(val);
                  setSelectedDepartment("all");
                }}
                className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700"
              >
                <option value="all">All Practices</option>
                {practices.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {selectedPracticeId !== "all" && departmentsByPractice[selectedPracticeId] && departmentsByPractice[selectedPracticeId].length > 1 && (
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value === "all" ? "all" : e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700"
                >
                  <option value="all">All Locations</option>
                  {departmentsByPractice[selectedPracticeId].map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              )}
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </header>

        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-4">
                  {syncing && syncStatus && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">{syncStatus.step}</span>
                        </div>
                        <p className="text-xs text-blue-600 mb-2">{syncStatus.details}</p>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${syncStatus.progress}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {!syncing && syncStatus?.status === "completed" && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">{syncStatus.details}</span>
                        <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setSyncStatus(null)}>Dismiss</Button>
                      </CardContent>
                    </Card>
                  )}
                  {!syncing && syncStatus?.status === "error" && (
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-800">{syncStatus.details}</span>
                        <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setSyncStatus(null)}>Dismiss</Button>
                      </CardContent>
                    </Card>
                  )}
                  {(() => {
                    let filtered: ProgramSnapshot[];
                    if (selectedPracticeId === "all") {
                      filtered = snapshots.filter((s) => !s.department);
                    } else if (selectedDepartment === "all") {
                      filtered = snapshots.filter((s) => s.practiceId === selectedPracticeId && !s.department);
                    } else {
                      filtered = snapshots.filter((s) => s.practiceId === selectedPracticeId && s.department === selectedDepartment);
                    }
                    const selectedName = selectedPracticeId === "all"
                      ? "All Practices"
                      : practices.find((p) => p.id === selectedPracticeId)?.name || "";
                    return (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-blue-600">
                                {selectedPracticeId === "all" ? practices.length : selectedDepartment !== "all" ? selectedDepartment : selectedName}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {selectedPracticeId === "all" ? "Partner Practices" : selectedDepartment !== "all" ? "Location" : "Practice"}
                              </p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-green-600">
                                {filtered.filter((s) => s.programType === "CCM").reduce((sum, s) => sum + (s.patientsEnrolled || 0), 0)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">CCM Enrolled</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-purple-600">
                                {filtered.filter((s) => s.programType === "BHI").reduce((sum, s) => sum + (s.patientsEnrolled || 0), 0)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">BHI Enrolled</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-teal-600">
                                {filtered.filter((s) => s.programType === "RPM").reduce((sum, s) => sum + (s.patientsEnrolled || 0), 0)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">RPM Enrolled</p>
                            </CardContent>
                          </Card>
                        </div>

                        {(() => {
                          let filteredRevenue: RevenueSnapshot[];
                          if (selectedPracticeId === "all") {
                            filteredRevenue = revenue.filter((r) => !r.department);
                          } else if (selectedDepartment === "all") {
                            filteredRevenue = revenue.filter((r) => r.practiceId === selectedPracticeId && !r.department);
                          } else {
                            filteredRevenue = revenue.filter((r) => r.practiceId === selectedPracticeId && r.department === selectedDepartment);
                          }
                          const totalRev = filteredRevenue.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
                          const totalClaims = filteredRevenue.reduce((sum, r) => sum + (r.claimCount || 0), 0);

                          if (totalRev > 0 || totalClaims > 0) {
                            const aggregated = new Map<string, { programType: string; claimCount: number; totalRevenue: number }>();
                            filteredRevenue.forEach((r) => {
                              const key = r.programType || "Unknown";
                              const existing = aggregated.get(key);
                              if (existing) {
                                existing.claimCount += r.claimCount || 0;
                                existing.totalRevenue += r.totalRevenue || 0;
                              } else {
                                aggregated.set(key, { programType: key, claimCount: r.claimCount || 0, totalRevenue: r.totalRevenue || 0 });
                              }
                            });
                            const programRevenue = Array.from(aggregated.values())
                              .filter(r => r.totalRevenue > 0)
                              .sort((a, b) => b.totalRevenue - a.totalRevenue);

                            return (
                              <Card className="mb-4 border-green-200">
                                <CardHeader className="py-3 px-4 bg-green-50 rounded-t-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-5 h-5 text-green-600" />
                                      <CardTitle className="text-base font-semibold text-green-800">Monthly Revenue</CardTitle>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-green-700">
                                        ${(totalRev / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </p>
                                      <p className="text-xs text-green-600">{totalClaims.toLocaleString()} claims submitted</p>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b border-slate-200">
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-left">Program</th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Claims</th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Revenue</th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Avg/Claim</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {programRevenue.map((r) => (
                                          <tr key={r.programType} className="border-b border-slate-100">
                                            <td className="px-3 py-2 text-sm font-medium text-slate-700">{r.programType}</td>
                                            <td className="px-3 py-2 text-sm text-right text-slate-600">{r.claimCount.toLocaleString()}</td>
                                            <td className="px-3 py-2 text-sm text-right font-semibold text-green-700">
                                              ${(r.totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-right text-slate-500">
                                              ${(r.claimCount ? (r.totalRevenue / r.claimCount / 100) : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          }
                          return null;
                        })()}

                        <ProgramCard title="Chronic Care Management" icon={Heart} programType="CCM" snapshots={filtered} color="text-red-500" />
                        <ProgramCard title="Principal Care Management" icon={ClipboardCheck} programType="PCM" snapshots={filtered} color="text-blue-500" />
                        <ProgramCard title="Behavioral Health Integration" icon={Brain} programType="BHI" snapshots={filtered} color="text-purple-500" />
                        <ProgramCard title="Remote Patient Monitoring" icon={Monitor} programType="RPM" snapshots={filtered} color="text-teal-500" />
                        <ProgramCard title="Remote Therapeutic Monitoring" icon={Activity} programType="RTM" snapshots={filtered} color="text-orange-500" />
                        <ProgramCard title="Advanced Primary Care Mgmt" icon={Shield} programType="APCM" snapshots={filtered} color="text-indigo-500" />
                        <ProgramCard title="Complex Chronic Care Mgmt" icon={Stethoscope} programType="CCCM" snapshots={filtered} color="text-rose-500" />
                        <ProgramCard title="Chronic Care Optimization" icon={Zap} programType="CCO" snapshots={filtered} color="text-amber-500" />
                        <ProgramCard title="Annual Wellness Visit" icon={FileText} programType="AWV" snapshots={filtered} color="text-green-500" />
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === "inquiries" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Contact Form Submissions ({inquiries.contactInquiries.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {inquiries.contactInquiries.length === 0 ? (
                        <p className="text-sm text-slate-500">No contact inquiries yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-3 font-medium">Name</th>
                                <th className="text-left py-2 px-3 font-medium">Email</th>
                                <th className="text-left py-2 px-3 font-medium">Phone</th>
                                <th className="text-left py-2 px-3 font-medium">Type</th>
                                <th className="text-left py-2 px-3 font-medium">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inquiries.contactInquiries.map((inq: any) => (
                                <tr key={inq.id} className="border-b hover:bg-slate-50">
                                  <td className="py-2 px-3">{inq.firstName} {inq.lastName}</td>
                                  <td className="py-2 px-3">{inq.email}</td>
                                  <td className="py-2 px-3">{inq.phone || "—"}</td>
                                  <td className="py-2 px-3">{inq.organizationType}</td>
                                  <td className="py-2 px-3">{new Date(inq.createdAt).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Night Coverage Inquiries ({inquiries.nightInquiries.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {inquiries.nightInquiries.length === 0 ? (
                        <p className="text-sm text-slate-500">No night coverage inquiries yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-3 font-medium">Organization</th>
                                <th className="text-left py-2 px-3 font-medium">Contact</th>
                                <th className="text-left py-2 px-3 font-medium">Email</th>
                                <th className="text-left py-2 px-3 font-medium">Setting</th>
                                <th className="text-left py-2 px-3 font-medium">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inquiries.nightInquiries.map((inq: any) => (
                                <tr key={inq.id} className="border-b hover:bg-slate-50">
                                  <td className="py-2 px-3">{inq.organizationName}</td>
                                  <td className="py-2 px-3">{inq.contactName}</td>
                                  <td className="py-2 px-3">{inq.email}</td>
                                  <td className="py-2 px-3">{inq.careSetting}</td>
                                  <td className="py-2 px-3">{new Date(inq.createdAt).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Wound Care Referrals ({inquiries.woundReferrals.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {inquiries.woundReferrals.length === 0 ? (
                        <p className="text-sm text-slate-500">No wound care referrals yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-3 font-medium">Provider</th>
                                <th className="text-left py-2 px-3 font-medium">Patient</th>
                                <th className="text-left py-2 px-3 font-medium">Diagnosis</th>
                                <th className="text-left py-2 px-3 font-medium">Urgency</th>
                                <th className="text-left py-2 px-3 font-medium">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inquiries.woundReferrals.map((ref: any) => (
                                <tr key={ref.id} className="border-b hover:bg-slate-50">
                                  <td className="py-2 px-3">{ref.providerName}</td>
                                  <td className="py-2 px-3">{ref.patientName}</td>
                                  <td className="py-2 px-3">{ref.diagnosisWoundType}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      ref.urgency === "urgent" ? "bg-red-100 text-red-700" :
                                      ref.urgency === "routine" ? "bg-green-100 text-green-700" :
                                      "bg-yellow-100 text-yellow-700"
                                    }`}>{ref.urgency}</span>
                                  </td>
                                  <td className="py-2 px-3">{new Date(ref.createdAt).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "practices" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Partner Practices ({practices.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {practices.length === 0 ? (
                      <p className="text-sm text-slate-500">No practices synced yet. Click "Sync ThoroughCare" on the Dashboard tab to pull practice data.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-3 font-medium">Practice Name</th>
                              <th className="text-left py-2 px-3 font-medium">Alias</th>
                              <th className="text-left py-2 px-3 font-medium">Departments</th>
                              <th className="text-left py-2 px-3 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {practices.map((p: any) => {
                              let depts: string[] = [];
                              try { depts = p.departments ? JSON.parse(p.departments) : []; } catch {}
                              return (
                                <tr key={p.id} className="border-b hover:bg-slate-50">
                                  <td className="py-2 px-3 font-medium">{p.name}</td>
                                  <td className="py-2 px-3 text-slate-500">{p.thoroughcareAlias || "—"}</td>
                                  <td className="py-2 px-3">
                                    {depts.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {depts.slice(0, 5).map((d: string, i: number) => (
                                          <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">{d.replace(/\s*\[\d+\]\s*$/, '')}</span>
                                        ))}
                                        {depts.length > 5 && <span className="text-xs text-slate-400">+{depts.length - 5} more</span>}
                                      </div>
                                    ) : "—"}
                                  </td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      p.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                    }`}>{p.status}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect, Fragment } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  HeartPulse,
} from "lucide-react";
import type { ProgramSnapshot, Practice, ContactInquiry, RevenueSnapshot, RevenueByCode, CptBillingCode } from "@shared/schema";
import { DollarSign, TrendingUp, Receipt, Pencil, Check, Trash2, Plus, ChevronDown, ChevronUp, Download, BarChart3, FileCheck, Eye, Clock, CircleCheck, CircleX, Users } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

const PROGRAM_ORDER = ["CCM", "RPM", "BHI", "PCM", "RTM", "APCM", "AWV", "TCM"];
const PROGRAM_COLORS: Record<string, string> = {
  CCM: "bg-blue-50 text-blue-700 border-blue-200",
  RPM: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BHI: "bg-purple-50 text-purple-700 border-purple-200",
  PCM: "bg-amber-50 text-amber-700 border-amber-200",
  RTM: "bg-teal-50 text-teal-700 border-teal-200",
  APCM: "bg-indigo-50 text-indigo-700 border-indigo-200",
  AWV: "bg-rose-50 text-rose-700 border-rose-200",
  TCM: "bg-orange-50 text-orange-700 border-orange-200",
};

function PracticeDetailView({ practice, onBack, currentMonth, currentYear, lynkPracticeId }: { practice: any; onBack: () => void; currentMonth: string; currentYear: number; lynkPracticeId: number | null }) {
  const PROGRAMS = ["CCM", "RPM", "BHI", "PCM", "RTM", "APCM", "AWV", "TCM"];
  const MONTHS_LIST = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const MONTH_DISPLAY: Record<string, string> = {
    JAN: "January", FEB: "February", MAR: "March", APR: "April",
    MAY: "May", JUN: "June", JUL: "July", AUG: "August",
    SEP: "September", OCT: "October", NOV: "November", DEC: "December"
  };
  const FTE_HOURS = 160;
  const now = new Date();
  const [rateProgram, setRateProgram] = useState("CCM");
  const [rateYear, setRateYear] = useState(now.getFullYear());
  const [allRates, setAllRates] = useState<any[]>([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [editingRateId, setEditingRateId] = useState<number | null>(null);
  const [editRateValue, setEditRateValue] = useState("");
  const [savingRate, setSavingRate] = useState(false);
  const [staffMonth, setStaffMonth] = useState(currentMonth);
  const [staffYear, setStaffYear] = useState(currentYear);
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const enrollmentQuery = useQuery({
    queryKey: ["/api/admin/new-enrollments", "practice-detail", practice.id, staffMonth, staffYear],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/new-enrollments?month=${staffMonth}&year=${staffYear}&practiceId=${practice.id}`);
      if (!res.ok) throw new Error("Failed to fetch enrollment data");
      return res.json();
    },
  });
  const enrollmentData = enrollmentQuery.data;

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const loadRates = async () => {
    setRatesLoading(true);
    try {
      const res = await adminFetch(`/api/admin/invoice-rates/${practice.id}/${rateYear}`);
      const data = await res.json();
      if (data.success) setAllRates(data.rates);
    } catch (e) { console.error(e); }
    setRatesLoading(false);
  };

  useEffect(() => { loadRates(); }, [rateYear, practice.id]);

  const filteredRates = allRates.filter((r: any) => r.program === rateProgram);

  const saveRate = async (rate: any) => {
    setSavingRate(true);
    try {
      const newCents = Math.round(parseFloat(editRateValue) * 100);
      if (isNaN(newCents)) { setSavingRate(false); return; }
      const res = await adminFetch("/api/admin/invoice-rates", {
        method: "PUT",
        body: JSON.stringify({
          practiceId: practice.id,
          cptCode: rate.cptCode,
          program: rate.program,
          description: rate.description,
          claimRateCents: rate.claimRateCents,
          invoiceRateCents: newCents,
          effectiveYear: rateYear,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAllRates(prev => prev.map((r: any) =>
          r.cptCode === rate.cptCode && r.effectiveYear === rateYear
            ? { ...r, invoiceRateCents: newCents }
            : r
        ));
        setEditingRateId(null);
      }
    } catch (e) { console.error(e); }
    setSavingRate(false);
  };

  let depts: string[] = [];
  try { depts = practice.departments ? JSON.parse(practice.departments) : []; } catch {}

  const isLynkPractice = practice.id === lynkPracticeId;
  const staffingQuery = useQuery({
    queryKey: ["/api/admin/staff-revenue", "practice-detail", practice.id, staffMonth, staffYear],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/staff-revenue?month=${staffMonth}&year=${staffYear}&practiceId=${practice.id}`);
      if (!res.ok) throw new Error("Failed to fetch staffing data");
      return res.json();
    },
  });

  const staffRows = staffingQuery.data?.data || [];
  type DeptBreakdown = { name: string; minutes: number; encounters: number; programs: Record<string, number>; revenueCents: number; claims: number };
  const staffMap = new Map<string, { id: string; name: string; role: string; totalMinutes: number; logCount: number; programs: Record<string, number>; revenueCents: number; estimatedClaims: number; deptBreakdown: Map<string, DeptBreakdown> }>();
  for (const r of staffRows) {
    const key = r.staffTcId || r.staffName || "Unknown";
    if (!staffMap.has(key)) {
      staffMap.set(key, { id: key, name: r.staffName || "Unknown", role: r.staffRole || "Unknown", totalMinutes: 0, logCount: 0, programs: {}, revenueCents: 0, estimatedClaims: 0, deptBreakdown: new Map() });
    }
    const entry = staffMap.get(key)!;
    const mins = Number(r.totalMinutes) || 0;
    const logs = Number(r.logCount) || 0;
    const rev = Number(r.estimatedRevenueCents) || 0;
    const clms = Number(r.estimatedClaims) || 0;
    entry.totalMinutes += mins;
    entry.logCount += logs;
    entry.revenueCents += rev;
    entry.estimatedClaims += clms;
    entry.programs[r.programType] = (entry.programs[r.programType] || 0) + mins;
    if (isLynkPractice && r.department) {
      const dk = r.department;
      if (!entry.deptBreakdown.has(dk)) entry.deptBreakdown.set(dk, { name: dk, minutes: 0, encounters: 0, programs: {}, revenueCents: 0, claims: 0 });
      const db = entry.deptBreakdown.get(dk)!;
      db.minutes += mins;
      db.encounters += logs;
      db.revenueCents += rev;
      db.claims += clms;
      db.programs[r.programType] = (db.programs[r.programType] || 0) + mins;
    }
  }
  const practiceStaffList = Array.from(staffMap.values()).sort((a, b) => b.revenueCents - a.revenueCents);
  const practiceTotalMinutes = practiceStaffList.reduce((sum, s) => sum + s.totalMinutes, 0);
  const practiceTotalHours = Math.round(practiceTotalMinutes / 60 * 10) / 10;
  const practiceTotalFTE = Math.round(practiceTotalHours / FTE_HOURS * 100) / 100;
  const practiceTotalLogs = practiceStaffList.reduce((sum, s) => sum + s.logCount, 0);
  const practiceTotalRevenue = practiceStaffList.reduce((sum, s) => sum + s.revenueCents, 0);
  const practiceTotalClaims = practiceStaffList.reduce((sum, s) => sum + s.estimatedClaims, 0);
  const practiceProgramTotals: Record<string, number> = {};
  for (const s of practiceStaffList) {
    for (const [prog, mins] of Object.entries(s.programs)) {
      practiceProgramTotals[prog] = (practiceProgramTotals[prog] || 0) + mins;
    }
  }

  const programColors: Record<string, string> = {
    CCM: "bg-blue-50 text-blue-700", BHI: "bg-purple-50 text-purple-700",
    RPM: "bg-emerald-50 text-emerald-700", RTM: "bg-teal-50 text-teal-700",
    PCM: "bg-orange-50 text-orange-700", APCM: "bg-rose-50 text-rose-700",
    AWV: "bg-cyan-50 text-cyan-700", TCM: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Practices
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{practice.name}</CardTitle>
              {practice.thoroughcareAlias && (
                <p className="text-sm text-slate-500 mt-1">ThoroughCare Alias: {practice.thoroughcareAlias}</p>
              )}
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              practice.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
            }`}>{practice.status}</span>
          </div>
        </CardHeader>
        <CardContent>
          {depts.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2">Departments / Locations</p>
              <div className="flex flex-wrap gap-1">
                {depts.map((d: string, i: number) => (
                  <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{d.replace(/\s*\[\d+\]\s*$/, '')}</span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Staffing Overview</CardTitle>
            <div className="flex gap-2">
              <select className="border rounded px-2 py-1 text-xs" value={staffMonth} onChange={(e) => setStaffMonth(e.target.value)}>
                {MONTHS_LIST.map(m => <option key={m} value={m}>{MONTH_DISPLAY[m]}</option>)}
              </select>
              <select className="border rounded px-2 py-1 text-xs" value={staffYear} onChange={(e) => setStaffYear(parseInt(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staffingQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : practiceStaffList.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No staffing data for {MONTH_DISPLAY[staffMonth]} {staffYear}.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Revenue</p>
                  <p className="text-xl font-bold text-green-700">${(practiceTotalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Claims</p>
                  <p className="text-xl font-bold text-indigo-700">{practiceTotalClaims.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Staff</p>
                  <p className="text-xl font-bold">{practiceStaffList.length}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Total Hours</p>
                  <p className="text-xl font-bold text-blue-700">{practiceTotalHours.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">FTE</p>
                  <p className="text-xl font-bold text-emerald-700">{practiceTotalFTE.toFixed(2)}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">Encounters</p>
                  <p className="text-xl font-bold text-amber-700">{practiceTotalLogs.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {Object.entries(practiceProgramTotals).sort((a, b) => b[1] - a[1]).map(([prog, mins]) => (
                  <span key={prog} className={`px-2 py-1 rounded text-xs font-medium ${programColors[prog] || "bg-slate-50 text-slate-700"}`}>
                    {prog}: {Math.round(mins / 60 * 10) / 10}h
                  </span>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-2 px-3 font-medium">Staff Member</th>
                      <th className="text-right py-2 px-3 font-medium">Revenue</th>
                      <th className="text-right py-2 px-3 font-medium">Claims</th>
                      <th className="text-right py-2 px-3 font-medium">Hours</th>
                      <th className="text-center py-2 px-3 font-medium">FTE</th>
                      <th className="text-right py-2 px-3 font-medium">Encounters</th>
                      <th className="text-left py-2 px-3 font-medium">Programs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {practiceStaffList.map((s) => {
                      const hrs = Math.round(s.totalMinutes / 60 * 10) / 10;
                      const fte = Math.round(hrs / FTE_HOURS * 100) / 100;
                      const rev = s.revenueCents / 100;
                      const deptBreakdowns = Array.from(s.deptBreakdown.values()).sort((a, b) => b.revenueCents - a.revenueCents);
                      const hasDepts = isLynkPractice && deptBreakdowns.length > 1;
                      const isOpen = expandedStaffId === s.id;
                      return (
                        <Fragment key={s.id}>
                          <tr className={`border-b hover:bg-slate-50 ${hasDepts ? "cursor-pointer" : ""} ${isOpen ? "bg-blue-50/50" : ""}`} onClick={() => hasDepts && setExpandedStaffId(isOpen ? null : s.id)}>
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-1.5">
                                {hasDepts ? (
                                  isOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                ) : <span className="w-3.5" />}
                                <span className="font-medium">{s.name}</span>
                                <span className="text-xs text-slate-400">{s.role}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-right tabular-nums font-medium text-green-700">${rev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td className="py-2 px-3 text-right tabular-nums">{s.estimatedClaims.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right tabular-nums">{hrs.toLocaleString()}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                fte >= 1 ? "bg-green-100 text-green-700" : fte >= 0.5 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                              }`}>{fte.toFixed(2)}</span>
                            </td>
                            <td className="py-2 px-3 text-right tabular-nums">{s.logCount.toLocaleString()}</td>
                            <td className="py-2 px-3">
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(s.programs).sort((a, b) => b[1] - a[1]).map(([prog, mins]) => (
                                  <span key={prog} className={`px-1.5 py-0.5 rounded text-xs font-medium ${programColors[prog] || "bg-slate-50 text-slate-700"}`}>
                                    {prog}: {Math.round(mins / 60 * 10) / 10}h
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                          {isOpen && deptBreakdowns.map((db, j) => {
                            const dbHrs = Math.round(db.minutes / 60 * 10) / 10;
                            const dbRev = db.revenueCents / 100;
                            return (
                              <tr key={`dept-${j}`} className="border-b bg-slate-50/80">
                                <td className="py-1.5 px-3 pl-10">
                                  <span className="text-xs text-slate-500 font-medium">{db.name}</span>
                                </td>
                                <td className="py-1.5 px-3 text-right tabular-nums text-xs text-green-600">${dbRev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                <td className="py-1.5 px-3 text-right tabular-nums text-xs text-slate-600">{db.claims.toLocaleString()}</td>
                                <td className="py-1.5 px-3 text-right tabular-nums text-xs text-slate-600">{dbHrs.toLocaleString()}</td>
                                <td className="py-1.5 px-3 text-center text-xs text-slate-400">—</td>
                                <td className="py-1.5 px-3 text-right tabular-nums text-xs text-slate-600">{db.encounters.toLocaleString()}</td>
                                <td className="py-1.5 px-3">
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(db.programs).sort((a, b) => b[1] - a[1]).map(([prog, mins]) => (
                                      <span key={prog} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${programColors[prog] || "bg-slate-50 text-slate-700"}`}>
                                        {prog}: {Math.round(mins / 60 * 10) / 10}h
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-2 px-3">Total ({practiceStaffList.length} staff)</td>
                      <td className="py-2 px-3 text-right text-green-700">${(practiceTotalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                      <td className="py-2 px-3 text-right">{practiceTotalClaims.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">{practiceTotalHours.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">{practiceTotalFTE.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">{practiceTotalLogs.toLocaleString()}</td>
                      <td className="py-2 px-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {enrollmentData && (enrollmentData.totalNewEnrollments > 0 || enrollmentData.deltas?.length > 0) && (
        <Card className="border-amber-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-600" />
                New Enrollments — {MONTH_DISPLAY[staffMonth]} {staffYear}
              </CardTitle>
              {enrollmentData.enrollmentSpecialist && (
                <span className="text-sm font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                  {enrollmentData.enrollmentSpecialist.staffName}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-amber-600">New Enrollments</p>
                <p className="text-2xl font-bold text-amber-700">+{enrollmentData.totalNewEnrollments}</p>
                <p className="text-[10px] text-amber-500">vs {MONTH_DISPLAY[enrollmentData.previousMonth]} {enrollmentData.previousYear}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Total Enrolled</p>
                <p className="text-2xl font-bold">{enrollmentData.deltas?.reduce((s: number, d: any) => s + d.currentEnrolled, 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500">Programs with Growth</p>
                <p className="text-2xl font-bold">{enrollmentData.deltas?.filter((d: any) => d.newEnrollments > 0).length}</p>
              </div>
            </div>
            {enrollmentData.deltas?.filter((d: any) => d.newEnrollments > 0).length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-amber-50/50">
                      <th className="text-left py-2 px-3 font-medium">Program</th>
                      <th className="text-right py-2 px-3 font-medium">New</th>
                      <th className="text-right py-2 px-3 font-medium">Previous</th>
                      <th className="text-right py-2 px-3 font-medium">Current</th>
                      <th className="text-right py-2 px-3 font-medium">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentData.deltas?.filter((d: any) => d.newEnrollments > 0).map((d: any, i: number) => (
                      <tr key={i} className="border-b hover:bg-amber-50/30">
                        <td className="py-1.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${programColors[d.programType] || "bg-slate-50 text-slate-700"}`}>
                            {d.programType}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right font-bold text-amber-700">+{d.newEnrollments}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums text-slate-500">{d.previousEnrolled.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right tabular-nums">{d.currentEnrolled.toLocaleString()}</td>
                        <td className="py-1.5 px-3 text-right text-xs text-green-600">
                          {d.previousEnrolled > 0 ? `+${((d.newEnrollments / d.previousEnrolled) * 100).toFixed(1)}%` : "New"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-50 font-bold">
                      <td className="py-2 px-3">Total</td>
                      <td className="py-2 px-3 text-right text-amber-700">+{enrollmentData.totalNewEnrollments}</td>
                      <td className="py-2 px-3" colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Billing Rates</CardTitle>
          <p className="text-xs text-slate-500">Set custom invoice rates for this practice. The claim rate is the Medicare fee schedule rate. The invoice rate is what you charge this practice.</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Program</label>
              <select className="border rounded px-3 py-1.5 text-sm" value={rateProgram} onChange={(e) => setRateProgram(e.target.value)}>
                {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Year</label>
              <select className="border rounded px-3 py-1.5 text-sm" value={rateYear} onChange={(e) => setRateYear(parseInt(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {ratesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : filteredRates.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No billing codes found for {rateProgram} in {rateYear}.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-3 font-medium">CPT Code</th>
                    <th className="text-left py-2 px-3 font-medium">Description</th>
                    <th className="text-right py-2 px-3 font-medium">Claim Rate</th>
                    <th className="text-right py-2 px-3 font-medium">Invoice Rate</th>
                    <th className="text-center py-2 px-3 font-medium w-20">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRates.map((r: any) => (
                    <tr key={r.id} className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-xs">{r.cptCode}</td>
                      <td className="py-2 px-3 text-slate-600 text-xs">{r.description || "—"}</td>
                      <td className="py-2 px-3 text-right text-slate-500">{formatCurrency(r.claimRateCents)}</td>
                      <td className="py-2 px-3 text-right">
                        {editingRateId === r.id ? (
                          <input
                            type="number"
                            step="0.01"
                            className="border rounded px-2 py-1 text-sm text-right w-24"
                            value={editRateValue}
                            onChange={(e) => setEditRateValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveRate(r);
                              if (e.key === "Escape") setEditingRateId(null);
                            }}
                            autoFocus
                          />
                        ) : (
                          <span className={`font-medium ${r.invoiceRateCents !== r.claimRateCents ? "text-blue-700" : ""}`}>
                            {formatCurrency(r.invoiceRateCents)}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {editingRateId === r.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => saveRate(r)} disabled={savingRate}>
                              {savingRate ? <Loader2 className="w-3 h-3 animate-spin" /> : <CircleCheck className="w-4 h-4 text-green-600" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingRateId(null)}>
                              <CircleX className="w-4 h-4 text-slate-400" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => { setEditingRateId(r.id); setEditRateValue((r.invoiceRateCents / 100).toFixed(2)); }}>
                            <Pencil className="w-3.5 h-3.5 text-slate-400" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StaffingTab({ practices, currentMonth, currentYear, lynkPracticeId, departmentsByPractice }: { practices: any[]; currentMonth: string; currentYear: number; lynkPracticeId: number | null; departmentsByPractice: Record<number, string[]> }) {
  const FTE_HOURS = 160;
  const MONTHS_LIST = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const MONTH_DISPLAY: Record<string, string> = {
    JAN: "January", FEB: "February", MAR: "March", APR: "April",
    MAY: "May", JUN: "June", JUL: "July", AUG: "August",
    SEP: "September", OCT: "October", NOV: "November", DEC: "December"
  };
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPractice, setSelectedPractice] = useState<string>("all");
  const [expandedStaff, setExpandedStaff] = useState<Set<string>>(new Set());
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editRoleValue, setEditRoleValue] = useState("");
  const [savingRole, setSavingRole] = useState(false);

  const queryClient = useQueryClient();

  const saveRoleOverride = async (staffTcId: string, staffName: string) => {
    if (!editRoleValue.trim()) return;
    setSavingRole(true);
    try {
      await adminFetch("/api/admin/staff-role-overrides", {
        method: "POST",
        body: JSON.stringify({ staffTcId, staffName, overrideRole: editRoleValue.trim() }),
      });
      setEditingRoleId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/staff-revenue"] });
    } catch (e) { console.error(e); }
    setSavingRole(false);
  };

  const lynkDepts = lynkPracticeId && departmentsByPractice[lynkPracticeId] ? departmentsByPractice[lynkPracticeId] : [];

  let queryParams = `month=${selectedMonth}&year=${selectedYear}`;
  if (selectedPractice !== "all") {
    if (selectedPractice.startsWith("dept:")) {
      queryParams += `&practiceId=${lynkPracticeId}&department=${encodeURIComponent(selectedPractice.slice(5))}`;
    } else {
      queryParams += `&practiceId=${selectedPractice}`;
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/staff-revenue", selectedMonth, selectedYear, selectedPractice],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/staff-revenue?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch staffing data");
      return res.json();
    },
  });

  const rows = data?.data || [];

  const otherPractices = practices.filter(p => p.id !== lynkPracticeId && p.status === "active");
  const practiceNameMap = new Map<number, string>();
  for (const p of practices) {
    if (p.id === lynkPracticeId) continue;
    practiceNameMap.set(p.id, p.name);
  }

  type PracticeBreakdown = { name: string; minutes: number; encounters: number; programs: Record<string, number>; revenueCents: number; claims: number };
  const staffMap = new Map<string, { id: string; name: string; role: string; totalMinutes: number; logCount: number; programs: Record<string, number>; revenueCents: number; estimatedClaims: number; practiceIds: Set<number>; departments: Set<string>; practiceBreakdown: Map<string, PracticeBreakdown> }>();
  for (const r of rows) {
    const key = r.staffTcId || r.staffName || "Unknown";
    if (!staffMap.has(key)) {
      staffMap.set(key, { id: key, name: r.staffName || "Unknown", role: r.staffRole || "Unknown", totalMinutes: 0, logCount: 0, programs: {}, revenueCents: 0, estimatedClaims: 0, practiceIds: new Set(), departments: new Set(), practiceBreakdown: new Map() });
    }
    const entry = staffMap.get(key)!;
    const mins = Number(r.totalMinutes) || 0;
    const logs = Number(r.logCount) || 0;
    const rev = Number(r.estimatedRevenueCents) || 0;
    const clms = Number(r.estimatedClaims) || 0;
    entry.totalMinutes += mins;
    entry.logCount += logs;
    entry.revenueCents += rev;
    entry.estimatedClaims += clms;
    entry.programs[r.programType] = (entry.programs[r.programType] || 0) + mins;
    if (r.practiceId) entry.practiceIds.add(r.practiceId);
    if (r.department && r.practiceId === lynkPracticeId) {
      entry.departments.add(r.department);
    }
    const practiceName = (r.department && r.practiceId === lynkPracticeId) ? r.department : (r.practiceId ? (practiceNameMap.get(r.practiceId) || "Unknown") : "Unknown");
    const pbKey = practiceName;
    if (!entry.practiceBreakdown.has(pbKey)) {
      entry.practiceBreakdown.set(pbKey, { name: practiceName, minutes: 0, encounters: 0, programs: {}, revenueCents: 0, claims: 0 });
    }
    const pb = entry.practiceBreakdown.get(pbKey)!;
    pb.minutes += mins;
    pb.encounters += logs;
    pb.revenueCents += rev;
    pb.claims += clms;
    pb.programs[r.programType] = (pb.programs[r.programType] || 0) + mins;
  }

  const staffList = Array.from(staffMap.values()).sort((a, b) => b.revenueCents - a.revenueCents);
  const toggleExpand = (id: string) => {
    setExpandedStaff(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const totalMinutes = staffList.reduce((sum, s) => sum + s.totalMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
  const totalFTE = Math.round(totalHours / FTE_HOURS * 100) / 100;
  const totalLogs = staffList.reduce((sum, s) => sum + s.logCount, 0);
  const totalRevenue = staffList.reduce((sum, s) => sum + s.revenueCents, 0);
  const totalClaims = staffList.reduce((sum, s) => sum + s.estimatedClaims, 0);

  const roleMap = new Map<string, number>();
  for (const s of staffList) {
    roleMap.set(s.role, (roleMap.get(s.role) || 0) + s.totalMinutes);
  }
  const roleSummary = Array.from(roleMap.entries()).sort((a, b) => b[1] - a[1]);

  const exportCSV = () => {
    const header = "Staff Name,Role,Revenue,Claims,Total Hours,FTE,Encounters,Practices,Programs\n";
    const csvRows = staffList.map(s => {
      const hours = Math.round(s.totalMinutes / 60 * 10) / 10;
      const fte = Math.round(hours / FTE_HOURS * 100) / 100;
      const rev = (s.revenueCents / 100).toFixed(2);
      const programs = Object.entries(s.programs).map(([k, v]) => `${k}: ${Math.round(v / 60 * 10) / 10}h`).join("; ");
      const nonLynk = Array.from(s.practiceIds).filter(id => id !== lynkPracticeId).map(id => practiceNameMap.get(id) || "").filter(Boolean);
      const depts = Array.from(s.departments);
      const allPracticeNames = [...nonLynk, ...depts].join("; ");
      return `"${s.name}","${s.role}",${rev},${s.estimatedClaims},${hours},${fte},${s.logCount},"${allPracticeNames}","${programs}"`;
    });
    const blob = new Blob([header + csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staffing-report-${selectedMonth}-${selectedYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const programColors: Record<string, string> = {
    CCM: "bg-blue-50 text-blue-700",
    BHI: "bg-purple-50 text-purple-700",
    RPM: "bg-emerald-50 text-emerald-700",
    RTM: "bg-teal-50 text-teal-700",
    PCM: "bg-orange-50 text-orange-700",
    APCM: "bg-rose-50 text-rose-700",
    AWV: "bg-cyan-50 text-cyan-700",
    TCM: "bg-amber-50 text-amber-700",
  };

  const avgHoursPerStaff = staffList.length > 0 ? Math.round(totalHours / staffList.length * 10) / 10 : 0;

  const enrollmentQuery = useQuery({
    queryKey: ["/api/admin/new-enrollments", selectedMonth, selectedYear, selectedPractice],
    queryFn: async () => {
      let params = `month=${selectedMonth}&year=${selectedYear}`;
      if (selectedPractice !== "all") {
        if (selectedPractice.startsWith("dept:")) {
          const dept = selectedPractice.replace("dept:", "");
          params += `&practiceId=${lynkPracticeId}&department=${encodeURIComponent(dept)}`;
        } else {
          params += `&practiceId=${selectedPractice}`;
        }
      }
      const res = await adminFetch(`/api/admin/new-enrollments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch enrollment data");
      return res.json();
    },
  });

  const enrollmentData = enrollmentQuery.data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select className="border rounded px-3 py-1.5 text-sm" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {MONTHS_LIST.map(m => <option key={m} value={m}>{MONTH_DISPLAY[m]}</option>)}
        </select>
        <select className="border rounded px-3 py-1.5 text-sm" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="border rounded px-3 py-1.5 text-sm" value={selectedPractice} onChange={(e) => setSelectedPractice(e.target.value)}>
          <option value="all">All Practices</option>
          {otherPractices.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          {lynkDepts.map(dept => (
            <option key={`dept:${dept}`} value={`dept:${dept}`}>{dept}</option>
          ))}
        </select>
        <button onClick={exportCSV} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded hover:bg-slate-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent" />
          <span className="ml-2 text-sm text-slate-500">Loading staffing data...</span>
        </div>
      ) : staffList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">No staffing data for {MONTH_DISPLAY[selectedMonth]} {selectedYear}.</p>
            <p className="text-sm text-slate-400 mt-1">Run a ThoroughCare sync to populate this report.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-green-600 uppercase tracking-wide">Total Revenue</p>
                <p className="text-2xl font-bold mt-1 text-green-700">${(totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              </CardContent>
            </Card>
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-indigo-600 uppercase tracking-wide">Total Claims</p>
                <p className="text-2xl font-bold mt-1 text-indigo-700">{totalClaims.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Active Staff</p>
                <p className="text-2xl font-bold mt-1">{staffList.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Hours</p>
                <p className="text-2xl font-bold mt-1">{totalHours.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">FTEs</p>
                <p className="text-2xl font-bold mt-1">{totalFTE}</p>
                <p className="text-xs text-slate-400">{FTE_HOURS}h/month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Hours/Staff</p>
                <p className="text-2xl font-bold mt-1">{avgHoursPerStaff}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Total Encounters</p>
                <p className="text-2xl font-bold mt-1">{totalLogs.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Staff Detail — {MONTH_DISPLAY[selectedMonth]} {selectedYear}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-2 px-3 font-medium">Staff Member</th>
                      <th className="text-right py-2 px-3 font-medium">Revenue</th>
                      <th className="text-right py-2 px-3 font-medium">Claims</th>
                      <th className="text-right py-2 px-3 font-medium">Hours</th>
                      <th className="text-center py-2 px-3 font-medium">FTE</th>
                      <th className="text-right py-2 px-3 font-medium">Encounters</th>
                      <th className="text-right py-2 px-3 font-medium">New Enrollments</th>
                      <th className="text-left py-2 px-3 font-medium">Practices</th>
                      <th className="text-left py-2 px-3 font-medium">Programs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((s, i) => {
                      const hours = Math.round(s.totalMinutes / 60 * 10) / 10;
                      const fte = Math.round(hours / FTE_HOURS * 100) / 100;
                      const rev = s.revenueCents / 100;
                      const nonLynkPractices = Array.from(s.practiceIds).filter(id => id !== lynkPracticeId).map(id => practiceNameMap.get(id) || "").filter(Boolean);
                      const deptNames = Array.from(s.departments);
                      const practiceNames = [...nonLynkPractices, ...deptNames].join(", ");
                      const isExpanded = expandedStaff.has(s.id);
                      const breakdowns = Array.from(s.practiceBreakdown.values()).sort((a, b) => b.revenueCents - a.revenueCents);
                      const hasMultiple = breakdowns.length > 1;
                      return (
                        <Fragment key={s.id}>
                        <tr className={`border-b hover:bg-slate-50 ${hasMultiple ? "cursor-pointer" : ""} ${isExpanded ? "bg-blue-50/50" : ""}`} onClick={() => hasMultiple && toggleExpand(s.id)}>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              {hasMultiple ? (
                                isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                              ) : <span className="w-3.5" />}
                              <span className="font-medium">{s.name}</span>
                              {editingRoleId === s.id ? (
                                <span className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    className="border rounded px-1.5 py-0.5 text-xs w-32"
                                    value={editRoleValue}
                                    onChange={(e) => setEditRoleValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && saveRoleOverride(s.id, s.name)}
                                    autoFocus
                                  />
                                  <button onClick={() => saveRoleOverride(s.id, s.name)} disabled={savingRole} className="text-green-600 hover:text-green-800">
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                  <button onClick={() => setEditingRoleId(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400 group/role flex items-center gap-0.5">
                                  {s.role}
                                  <button onClick={(e) => { e.stopPropagation(); setEditingRoleId(s.id); setEditRoleValue(s.role); }} className="opacity-0 group-hover/role:opacity-100 text-slate-300 hover:text-blue-500 transition-opacity">
                                    <Pencil className="h-2.5 w-2.5" />
                                  </button>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums font-medium text-green-700">${rev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                          <td className="py-2 px-3 text-right tabular-nums">{s.estimatedClaims.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right tabular-nums">{hours.toLocaleString()}</td>
                          <td className="py-2 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              fte >= 1 ? "bg-green-100 text-green-700" : fte >= 0.5 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                            }`}>{fte.toFixed(2)}</span>
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums">{s.logCount.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right tabular-nums">
                            {s.role === "Enrollment Specialist" && enrollmentData?.totalNewEnrollments != null ? (
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">
                                +{enrollmentData.totalNewEnrollments}
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-xs text-slate-600 max-w-[200px]" title={practiceNames}>
                            <div className="truncate">{practiceNames || "—"}</div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(s.programs).sort((a, b) => b[1] - a[1]).map(([prog, mins]) => (
                                <span key={prog} className={`px-1.5 py-0.5 rounded text-xs font-medium ${programColors[prog] || "bg-slate-50 text-slate-700"}`}>
                                  {prog}: {Math.round(mins / 60 * 10) / 10}h
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && breakdowns.map((pb, j) => {
                          const pbHours = Math.round(pb.minutes / 60 * 10) / 10;
                          const pbRev = pb.revenueCents / 100;
                          return (
                            <tr key={`${i}-${j}`} className="border-b bg-slate-50/80">
                              <td className="py-1.5 px-3 pl-10">
                                <span className="text-xs text-slate-500 font-medium">{pb.name}</span>
                              </td>
                              <td className="py-1.5 px-3 text-right tabular-nums text-xs text-green-600">${pbRev.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                              <td className="py-1.5 px-3 text-right tabular-nums text-xs text-slate-600">{pb.claims.toLocaleString()}</td>
                              <td className="py-1.5 px-3 text-right tabular-nums text-xs text-slate-600">{pbHours.toLocaleString()}</td>
                              <td className="py-1.5 px-3 text-center text-xs text-slate-400">—</td>
                              <td className="py-1.5 px-3 text-right tabular-nums text-xs text-slate-600">{pb.encounters.toLocaleString()}</td>
                              <td className="py-1.5 px-3"></td>
                              <td className="py-1.5 px-3"></td>
                              <td className="py-1.5 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(pb.programs).sort((a, b) => b[1] - a[1]).map(([prog, mins]) => (
                                    <span key={prog} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${programColors[prog] || "bg-slate-50 text-slate-700"}`}>
                                      {prog}: {Math.round(mins / 60 * 10) / 10}h
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        </Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-2 px-3">Total ({staffList.length} staff)</td>
                      <td className="py-2 px-3 text-right text-green-700">${(totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                      <td className="py-2 px-3 text-right">{totalClaims.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">{totalHours.toLocaleString()}</td>
                      <td className="py-2 px-3 text-center">{totalFTE.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">{totalLogs.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right">
                        {enrollmentData?.totalNewEnrollments != null && enrollmentData.totalNewEnrollments > 0 ? (
                          <span className="font-bold text-amber-700">+{enrollmentData.totalNewEnrollments}</span>
                        ) : ""}
                      </td>
                      <td className="py-2 px-3"></td>
                      <td className="py-2 px-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {enrollmentData && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    Enrollment Specialist Report — {MONTH_DISPLAY[selectedMonth]} {selectedYear}
                  </CardTitle>
                  {enrollmentData.enrollmentSpecialist && (
                    <span className="text-sm font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                      {enrollmentData.enrollmentSpecialist.staffName}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600">New Enrollments</p>
                    <p className="text-2xl font-bold text-amber-700">{enrollmentData.totalNewEnrollments}</p>
                    <p className="text-[10px] text-amber-500">vs {MONTH_DISPLAY[enrollmentData.previousMonth]} {enrollmentData.previousYear}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Total Enrolled</p>
                    <p className="text-2xl font-bold">{enrollmentData.deltas?.reduce((s: number, d: any) => s + d.currentEnrolled, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500">Programs with Growth</p>
                    <p className="text-2xl font-bold">{enrollmentData.deltas?.filter((d: any) => d.newEnrollments > 0).length}</p>
                  </div>
                </div>
                {enrollmentData.deltas?.filter((d: any) => d.newEnrollments > 0).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-amber-50/50">
                          <th className="text-left py-2 px-3 font-medium">Practice</th>
                          <th className="text-left py-2 px-3 font-medium">Program</th>
                          <th className="text-right py-2 px-3 font-medium">New</th>
                          <th className="text-right py-2 px-3 font-medium">Previous</th>
                          <th className="text-right py-2 px-3 font-medium">Current</th>
                          <th className="text-right py-2 px-3 font-medium">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollmentData.deltas?.filter((d: any) => d.newEnrollments > 0).map((d: any, i: number) => (
                          <tr key={i} className="border-b hover:bg-amber-50/30">
                            <td className="py-1.5 px-3 font-medium">{d.practiceName}</td>
                            <td className="py-1.5 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${programColors[d.programType] || "bg-slate-50 text-slate-700"}`}>
                                {d.programType}
                              </span>
                            </td>
                            <td className="py-1.5 px-3 text-right font-bold text-amber-700">+{d.newEnrollments}</td>
                            <td className="py-1.5 px-3 text-right tabular-nums text-slate-500">{d.previousEnrolled.toLocaleString()}</td>
                            <td className="py-1.5 px-3 text-right tabular-nums">{d.currentEnrolled.toLocaleString()}</td>
                            <td className="py-1.5 px-3 text-right text-xs text-green-600">
                              {d.previousEnrolled > 0 ? `+${((d.newEnrollments / d.previousEnrolled) * 100).toFixed(1)}%` : "New"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-amber-50 font-bold">
                          <td className="py-2 px-3" colSpan={2}>Total New Enrollments</td>
                          <td className="py-2 px-3 text-right text-amber-700">+{enrollmentData.totalNewEnrollments}</td>
                          <td className="py-2 px-3" colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">No new enrollments this month compared to the previous month.</p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function InvoicesTab() {
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const MONTH_DISPLAY: Record<string, string> = {
    JAN: "January", FEB: "February", MAR: "March", APR: "April",
    MAY: "May", JUN: "June", JUL: "July", AUG: "August",
    SEP: "September", OCT: "October", NOV: "November", DEC: "December"
  };
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [genMonth, setGenMonth] = useState(MONTHS[prevMonth.getMonth()]);
  const [genYear, setGenYear] = useState(prevMonth.getFullYear());
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await adminFetch(`/api/admin/invoices?${params}`);
      const data = await res.json();
      if (data.success) setInvoiceList(data.invoices);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadInvoices(); }, [statusFilter]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await adminFetch("/api/admin/invoices/generate", {
        method: "POST",
        body: JSON.stringify({ month: genMonth, year: genYear }),
      });
      const data = await res.json();
      if (data.success) {
        loadInvoices();
      }
    } catch (e) { console.error(e); }
    setGenerating(false);
  };

  const viewInvoice = async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await adminFetch(`/api/admin/invoices/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedInvoice(data.invoice);
        setLineItems(data.lineItems);
      }
    } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await adminFetch(`/api/admin/invoices/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedInvoice(data.invoice);
        loadInvoices();
      }
    } catch (e) { console.error(e); }
  };

  const deleteInvoice = async (id: number) => {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      await adminFetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      setSelectedInvoice(null);
      loadInvoices();
    } catch (e) { console.error(e); }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending_review: "bg-amber-100 text-amber-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      sent: "bg-blue-100 text-blue-700",
      paid: "bg-emerald-100 text-emerald-700",
    };
    const labels: Record<string, string> = {
      pending_review: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
      sent: "Sent",
      paid: "Paid",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const programBadge = (program: string) => {
    const colors: Record<string, string> = {
      CCM: "bg-blue-100 text-blue-700",
      RPM: "bg-purple-100 text-purple-700",
      BHI: "bg-pink-100 text-pink-700",
      PCM: "bg-cyan-100 text-cyan-700",
      RTM: "bg-teal-100 text-teal-700",
      APCM: "bg-indigo-100 text-indigo-700",
      AWV: "bg-orange-100 text-orange-700",
      TCM: "bg-rose-100 text-rose-700",
    };
    return <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[program] || "bg-slate-100 text-slate-600"}`}>{program}</span>;
  };

  if (selectedInvoice) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Invoices
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedInvoice.invoiceNumber}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">{selectedInvoice.practiceName} — {MONTH_DISPLAY[selectedInvoice.month]} {selectedInvoice.year}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(selectedInvoice.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(selectedInvoice.totalAmountCents)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Total Claims</p>
                <p className="text-xl font-bold text-slate-800">{selectedInvoice.totalClaims}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Generated</p>
                <p className="text-sm font-medium text-slate-800">{new Date(selectedInvoice.generatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-700 mb-3">Line Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-3 font-medium">Program</th>
                    <th className="text-left py-2 px-3 font-medium">CPT Code</th>
                    <th className="text-left py-2 px-3 font-medium">Description</th>
                    <th className="text-right py-2 px-3 font-medium">Claims</th>
                    <th className="text-right py-2 px-3 font-medium">Rate</th>
                    <th className="text-right py-2 px-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((li: any) => (
                    <tr key={li.id} className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3">{programBadge(li.programType)}</td>
                      <td className="py-2 px-3 font-mono text-xs">{li.cptCode}</td>
                      <td className="py-2 px-3 text-slate-600 text-xs">{li.description || "—"}</td>
                      <td className="py-2 px-3 text-right">{li.claimCount}</td>
                      <td className="py-2 px-3 text-right">{formatCurrency(li.rateCents)}</td>
                      <td className="py-2 px-3 text-right font-medium">{formatCurrency(li.totalCents)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold">
                    <td colSpan={3} className="py-2 px-3">Total</td>
                    <td className="py-2 px-3 text-right">{selectedInvoice.totalClaims}</td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3 text-right">{formatCurrency(selectedInvoice.totalAmountCents)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {selectedInvoice.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{selectedInvoice.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6 pt-4 border-t">
              {selectedInvoice.status === "pending_review" && (
                <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selectedInvoice.id, "approved")}>
                    <CircleCheck className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(selectedInvoice.id, "rejected")}>
                    <CircleX className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </>
              )}
              {selectedInvoice.status === "approved" && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus(selectedInvoice.id, "sent")}>
                  <Mail className="w-4 h-4 mr-1" /> Mark as Sent
                </Button>
              )}
              {selectedInvoice.status === "sent" && (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => updateStatus(selectedInvoice.id, "paid")}>
                  <DollarSign className="w-4 h-4 mr-1" /> Mark as Paid
                </Button>
              )}
              {(selectedInvoice.status === "pending_review" || selectedInvoice.status === "rejected") && (
                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 ml-auto" onClick={() => deleteInvoice(selectedInvoice.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Generate Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Month</label>
              <select className="border rounded px-3 py-1.5 text-sm" value={genMonth} onChange={(e) => setGenMonth(e.target.value)}>
                {MONTHS.map(m => <option key={m} value={m}>{MONTH_DISPLAY[m]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Year</label>
              <select className="border rounded px-3 py-1.5 text-sm" value={genYear} onChange={(e) => setGenYear(parseInt(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <Button size="sm" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <FileCheck className="w-4 h-4 mr-1" />}
              {generating ? "Generating..." : "Generate Invoices"}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Generates one invoice per practice using each practice's custom billing rates (set in the Practices tab). All practices will get an invoice. Existing invoices for a practice/month will be skipped.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Invoices</CardTitle>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
              </select>
              <Button variant="ghost" size="sm" onClick={loadInvoices}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : invoiceList.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No invoices found. Use the generator above to create invoices from billing data.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-3 font-medium">Invoice #</th>
                    <th className="text-left py-2 px-3 font-medium">Practice</th>
                    <th className="text-left py-2 px-3 font-medium">Period</th>
                    <th className="text-right py-2 px-3 font-medium">Claims</th>
                    <th className="text-right py-2 px-3 font-medium">Amount</th>
                    <th className="text-center py-2 px-3 font-medium">Status</th>
                    <th className="text-center py-2 px-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((inv: any) => (
                    <tr key={inv.id} className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-xs">{inv.invoiceNumber}</td>
                      <td className="py-2 px-3 font-medium">{inv.practiceName}</td>
                      <td className="py-2 px-3 text-slate-600">{MONTH_DISPLAY[inv.month]} {inv.year}</td>
                      <td className="py-2 px-3 text-right">{inv.totalClaims}</td>
                      <td className="py-2 px-3 text-right font-medium">{formatCurrency(inv.totalAmountCents)}</td>
                      <td className="py-2 px-3 text-center">{statusBadge(inv.status)}</td>
                      <td className="py-2 px-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => viewInvoice(inv.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BillingCodesTab() {
  const [codes, setCodes] = useState<CptBillingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ code: string; description: string; rateCents: number; program: string }>({ code: "", description: "", rateCents: 0, program: "" });
  const [adding, setAdding] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", description: "", program: "CCM", rateCents: 0 });
  const [saving, setSaving] = useState(false);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/billing-codes?year=${selectedYear}`);
      const data = await res.json();
      if (data.success) setCodes(data.codes);
    } catch (err) {
      console.error("Failed to fetch billing codes:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, [selectedYear]);

  const startEdit = (code: CptBillingCode) => {
    setEditingId(code.id);
    setEditValues({ code: code.code, description: code.description, rateCents: code.rateCents, program: code.program });
  };

  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/billing-codes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      const data = await res.json();
      if (data.success) {
        setCodes(prev => prev.map(c => c.id === editingId ? data.code : c));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to update billing code:", err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this billing code?")) return;
    try {
      const res = await adminFetch(`/api/admin/billing-codes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setCodes(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete billing code:", err);
    }
  };

  const handleAdd = async () => {
    if (!newCode.code || !newCode.description || newCode.rateCents <= 0) return;
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/billing-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCode, effectiveYear: selectedYear, state: "MS", isActive: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setCodes(prev => [...prev, data.code]);
        setNewCode({ code: "", description: "", program: "CCM", rateCents: 0 });
        setAdding(false);
      }
    } catch (err) {
      console.error("Failed to add billing code:", err);
    }
    setSaving(false);
  };

  const groupedByProgram = PROGRAM_ORDER.reduce((acc, prog) => {
    const programCodes = codes.filter(c => c.program === prog);
    if (programCodes.length > 0) acc[prog] = programCodes;
    return acc;
  }, {} as Record<string, CptBillingCode[]>);

  const otherCodes = codes.filter(c => !PROGRAM_ORDER.includes(c.program));
  if (otherCodes.length > 0) groupedByProgram["Other"] = otherCodes;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base">Medicare Fee Schedule Rates — Mississippi</CardTitle>
              <p className="text-sm text-slate-500 mt-1">Manage CPT billing codes and reimbursement rates used for revenue calculations</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border rounded px-3 py-1.5 text-sm bg-white"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <Button size="sm" onClick={() => setAdding(true)} className="gap-1">
                <Plus className="w-4 h-4" /> Add Code
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p>No billing codes found for {selectedYear}</p>
              <p className="text-xs mt-1">Add codes or switch to a different year</p>
            </div>
          ) : (
            <div className="space-y-6">
              {adding && (
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-sm mb-3">Add New Billing Code</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      placeholder="CPT Code (e.g. 99490)"
                      value={newCode.code}
                      onChange={(e) => setNewCode(p => ({ ...p, code: e.target.value }))}
                      className="border rounded px-3 py-1.5 text-sm"
                    />
                    <input
                      placeholder="Description"
                      value={newCode.description}
                      onChange={(e) => setNewCode(p => ({ ...p, description: e.target.value }))}
                      className="border rounded px-3 py-1.5 text-sm lg:col-span-2"
                    />
                    <select
                      value={newCode.program}
                      onChange={(e) => setNewCode(p => ({ ...p, program: e.target.value }))}
                      className="border rounded px-3 py-1.5 text-sm bg-white"
                    >
                      {PROGRAM_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Rate"
                        value={newCode.rateCents ? (newCode.rateCents / 100).toFixed(2) : ""}
                        onChange={(e) => setNewCode(p => ({ ...p, rateCents: Math.round(parseFloat(e.target.value || "0") * 100) }))}
                        className="border rounded px-3 py-1.5 text-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleAdd} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {Object.entries(groupedByProgram).map(([program, programCodes]) => (
                <div key={program} className="border rounded-lg overflow-hidden">
                  <div className={`px-4 py-2.5 font-medium text-sm border-b ${PROGRAM_COLORS[program] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                    {program === "CCM" && "CCM — Chronic Care Management"}
                    {program === "RPM" && "RPM — Remote Patient Monitoring"}
                    {program === "BHI" && "BHI — Behavioral Health Integration"}
                    {program === "PCM" && "PCM — Principal Care Management"}
                    {program === "RTM" && "RTM — Remote Therapeutic Monitoring"}
                    {program === "APCM" && "APCM — Advanced Primary Care Management"}
                    {program === "AWV" && "AWV — Annual Wellness Visit"}
                    {program === "TCM" && "TCM — Transitional Care Management"}
                    {!["CCM","RPM","BHI","PCM","RTM","APCM","AWV","TCM"].includes(program) && program}
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="text-left py-2 px-4 font-medium w-24">CPT Code</th>
                        <th className="text-left py-2 px-4 font-medium">Description</th>
                        <th className="text-right py-2 px-4 font-medium w-32">{selectedYear} Rate</th>
                        <th className="text-right py-2 px-4 font-medium w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programCodes.map((c) => (
                        <tr key={c.id} className="border-b last:border-b-0 hover:bg-slate-50">
                          {editingId === c.id ? (
                            <>
                              <td className="py-2 px-4">
                                <input
                                  value={editValues.code}
                                  onChange={(e) => setEditValues(p => ({ ...p, code: e.target.value }))}
                                  className="border rounded px-2 py-1 text-sm w-full"
                                />
                              </td>
                              <td className="py-2 px-4">
                                <input
                                  value={editValues.description}
                                  onChange={(e) => setEditValues(p => ({ ...p, description: e.target.value }))}
                                  className="border rounded px-2 py-1 text-sm w-full"
                                />
                              </td>
                              <td className="py-2 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <span className="text-slate-500">$</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={(editValues.rateCents / 100).toFixed(2)}
                                    onChange={(e) => setEditValues(p => ({ ...p, rateCents: Math.round(parseFloat(e.target.value || "0") * 100) }))}
                                    className="border rounded px-2 py-1 text-sm w-24 text-right"
                                  />
                                </div>
                              </td>
                              <td className="py-2 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" variant="ghost" onClick={saveEdit} disabled={saving} className="h-7 w-7 p-0">
                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-green-600" />}
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-7 w-7 p-0">
                                    <X className="w-3.5 h-3.5 text-slate-400" />
                                  </Button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-2 px-4 font-mono font-medium text-slate-700">{c.code}</td>
                              <td className="py-2 px-4 text-slate-600">{c.description}</td>
                              <td className="py-2 px-4 text-right font-medium">${(c.rateCents / 100).toFixed(2)}</td>
                              <td className="py-2 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => startEdit(c)} className="h-7 w-7 p-0">
                                    <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)} className="h-7 w-7 p-0">
                                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />
                                  </Button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <p className="text-xs text-slate-400">
            Rates shown are Mississippi Physician Fee Schedule rates. These rates are used to calculate estimated revenue from ThoroughCare claims data.
            Update rates annually when new CMS fee schedules are released.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsTab({ selectedMonth, currentYear, selectedPractice, selectedDepartment = "all" }: { selectedMonth: string; currentYear: number; selectedPractice: string; selectedDepartment?: string | "all" }) {
  const [trendMonths, setTrendMonths] = useState(6);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState<any[]>([]);
  const [revenueByProgram, setRevenueByProgram] = useState<any[]>([]);
  const [practiceComparison, setPracticeComparison] = useState<any[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setTrendsLoading(true);
      try {
        const practiceParam = selectedPractice !== "all" ? `&practiceId=${selectedPractice}` : "";
        const deptParam = selectedDepartment !== "all" ? `&department=${encodeURIComponent(selectedDepartment)}` : "";
        const [revRes, enrRes, progRes, compRes] = await Promise.all([
          adminFetch(`/api/admin/trends/revenue?months=${trendMonths}${practiceParam}${deptParam}`),
          adminFetch(`/api/admin/trends/enrollments?months=${trendMonths}${practiceParam}${deptParam}`),
          adminFetch(`/api/admin/trends/revenue-by-program?months=${trendMonths}${practiceParam}${deptParam}`),
          adminFetch(`/api/admin/trends/practice-comparison?month=${selectedMonth}&year=${currentYear}`),
        ]);
        if (revRes.ok) setRevenueTrends(await revRes.json());
        if (enrRes.ok) setEnrollmentTrends(await enrRes.json());
        if (progRes.ok) setRevenueByProgram(await progRes.json());
        if (compRes.ok) setPracticeComparison(await compRes.json());
      } catch {}
      setTrendsLoading(false);
    };
    load();
  }, [trendMonths, selectedPractice, selectedDepartment, selectedMonth, currentYear]);

  const handleExport = async (type: string) => {
    const url = `/api/admin/export/${type}?month=${selectedMonth}&year=${currentYear}`;
    try {
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${type}_${selectedMonth}_${currentYear}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {}
  };

  const formatRevenue = (cents: number) => `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const formatRevenueShort = (cents: number) => {
    const dollars = cents / 100;
    if (dollars >= 1000000) return `$${(dollars / 1000000).toFixed(1)}M`;
    if (dollars >= 1000) return `$${(dollars / 1000).toFixed(0)}K`;
    return `$${dollars.toFixed(0)}`;
  };

  const chartData = revenueTrends.map((r, i) => ({
    label: `${r.month} '${String(r.year).slice(2)}`,
    revenue: Math.round(r.totalRevenue / 100),
    claims: r.totalClaims,
    enrolled: enrollmentTrends[i]?.enrolled || 0,
    inactive: enrollmentTrends[i]?.inactive || 0,
  }));

  const programChartData = revenueByProgram.map((r) => ({
    label: `${r.month} '${String(r.year).slice(2)}`,
    CCM: Math.round((r.CCM || 0) / 100),
    RPM: Math.round((r.RPM || 0) / 100),
    BHI: Math.round((r.BHI || 0) / 100),
    PCM: Math.round((r.PCM || 0) / 100),
    RTM: Math.round((r.RTM || 0) / 100),
    APCM: Math.round((r.APCM || 0) / 100),
  }));

  const totalRevenue = revenueTrends.reduce((s, r) => s + r.totalRevenue, 0);
  const totalClaims = revenueTrends.reduce((s, r) => s + r.totalClaims, 0);
  const totalEnrolled = enrollmentTrends.length > 0 ? enrollmentTrends[enrollmentTrends.length - 1]?.enrolled || 0 : 0;
  const totalInactive = enrollmentTrends.length > 0 ? enrollmentTrends[enrollmentTrends.length - 1]?.inactive || 0 : 0;

  const avgRevenuePerMonth = revenueTrends.length > 0 ? totalRevenue / revenueTrends.length : 0;
  const latestRevenue = revenueTrends.length > 0 ? revenueTrends[revenueTrends.length - 1]?.totalRevenue || 0 : 0;
  const previousRevenue = revenueTrends.length > 1 ? revenueTrends[revenueTrends.length - 2]?.totalRevenue || 0 : 0;
  const revenueChange = previousRevenue > 0 ? ((latestRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : "0";

  const PROGRAM_COLORS: Record<string, string> = {
    CCM: "#2563eb", RPM: "#7c3aed", BHI: "#059669", PCM: "#d97706", RTM: "#dc2626", APCM: "#0891b2",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          {[1, 3, 6, 12].map((m) => (
            <Button key={m} variant={trendMonths === m ? "default" : "outline"} size="sm" onClick={() => setTrendMonths(m)}>
              {m} Month{m > 1 ? "s" : ""}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("revenue")}>
            <Download className="w-4 h-4 mr-1" /> Revenue CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("enrollments")}>
            <Download className="w-4 h-4 mr-1" /> Enrollment CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-sm text-slate-500">Total Revenue ({trendMonths}mo)</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatRevenue(totalRevenue)}</p>
            <p className="text-xs text-slate-400 mt-1">Avg {formatRevenue(avgRevenuePerMonth)}/mo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-slate-500">Month-over-Month</p>
            </div>
            <p className={`text-2xl font-bold ${Number(revenueChange) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {Number(revenueChange) >= 0 ? "+" : ""}{revenueChange}%
            </p>
            <p className="text-xs text-slate-400 mt-1">Latest: {formatRevenue(latestRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-slate-500">Total Claims ({trendMonths}mo)</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalClaims.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Avg {Math.round(totalClaims / (trendMonths || 1)).toLocaleString()}/mo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-600" />
              <p className="text-sm text-slate-500">Current Enrolled</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">{totalEnrolled.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{totalInactive.toLocaleString()} inactive</p>
          </CardContent>
        </Card>
      </div>

      {trendsLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading analytics...
        </div>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No revenue data available. Run a ThoroughCare sync first.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Revenue by Program</CardTitle></CardHeader>
            <CardContent>
              {programChartData.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No program data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={programChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="CCM" stackId="a" fill={PROGRAM_COLORS.CCM} name="CCM" />
                    <Bar dataKey="RPM" stackId="a" fill={PROGRAM_COLORS.RPM} name="RPM" />
                    <Bar dataKey="BHI" stackId="a" fill={PROGRAM_COLORS.BHI} name="BHI" />
                    <Bar dataKey="PCM" stackId="a" fill={PROGRAM_COLORS.PCM} name="PCM" />
                    <Bar dataKey="RTM" stackId="a" fill={PROGRAM_COLORS.RTM} name="RTM" />
                    <Bar dataKey="APCM" stackId="a" fill={PROGRAM_COLORS.APCM} name="APCM" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Enrollment Trend</CardTitle></CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No enrollment data available. Run a ThoroughCare sync first.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="enrolled" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Enrolled" />
                    <Line type="monotone" dataKey="inactive" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Inactive" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Claims Volume</CardTitle></CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No claims data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="claims" fill="#10b981" radius={[4, 4, 0, 0]} name="Claims" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {selectedPractice === "all" && practiceComparison.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Practice Comparison ({MONTH_NAMES[selectedMonth]} {currentYear})</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Practice</th>
                        <th className="text-right py-2 px-3 font-medium text-slate-600">Revenue</th>
                        <th className="text-right py-2 px-3 font-medium text-slate-600">Claims</th>
                        <th className="text-right py-2 px-3 font-medium text-slate-600">Enrolled</th>
                        <th className="text-right py-2 px-3 font-medium text-slate-600">Rev/Patient</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practiceComparison.map((p: any) => (
                        <tr key={p.practiceId} className="border-b hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium">{p.name}</td>
                          <td className="py-2 px-3 text-right text-green-600 font-medium">{formatRevenue(p.revenue)}</td>
                          <td className="py-2 px-3 text-right">{p.claims.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right">{p.enrolled.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right text-blue-600">{p.enrolled > 0 ? formatRevenue(Math.round(p.revenue / p.enrolled)) : "-"}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td className="py-2 px-3">Total</td>
                        <td className="py-2 px-3 text-right text-green-600">{formatRevenue(practiceComparison.reduce((s: number, p: any) => s + p.revenue, 0))}</td>
                        <td className="py-2 px-3 text-right">{practiceComparison.reduce((s: number, p: any) => s + p.claims, 0).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">{practiceComparison.reduce((s: number, p: any) => s + p.enrolled, 0).toLocaleString()}</td>
                        <td className="py-2 px-3 text-right text-blue-600">
                          {practiceComparison.reduce((s: number, p: any) => s + p.enrolled, 0) > 0
                            ? formatRevenue(Math.round(practiceComparison.reduce((s: number, p: any) => s + p.revenue, 0) / practiceComparison.reduce((s: number, p: any) => s + p.enrolled, 0)))
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedPractice === "all" && practiceComparison.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Revenue by Practice ({MONTH_NAMES[selectedMonth]} {currentYear})</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={Math.max(200, practiceComparison.length * 50)}>
                  <BarChart data={practiceComparison.map((p: any) => ({ name: p.name.length > 25 ? p.name.slice(0, 25) + "..." : p.name, revenue: Math.round(p.revenue / 100) }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                    <YAxis type="category" dataKey="name" fontSize={11} width={180} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [snapshots, setSnapshots] = useState<ProgramSnapshot[]>([]);
  const [revenue, setRevenue] = useState<RevenueSnapshot[]>([]);
  const [revenueByCode, setRevenueByCode] = useState<RevenueByCode[]>([]);
  const [codeDescriptions, setCodeDescriptions] = useState<Record<string, string>>({});
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
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
  const [practiceDetailId, setPracticeDetailId] = useState<number | null>(null);
  const [practiceStatusTab, setPracticeStatusTab] = useState<"active" | "inactive">("active");
  const [lynkPracticeId, setLynkPracticeId] = useState<number | null>(null);
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
        setRevenueByCode(dashData.revenueByCode || []);
        setCodeDescriptions(dashData.codeDescriptions || {});
        const lynk = (dashData.practices as Practice[]).find((p: Practice) => p.name.toLowerCase() === "your clinic");
        if (lynk) setLynkPracticeId(lynk.id);
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
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "billing", label: "Billing Codes", icon: Receipt },
    { id: "invoices", label: "Invoices", icon: FileCheck },
    { id: "inquiries", label: "Inquiries", icon: Mail },
    { id: "practices", label: "Practices", icon: Building2 },
    { id: "staffing", label: "Staffing", icon: Users },
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
          <div className="border-t border-slate-700 mt-3 pt-3">
            <Link href="/clinical/dashboard">
              <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-teal-300 hover:bg-slate-700 hover:text-teal-200 cursor-pointer">
                <HeartPulse className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>Clinical Platform</span>}
              </div>
            </Link>
          </div>
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
              {activeTab === "analytics" && "Analytics & Trends"}
              {activeTab === "billing" && "Billing Codes & Rates"}
              {activeTab === "invoices" && "Invoice Management"}
              {activeTab === "inquiries" && "Contact Inquiries"}
              {activeTab === "practices" && "Partner Practices"}
              {activeTab === "staffing" && "Staffing & FTE Report"}
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
                value={selectedPracticeId === "all" ? "all" : selectedDepartment !== "all" ? `dept:${selectedDepartment}` : String(selectedPracticeId)}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") {
                    setSelectedPracticeId("all");
                    setSelectedDepartment("all");
                  } else if (val.startsWith("dept:")) {
                    setSelectedPracticeId(lynkPracticeId!);
                    setSelectedDepartment(val.slice(5));
                  } else {
                    setSelectedPracticeId(Number(val));
                    setSelectedDepartment("all");
                  }
                }}
                className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700"
              >
                <option value="all">All Practices</option>
                {practices.filter(p => p.id !== lynkPracticeId).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
                {lynkPracticeId && departmentsByPractice[lynkPracticeId] && departmentsByPractice[lynkPracticeId].map((dept) => (
                  <option key={`dept:${dept}`} value={`dept:${dept}`}>{dept}</option>
                ))}
              </select>
              {selectedPracticeId !== "all" && selectedPracticeId !== lynkPracticeId && departmentsByPractice[selectedPracticeId] && departmentsByPractice[selectedPracticeId].length > 1 && (
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
                      filtered = snapshots.filter((s) => {
                        if (s.practiceId === lynkPracticeId) return !!s.department;
                        return !s.department;
                      });
                    } else if (selectedDepartment === "all") {
                      filtered = snapshots.filter((s) => s.practiceId === selectedPracticeId && !s.department);
                    } else {
                      filtered = snapshots.filter((s) => s.practiceId === selectedPracticeId && s.department === selectedDepartment);
                    }
                    const selectedName = selectedPracticeId === "all"
                      ? "All Practices"
                      : selectedDepartment !== "all" ? selectedDepartment
                      : practices.find((p) => p.id === selectedPracticeId)?.name || "";
                    return (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-blue-600">
                                {selectedPracticeId === "all"
                                  ? practices.filter(p => p.id !== lynkPracticeId).length + (lynkPracticeId && departmentsByPractice[lynkPracticeId] ? departmentsByPractice[lynkPracticeId].length : 0)
                                  : selectedDepartment !== "all" ? selectedDepartment : selectedName}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {selectedPracticeId === "all" ? "Partner Practices" : "Practice"}
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
                            filteredRevenue = revenue.filter((r) => {
                              if (r.practiceId === lynkPracticeId) return !!r.department;
                              return !r.department;
                            });
                          } else if (selectedDepartment === "all") {
                            filteredRevenue = revenue.filter((r) => r.practiceId === selectedPracticeId && !r.department);
                          } else {
                            filteredRevenue = revenue.filter((r) => r.practiceId === selectedPracticeId && r.department === selectedDepartment);
                          }
                          let filteredCodeRevenue: RevenueByCode[];
                          if (selectedPracticeId === "all") {
                            filteredCodeRevenue = revenueByCode.filter((r) => {
                              if (r.practiceId === lynkPracticeId) return !!r.department;
                              return !r.department;
                            });
                          } else if (selectedDepartment === "all") {
                            filteredCodeRevenue = revenueByCode.filter((r) => r.practiceId === selectedPracticeId && !r.department);
                          } else {
                            filteredCodeRevenue = revenueByCode.filter((r) => r.practiceId === selectedPracticeId && r.department === selectedDepartment);
                          }
                          const totalRev = filteredCodeRevenue.length > 0
                            ? filteredCodeRevenue.reduce((sum, r) => sum + (r.totalRevenue || 0), 0)
                            : filteredRevenue.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
                          const totalClaims = filteredCodeRevenue.length > 0
                            ? filteredCodeRevenue.reduce((sum, r) => sum + (r.claimCount || 0), 0)
                            : filteredRevenue.reduce((sum, r) => sum + (r.claimCount || 0), 0);

                          if (totalRev > 0 || totalClaims > 0) {
                            const aggregated = new Map<string, { programType: string; claimCount: number; totalRevenue: number; concatenated: number; nonConcatenated: number }>();
                            filteredRevenue.forEach((r) => {
                              const key = r.programType || "Unknown";
                              const existing = aggregated.get(key);
                              if (existing) {
                                existing.claimCount += r.claimCount || 0;
                                existing.totalRevenue += r.totalRevenue || 0;
                                existing.concatenated += r.concatenatedCount || 0;
                                existing.nonConcatenated += r.nonConcatenatedCount || 0;
                              } else {
                                aggregated.set(key, { programType: key, claimCount: r.claimCount || 0, totalRevenue: r.totalRevenue || 0, concatenated: r.concatenatedCount || 0, nonConcatenated: r.nonConcatenatedCount || 0 });
                              }
                            });
                            const programRevenue = Array.from(aggregated.values())
                              .filter(r => r.totalRevenue > 0)
                              .sort((a, b) => b.totalRevenue - a.totalRevenue);

                            const codesByProgram = new Map<string, Array<{ cptCode: string; claimCount: number; totalRevenue: number }>>();
                            filteredCodeRevenue.forEach((r) => {
                              const prog = r.programType || "Unknown";
                              if (!codesByProgram.has(prog)) codesByProgram.set(prog, []);
                              const arr = codesByProgram.get(prog)!;
                              const existing = arr.find(x => x.cptCode === r.cptCode);
                              if (existing) {
                                existing.claimCount += r.claimCount || 0;
                                existing.totalRevenue += r.totalRevenue || 0;
                              } else {
                                arr.push({ cptCode: r.cptCode || "Unknown", claimCount: r.claimCount || 0, totalRevenue: r.totalRevenue || 0 });
                              }
                            });

                            const toggleProgram = (prog: string) => {
                              setExpandedPrograms(prev => {
                                const next = new Set(prev);
                                if (next.has(prog)) next.delete(prog);
                                else next.add(prog);
                                return next;
                              });
                            };

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
                                      {(() => {
                                        const totalConcat = programRevenue.reduce((s, r) => s + r.concatenated, 0);
                                        const totalNonConcat = programRevenue.reduce((s, r) => s + r.nonConcatenated, 0);
                                        const totalActual = totalConcat + totalNonConcat;
                                        if (totalActual > 0) {
                                          return (
                                            <p className="text-xs text-slate-500 mt-0.5">
                                              <span className="inline-flex items-center gap-1 mr-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                                                {totalNonConcat.toLocaleString()} single-code
                                              </span>
                                              <span className="inline-flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                                                {totalConcat.toLocaleString()} multi-code
                                              </span>
                                            </p>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b border-slate-200">
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-left w-6"></th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-left">Program</th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Claims</th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Revenue</th>
                                          <th className="px-3 py-2 text-xs font-medium text-slate-500 text-right">Avg/Claim</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {programRevenue.map((r) => {
                                          const isExpanded = expandedPrograms.has(r.programType);
                                          const programCodes = (codesByProgram.get(r.programType) || [])
                                            .filter(c => c.totalRevenue > 0)
                                            .sort((a, b) => b.totalRevenue - a.totalRevenue);
                                          const hasDetails = programCodes.length > 0;
                                          const displayClaims = hasDetails
                                            ? programCodes.reduce((sum, c) => sum + c.claimCount, 0)
                                            : r.claimCount;
                                          const displayRevenue = hasDetails
                                            ? programCodes.reduce((sum, c) => sum + c.totalRevenue, 0)
                                            : r.totalRevenue;
                                          return (
                                            <>
                                              <tr
                                                key={r.programType}
                                                className={`border-b border-slate-100 ${hasDetails ? "cursor-pointer hover:bg-green-50/50" : ""}`}
                                                onClick={() => hasDetails && toggleProgram(r.programType)}
                                              >
                                                <td className="px-1 py-2 text-center w-6">
                                                  {hasDetails && (
                                                    isExpanded
                                                      ? <ChevronUp className="w-4 h-4 text-green-500 inline" />
                                                      : <ChevronDown className="w-4 h-4 text-slate-400 inline" />
                                                  )}
                                                </td>
                                                <td className="px-3 py-2 text-sm font-medium text-slate-700">{r.programType}</td>
                                                <td className="px-3 py-2 text-sm text-right text-slate-600">{displayClaims.toLocaleString()}</td>
                                                <td className="px-3 py-2 text-sm text-right font-semibold text-green-700">
                                                  ${(displayRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-3 py-2 text-sm text-right text-slate-500">
                                                  ${(displayClaims ? (displayRevenue / displayClaims / 100) : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                              </tr>
                                              {isExpanded && (
                                                <>
                                                  {(r.concatenated > 0 || r.nonConcatenated > 0) && (
                                                    <tr className="border-b border-slate-100 bg-blue-50/40">
                                                      <td className="py-1.5"></td>
                                                      <td colSpan={4} className="px-3 py-1.5 pl-8">
                                                        <div className="flex items-center gap-4 text-xs">
                                                          <span className="text-slate-500 font-medium">Claim Breakdown:</span>
                                                          <span className="inline-flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                                                            <span className="text-slate-600">{r.nonConcatenated.toLocaleString()} single-code</span>
                                                          </span>
                                                          <span className="inline-flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                                                            <span className="text-slate-600">{r.concatenated.toLocaleString()} multi-code (concatenated)</span>
                                                          </span>
                                                          {(r.concatenated + r.nonConcatenated) > 0 && (
                                                            <span className="text-slate-400 ml-1">
                                                              ({Math.round((r.concatenated / (r.concatenated + r.nonConcatenated)) * 100)}% concatenated)
                                                            </span>
                                                          )}
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  )}
                                                  {programCodes.map((c) => (
                                                    <tr key={`${r.programType}-${c.cptCode}`} className="border-b border-slate-50 bg-slate-50/50">
                                                      <td className="py-1.5"></td>
                                                      <td className="px-3 py-1.5 pl-8">
                                                        <span className="text-xs font-mono font-medium text-slate-600">{c.cptCode}</span>
                                                        <span className="text-xs text-slate-400 ml-2">{codeDescriptions[c.cptCode] || ""}</span>
                                                      </td>
                                                      <td className="px-3 py-1.5 text-xs text-right text-slate-500">{c.claimCount.toLocaleString()}</td>
                                                      <td className="px-3 py-1.5 text-xs text-right text-green-600">
                                                        ${(c.totalRevenue / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                      </td>
                                                      <td className="px-3 py-1.5 text-xs text-right text-slate-400">
                                                        ${(c.claimCount ? (c.totalRevenue / c.claimCount / 100) : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </>
                                              )}
                                            </>
                                          );
                                        })}
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

              {activeTab === "billing" && (
                <BillingCodesTab />
              )}

              {activeTab === "invoices" && <InvoicesTab />}

              {activeTab === "analytics" && <AnalyticsTab selectedMonth={currentMonth} currentYear={currentYear} selectedPractice={selectedPracticeId === "all" ? "all" : String(selectedPracticeId)} selectedDepartment={selectedDepartment} />}

              {activeTab === "staffing" && <StaffingTab practices={practices} currentMonth={currentMonth} currentYear={currentYear} lynkPracticeId={lynkPracticeId} departmentsByPractice={departmentsByPractice} />}

              {activeTab === "practices" && (() => {
                const otherPractices = practices.filter(p => p.id !== lynkPracticeId);
                const lynkDepts = lynkPracticeId && departmentsByPractice[lynkPracticeId] ? departmentsByPractice[lynkPracticeId] : [];

                if (practiceDetailId !== null) {
                  const detailPractice = practices.find(p => p.id === practiceDetailId);
                  if (!detailPractice) return null;
                  return <PracticeDetailView practice={detailPractice} onBack={() => setPracticeDetailId(null)} currentMonth={currentMonth} currentYear={currentYear} lynkPracticeId={lynkPracticeId} />;
                }

                const activePractices = otherPractices.filter(p => p.status === "active");
                const inactivePractices = otherPractices.filter(p => p.status !== "active");
                const showLynkDepts = practiceStatusTab === "active";
                const filteredPractices = practiceStatusTab === "active" ? activePractices : inactivePractices;
                const activeCount = activePractices.length + lynkDepts.length;
                const inactiveCount = inactivePractices.length;

                return (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Partner Practices</CardTitle>
                    <p className="text-xs text-slate-500">Click a practice to view details and manage billing rates.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 mb-4 border-b">
                      <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          practiceStatusTab === "active"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                        onClick={() => setPracticeStatusTab("active")}
                      >
                        Active ({activeCount})
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          practiceStatusTab === "inactive"
                            ? "border-blue-600 text-blue-700"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                        onClick={() => setPracticeStatusTab("inactive")}
                      >
                        Inactive ({inactiveCount})
                      </button>
                    </div>

                    {filteredPractices.length === 0 && (!showLynkDepts || lynkDepts.length === 0) ? (
                      <p className="text-sm text-slate-500 text-center py-6">
                        {practiceStatusTab === "active"
                          ? "No active practices found. Click \"Sync ThoroughCare\" on the Dashboard tab to pull practice data."
                          : "No inactive practices."}
                      </p>
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
                            {filteredPractices.map((p: any) => {
                              let depts: string[] = [];
                              try { depts = p.departments ? JSON.parse(p.departments) : []; } catch {}
                              return (
                                <tr key={p.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => setPracticeDetailId(p.id)}>
                                  <td className="py-2 px-3 font-medium text-blue-700 hover:underline">{p.name}</td>
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
                            {showLynkDepts && lynkDepts.map((dept) => (
                              <tr key={`lynk-${dept}`} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => lynkPracticeId && setPracticeDetailId(lynkPracticeId)}>
                                <td className="py-2 px-3 font-medium text-blue-700 hover:underline">{dept}</td>
                                <td className="py-2 px-3 text-slate-500">lynk</td>
                                <td className="py-2 px-3">—</td>
                                <td className="py-2 px-3">
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">active</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                );
              })()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { adminFetch } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Clock, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const PROGRAMS = [
  { value: "all", label: "All Programs" },
  { value: "CCM", label: "Chronic Care Management" },
  { value: "PCM", label: "Principal Care Management" },
  { value: "BHI", label: "Behavioral Health Integration" },
  { value: "RPM", label: "Remote Patient Monitoring" },
  { value: "RTM", label: "Remote Therapeutic Monitoring" },
  { value: "TCM", label: "Transitional Care Management" },
  { value: "APCM", label: "Advanced Primary Care Management" },
  { value: "AWV", label: "Annual Wellness Visit" },
];

interface WorklistItem {
  enrollment: {
    id: number;
    patientId: number;
    programType: string;
    status: string;
    enrolledAt: string;
    minutesThisMonth?: number;
    lastContactDate?: string;
  };
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    mrn: string;
    riskLevel: string;
    phone: string;
  };
}

export default function Worklists() {
  const [, params] = useRoute("/clinical/worklists/:programType");
  const [programFilter, setProgramFilter] = useState(params?.programType || "all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [programFilter, statusFilter, debouncedSearch]);

  const { data, isLoading } = useQuery<{ worklist: WorklistItem[]; total: number }>({
    queryKey: ["/api/clinical/worklists", programFilter, statusFilter, page, debouncedSearch],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page), limit: "25", status: statusFilter });
      if (programFilter !== "all") p.set("programType", programFilter);
      if (debouncedSearch) p.set("search", debouncedSearch);
      const res = await adminFetch(`/api/clinical/worklists?${p}`);
      return res.json();
    },
  });

  const worklist = data?.worklist || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 25);

  const getMinuteBadge = (minutes?: number) => {
    if (minutes === undefined || minutes === null) return <Badge variant="outline">0 min</Badge>;
    if (minutes >= 20) return <Badge className="bg-green-100 text-green-800">{minutes} min</Badge>;
    if (minutes >= 10) return <Badge className="bg-yellow-100 text-yellow-800">{minutes} min</Badge>;
    return <Badge className="bg-red-100 text-red-800">{minutes} min</Badge>;
  };

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = { low: "bg-green-100 text-green-800", medium: "bg-yellow-100 text-yellow-800", high: "bg-red-100 text-red-800" };
    return <Badge className={colors[level] || ""}>{level}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Program Worklists</h1>
          <p className="text-slate-500 text-sm mt-1">Manage enrolled patients by program</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="w-4 h-4" />
          <span>{total} enrolled patients</span>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search patients..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-[220px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="discharged">Discharged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-4 flex-wrap">
        {PROGRAMS.filter(p => p.value !== "all").map((p) => (
          <Button key={p.value} variant={programFilter === p.value ? "default" : "outline"} size="sm" onClick={() => setProgramFilter(programFilter === p.value ? "all" : p.value)}>
            {p.value}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading worklist...</div>
          ) : worklist.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No enrolled patients found matching your filters.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Minutes (Month)</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worklist.map((item) => (
                  <TableRow key={item.enrollment.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Link href={`/clinical/patients/${item.patient.id}`}>
                        <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                          {item.patient.lastName}, {item.patient.firstName}
                        </span>
                      </Link>
                      {item.patient.phone && <div className="text-xs text-slate-400">{item.patient.phone}</div>}
                    </TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">{item.patient.mrn || "—"}</TableCell>
                    <TableCell><Badge variant="outline">{item.enrollment.programType}</Badge></TableCell>
                    <TableCell>
                      <Badge className={item.enrollment.status === "active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}>
                        {item.enrollment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{getRiskBadge(item.patient.riskLevel)}</TableCell>
                    <TableCell>{getMinuteBadge(item.enrollment.minutesThisMonth)}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {item.enrollment.lastContactDate ? new Date(item.enrollment.lastContactDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(item.enrollment.enrolledAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500">Page {page} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

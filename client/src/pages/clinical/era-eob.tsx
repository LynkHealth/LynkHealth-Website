import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Eye, Trash2, Loader2, ChevronLeft, ArrowUpDown, AlertTriangle, CheckCircle2 } from "lucide-react";

const MONTHS_LIST = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_DISPLAY: Record<string, string> = {
  JAN: "January", FEB: "February", MAR: "March", APR: "April",
  MAY: "May", JUN: "June", JUL: "July", AUG: "August",
  SEP: "September", OCT: "October", NOV: "November", DEC: "December",
};

interface Practice {
  id: number;
  name: string;
  status?: string;
}

export default function ClinicalEraEob() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS_LIST[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedPractice, setSelectedPractice] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPractice, setUploadPractice] = useState<string>("");
  const [viewingUpload, setViewingUpload] = useState<number | null>(null);
  const [reconView, setReconView] = useState(false);
  const queryClient = useQueryClient();

  const { data: practicesData } = useQuery<{ success: boolean; practices: Practice[] }>({
    queryKey: ["/api/admin/practices"],
    queryFn: () => adminFetch("/api/admin/practices").then(r => r.json()),
  });

  const practices = (practicesData?.practices || []).filter(p => p.status !== "inactive");

  const practiceOptions = practices.map(p => ({
    key: String(p.id),
    value: String(p.id),
    name: p.name,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const { data: uploadsData, refetch: refetchUploads } = useQuery({
    queryKey: ["/api/admin/era/uploads", selectedPractice, selectedMonth, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams({ month: selectedMonth, year: String(selectedYear) });
      if (selectedPractice !== "all") params.set("practiceId", selectedPractice);
      const res = await adminFetch(`/api/admin/era/uploads?${params}`);
      return res.json();
    },
  });

  const { data: detailData } = useQuery({
    queryKey: ["/api/admin/era/uploads", viewingUpload],
    queryFn: async () => {
      if (!viewingUpload) return null;
      const res = await adminFetch(`/api/admin/era/uploads/${viewingUpload}`);
      return res.json();
    },
    enabled: viewingUpload !== null,
  });

  const { data: reconData } = useQuery({
    queryKey: ["/api/admin/era/reconciliation", selectedPractice, selectedMonth, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams({ month: selectedMonth, year: String(selectedYear) });
      if (selectedPractice !== "all") params.set("practiceId", selectedPractice);
      const res = await adminFetch(`/api/admin/era/reconciliation?${params}`);
      return res.json();
    },
    enabled: reconView,
  });

  const handleUpload = async () => {
    if (!uploadFile || !uploadPractice) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("practiceId", uploadPractice);
      formData.append("month", selectedMonth);
      formData.append("year", String(selectedYear));

      const token = localStorage.getItem("lynk_admin_token");
      const res = await fetch("/api/admin/era/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadFile(null);
        setUploadPractice("");
        refetchUploads();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this ERA upload and all its line items?")) return;
    try {
      await adminFetch(`/api/admin/era/uploads/${id}`, { method: "DELETE" });
      refetchUploads();
      if (viewingUpload === id) setViewingUpload(null);
    } catch {}
  };

  const uploads = uploadsData?.uploads || [];
  const detail = detailData?.lineItems || [];
  const detailUpload = detailData?.upload;
  const recon = reconData;

  if (viewingUpload && detailUpload) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">ERA/EOB Reconciliation</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => setViewingUpload(null)} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back to Uploads
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              {detailUpload.filename}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
              <span>Practice ID: {detailUpload.practiceId}</span>
              <span>{MONTH_DISPLAY[detailUpload.month] || detailUpload.month} {detailUpload.year}</span>
              <span>Claims: {detailUpload.totalClaims}</span>
              <span className={`font-medium ${detailUpload.status === "processed" ? "text-green-600" : "text-amber-600"}`}>
                {detailUpload.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-700">${((detailUpload.totalBilledCents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-blue-600">Total Billed</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-700">${((detailUpload.totalPaidCents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-green-600">Total Paid</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-amber-700">${((detailUpload.totalAdjustmentCents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-xs text-amber-600">Adjustments</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-slate-700">{detailUpload.matchedClaims}/{detail.length}</div>
                <div className="text-xs text-slate-600">Matched/Total Lines</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-2 px-2 font-medium">Patient</th>
                    <th className="text-left py-2 px-2 font-medium">CPT</th>
                    <th className="text-left py-2 px-2 font-medium">Program</th>
                    <th className="text-right py-2 px-2 font-medium">Billed</th>
                    <th className="text-right py-2 px-2 font-medium">Paid</th>
                    <th className="text-right py-2 px-2 font-medium">Expected</th>
                    <th className="text-right py-2 px-2 font-medium">Variance</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-left py-2 px-2 font-medium">Adj Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.map((li: any) => {
                    const variance = li.varianceCents || 0;
                    const hasVariance = variance !== 0;
                    return (
                      <tr key={li.id} className={`border-b hover:bg-slate-50 ${hasVariance ? "bg-amber-50/50" : ""}`}>
                        <td className="py-1.5 px-2">{li.patientName || "—"}</td>
                        <td className="py-1.5 px-2 font-mono">{li.cptCode}</td>
                        <td className="py-1.5 px-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            li.programType === "UNKNOWN" ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-700"
                          }`}>{li.programType}</span>
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono">${((li.billedCents || 0) / 100).toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-right font-mono">${((li.paidCents || 0) / 100).toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-right font-mono">{li.systemRevenueCents !== null ? `$${(li.systemRevenueCents / 100).toFixed(2)}` : "—"}</td>
                        <td className={`py-1.5 px-2 text-right font-mono font-medium ${variance > 0 ? "text-green-600" : variance < 0 ? "text-red-600" : "text-slate-400"}`}>
                          {li.varianceCents !== null ? `${variance > 0 ? "+" : ""}$${(variance / 100).toFixed(2)}` : "—"}
                        </td>
                        <td className="py-1.5 px-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            li.matchStatus === "matched" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}>{li.matchStatus}</span>
                        </td>
                        <td className="py-1.5 px-2 text-slate-500 max-w-[150px] truncate" title={li.adjustmentReason}>{li.adjustmentReason || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {detail.length === 0 && <p className="text-sm text-slate-500 text-center py-6">No line items found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ERA/EOB Reconciliation</h1>
          <p className="text-slate-500 text-sm mt-1">Upload and reconcile Electronic Remittance Advice files</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select className="border rounded px-3 py-1.5 text-sm" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {MONTHS_LIST.map(m => <option key={m} value={m}>{MONTH_DISPLAY[m]}</option>)}
        </select>
        <select className="border rounded px-3 py-1.5 text-sm" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="border rounded px-3 py-1.5 text-sm" value={selectedPractice} onChange={(e) => setSelectedPractice(e.target.value)}>
          <option value="all">All Practices</option>
          {practiceOptions.map(e => (
            <option key={e.key} value={e.value}>{e.name}</option>
          ))}
        </select>
        <Button
          variant={reconView ? "default" : "outline"}
          size="sm"
          className="gap-1.5 ml-auto"
          onClick={() => setReconView(!reconView)}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {reconView ? "Hide Reconciliation" : "View Reconciliation"}
        </Button>
      </div>

      {reconView && recon && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
              Reconciliation Summary — {MONTH_DISPLAY[selectedMonth]} {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-lg font-bold text-green-700">${recon.summary?.totalPaid?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</div>
                <div className="text-xs text-slate-500">Total Paid (ERA)</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-lg font-bold text-blue-700">${recon.summary?.totalSystemRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</div>
                <div className="text-xs text-slate-500">Expected (Fee Schedule)</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className={`text-lg font-bold ${(recon.summary?.totalVariance || 0) > 0 ? "text-green-600" : (recon.summary?.totalVariance || 0) < 0 ? "text-red-600" : "text-slate-700"}`}>
                  {(recon.summary?.totalVariance || 0) > 0 ? "+" : ""}${recon.summary?.totalVariance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                </div>
                <div className="text-xs text-slate-500">Variance</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                <div className="text-lg font-bold text-amber-700">{recon.summary?.discrepancyCount || 0}</div>
                <div className="text-xs text-slate-500">Lines with Discrepancy</div>
              </div>
            </div>

            {recon.discrepancies?.length > 0 && (
              <div className="overflow-x-auto">
                <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Discrepancies
                </h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-white">
                      <th className="text-left py-2 px-2 font-medium">Patient</th>
                      <th className="text-left py-2 px-2 font-medium">CPT</th>
                      <th className="text-left py-2 px-2 font-medium">Program</th>
                      <th className="text-right py-2 px-2 font-medium">Paid</th>
                      <th className="text-right py-2 px-2 font-medium">Expected</th>
                      <th className="text-right py-2 px-2 font-medium">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recon.discrepancies.slice(0, 50).map((d: any, i: number) => (
                      <tr key={i} className="border-b">
                        <td className="py-1.5 px-2">{d.patientName || "—"}</td>
                        <td className="py-1.5 px-2 font-mono">{d.cptCode}</td>
                        <td className="py-1.5 px-2">{d.programType}</td>
                        <td className="py-1.5 px-2 text-right font-mono">${d.paidDollars?.toFixed(2)}</td>
                        <td className="py-1.5 px-2 text-right font-mono">${d.systemRevenueDollars?.toFixed(2)}</td>
                        <td className={`py-1.5 px-2 text-right font-mono font-medium ${d.varianceDollars > 0 ? "text-green-600" : "text-red-600"}`}>
                          {d.varianceDollars > 0 ? "+" : ""}${d.varianceDollars?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recon.discrepancies.length > 50 && <p className="text-xs text-slate-500 mt-2">Showing first 50 of {recon.discrepancies.length} discrepancies.</p>}
              </div>
            )}
            {recon.discrepancies?.length === 0 && recon.summary?.lineCount > 0 && (
              <p className="text-sm text-green-600 text-center py-4 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> All matched line items reconcile with expected rates.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload ERA/EOB File
          </CardTitle>
          <p className="text-xs text-slate-500">Upload an X12 835 Electronic Remittance Advice file for parsing and reconciliation.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-slate-600 block mb-1">Practice</label>
              <select className="border rounded px-3 py-1.5 text-sm w-full" value={uploadPractice} onChange={(e) => setUploadPractice(e.target.value)}>
                <option value="">Select practice...</option>
                {practiceOptions.map(e => (
                  <option key={e.key} value={e.value}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-slate-600 block mb-1">835 File</label>
              <input
                type="file"
                accept=".835,.edi,.txt,.x12"
                className="border rounded px-3 py-1.5 text-sm w-full"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              size="sm"
              disabled={!uploadFile || !uploadPractice || uploading}
              onClick={handleUpload}
              className="gap-1.5"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploading ? "Processing..." : "Upload & Parse"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upload History — {MONTH_DISPLAY[selectedMonth]} {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left py-2 px-3 font-medium">Filename</th>
                  <th className="text-left py-2 px-3 font-medium">Practice</th>
                  <th className="text-right py-2 px-3 font-medium">Claims</th>
                  <th className="text-right py-2 px-3 font-medium">Paid</th>
                  <th className="text-right py-2 px-3 font-medium">Billed</th>
                  <th className="text-center py-2 px-3 font-medium">Matched</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                  <th className="text-left py-2 px-3 font-medium">Uploaded</th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((u: any) => {
                  const practice = practices.find(p => p.id === u.practiceId);
                  return (
                    <tr key={u.id} className="border-b hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-blue-700 hover:underline cursor-pointer" onClick={() => setViewingUpload(u.id)}>
                        {u.filename}
                      </td>
                      <td className="py-2 px-3 text-slate-600">{u.department || practice?.name || `ID ${u.practiceId}`}</td>
                      <td className="py-2 px-3 text-right">{u.totalClaims}</td>
                      <td className="py-2 px-3 text-right font-mono">${((u.totalPaidCents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right font-mono">${((u.totalBilledCents || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="text-green-600">{u.matchedClaims}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600">{(u.matchedClaims || 0) + (u.unmatchedClaims || 0)}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          u.status === "processed" ? "bg-green-100 text-green-700" :
                          u.status === "parse_errors" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{u.status}</span>
                      </td>
                      <td className="py-2 px-3 text-xs text-slate-500">
                        {u.uploadedAt ? new Date(u.uploadedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewingUpload(u.id)} className="h-7 w-7 p-0">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)} className="h-7 w-7 p-0 text-red-500 hover:text-red-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {uploads.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">
                No ERA/EOB files uploaded for {MONTH_DISPLAY[selectedMonth]} {selectedYear}. Upload a file above to begin reconciliation.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

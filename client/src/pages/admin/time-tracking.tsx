import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-auth";
import { Clock, Plus, Trash2, Loader2, BarChart3 } from "lucide-react";

interface TimeEntry {
  id: number;
  callSessionId: number | null;
  clinicianId: number;
  practiceId: number | null;
  programType: string;
  date: string;
  durationMinutes: number;
  notes: string | null;
  createdAt: string;
}

interface TimeReport {
  totalMinutes: number;
  totalEntries: number;
  byProgram: Record<string, { totalMinutes: number; count: number }>;
  byDate: Record<string, { totalMinutes: number; count: number }>;
}

interface TimeTrackingPageProps {
  practices: { id: number; name: string }[];
}

const PROGRAM_TYPES = ["CCM", "PCM", "BHI", "RPM", "RTM", "APCM", "CCCM", "CCO", "AWV"];

export default function TimeTrackingPage({ practices }: TimeTrackingPageProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [report, setReport] = useState<TimeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formProgram, setFormProgram] = useState("");
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [formMinutes, setFormMinutes] = useState("");
  const [formPractice, setFormPractice] = useState<number | "">("");
  const [formNotes, setFormNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/time-entries");
      const data = await res.json();
      if (data.success) setEntries(data.entries);
    } catch (err) {
      console.error("Failed to load time entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async () => {
    try {
      const res = await adminFetch("/api/admin/time-entries/report");
      const data = await res.json();
      if (data.success) {
        setReport(data);
        setShowReport(true);
      }
    } catch (err) {
      console.error("Failed to load report:", err);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!formProgram) return setFormError("Program type is required");
    if (!formDate) return setFormError("Date is required");
    if (!formMinutes || parseInt(formMinutes) < 1) return setFormError("Duration must be at least 1 minute");

    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/time-entries", {
        method: "POST",
        body: JSON.stringify({
          programType: formProgram,
          date: formDate,
          durationMinutes: parseInt(formMinutes),
          practiceId: formPractice || undefined,
          notes: formNotes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setFormProgram("");
        setFormMinutes("");
        setFormNotes("");
        setFormError(null);
        loadEntries();
      } else {
        setFormError(data.message);
      }
    } catch (err) {
      setFormError("Failed to create time entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this time entry?")) return;
    try {
      await adminFetch(`/api/admin/time-entries/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Time Tracking</h2>
          <p className="text-sm text-slate-500">Log and track time spent on patient calls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadReport} className="gap-2 text-xs">
            <BarChart3 className="w-4 h-4" />
            Report
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Log Time
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
            <p className="text-xs text-slate-500">Total Entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {totalHours}h {remainingMins}m
            </p>
            <p className="text-xs text-slate-500">Total Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {entries.length > 0 ? Math.round(totalMinutes / entries.length) : 0}m
            </p>
            <p className="text-xs text-slate-500">Avg per Entry</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">
              {new Set(entries.map((e) => e.programType)).size}
            </p>
            <p className="text-xs text-slate-500">Programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">Log Time Entry</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {formError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{formError}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Program *</label>
                <select
                  value={formProgram}
                  onChange={(e) => setFormProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
                >
                  <option value="">Select...</option>
                  {PROGRAM_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Date *</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={formMinutes}
                  onChange={(e) => setFormMinutes(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Practice</label>
                <select
                  value={formPractice}
                  onChange={(e) => setFormPractice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
                >
                  <option value="">Select...</option>
                  {practices.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Notes</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes..."
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-y"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report view */}
      {showReport && report && (
        <Card className="border-purple-200">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Time Summary Report
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowReport(false)}>Close</Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">By Program</h4>
                <div className="space-y-2">
                  {Object.entries(report.byProgram)
                    .sort(([, a], [, b]) => b.totalMinutes - a.totalMinutes)
                    .map(([program, data]) => (
                      <div key={program} className="flex items-center justify-between text-sm">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{program}</span>
                        <span className="text-slate-600">
                          {Math.floor(data.totalMinutes / 60)}h {data.totalMinutes % 60}m ({data.count} entries)
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Recent Days</h4>
                <div className="space-y-2">
                  {Object.entries(report.byDate)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 10)
                    .map(([date, data]) => (
                      <div key={date} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{new Date(date + "T12:00:00").toLocaleDateString()}</span>
                        <span className="text-slate-600">
                          {Math.floor(data.totalMinutes / 60)}h {data.totalMinutes % 60}m ({data.count})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No time entries yet.</p>
            <p className="text-sm text-slate-400 mt-1">Log time manually or it will be auto-tracked from call recordings.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Program</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Duration</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Notes</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">
                        {new Date(entry.date + "T12:00:00").toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{entry.programType}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{entry.durationMinutes}m</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{entry.notes || "—"}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

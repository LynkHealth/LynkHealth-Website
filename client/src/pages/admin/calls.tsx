import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminFetch } from "@/lib/admin-auth";
import CallRecorder from "@/components/admin/CallRecorder";
import {
  Mic, FileText, Clock, CheckCircle2, AlertCircle, Loader2,
  ChevronLeft, Plus, Pen, Save, ArrowRight, Upload, Download,
} from "lucide-react";

interface CallSession {
  id: number;
  clinicianId: number;
  practiceId: number | null;
  patientReference: string | null;
  programType: string | null;
  callStartedAt: string;
  callEndedAt: string | null;
  durationSeconds: number | null;
  status: string;
  createdAt: string;
}

interface Transcript {
  id: number;
  callSessionId: number;
  content: string;
  segments: string | null;
  provider: string | null;
  confidenceScore: string | null;
}

interface SoapNote {
  id: number;
  callSessionId: number;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: string;
  aiModel: string | null;
  signedAt: string | null;
}

type ViewMode = "list" | "new-call" | "import" | "import-bulk" | "detail";

interface CallsPageProps {
  practices: { id: number; name: string }[];
}

const PROGRAM_TYPES = ["CCM", "PCM", "BHI", "RPM", "RTM", "APCM", "CCCM", "CCO", "AWV"];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    recording: "bg-red-100 text-red-700",
    transcribing: "bg-yellow-100 text-yellow-700",
    generating: "bg-blue-100 text-blue-700",
    review: "bg-orange-100 text-orange-700",
    signed: "bg-green-100 text-green-700",
    amended: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default function CallsPage({ practices }: CallsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sessions, setSessions] = useState<CallSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<CallSession | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<{ transcriptionAvailable: boolean; soapGenerationAvailable: boolean } | null>(null);

  // New call form state
  const [newCallPatient, setNewCallPatient] = useState("");
  const [newCallProgram, setNewCallProgram] = useState("");
  const [newCallPractice, setNewCallPractice] = useState<number | "">("");
  const [activeCallId, setActiveCallId] = useState<number | null>(null);
  const [callTimer, setCallTimer] = useState(0);

  // SOAP editing state
  const [editingSoap, setEditingSoap] = useState(false);
  const [soapForm, setSoapForm] = useState({ subjective: "", objective: "", assessment: "", plan: "" });

  // Manual transcript state
  const [manualTranscript, setManualTranscript] = useState("");

  // Import state
  const [importPatient, setImportPatient] = useState("");
  const [importProgram, setImportProgram] = useState("");
  const [importPractice, setImportPractice] = useState<number | "">("");
  const [importDate, setImportDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [importDuration, setImportDuration] = useState("");
  const [importTranscript, setImportTranscript] = useState("");
  const [importSubjective, setImportSubjective] = useState("");
  const [importObjective, setImportObjective] = useState("");
  const [importAssessment, setImportAssessment] = useState("");
  const [importPlan, setImportPlan] = useState("");

  // Bulk import state
  const [bulkJson, setBulkJson] = useState("");
  const [bulkResults, setBulkResults] = useState<{ imported: number; failed: number; total: number } | null>(null);

  useEffect(() => {
    loadSessions();
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await adminFetch("/api/admin/ambient/config");
      const data = await res.json();
      if (data.success) setConfig(data);
    } catch {}
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/calls");
      const data = await res.json();
      if (data.success) setSessions(data.sessions);
    } catch (err) {
      console.error("Failed to load call sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/calls/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedSession(data.session);
        setTranscript(data.transcript);
        setSoapNote(data.soapNote);
        if (data.soapNote) {
          setSoapForm({
            subjective: data.soapNote.subjective,
            objective: data.soapNote.objective,
            assessment: data.soapNote.assessment,
            plan: data.soapNote.plan,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load session detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = async () => {
    setError(null);
    try {
      const res = await adminFetch("/api/admin/calls", {
        method: "POST",
        body: JSON.stringify({
          patientReference: newCallPatient || undefined,
          programType: newCallProgram || undefined,
          practiceId: newCallPractice || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveCallId(data.session.id);
        setSelectedSession(data.session);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to create call session");
    }
  };

  const handleEndCall = async () => {
    if (!activeCallId) return;
    try {
      const res = await adminFetch(`/api/admin/calls/${activeCallId}/end`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setSelectedSession((prev) => prev ? { ...prev, status: "transcribing", durationSeconds: data.durationSeconds, callEndedAt: new Date().toISOString() } : prev);
      }
    } catch (err) {
      setError("Failed to end call session");
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, durationSeconds: number) => {
    if (!activeCallId) return;

    // First end the call
    await handleEndCall();

    // Then transcribe
    setProcessing(true);
    setError(null);

    try {
      if (config?.transcriptionAvailable) {
        // Send audio for automatic transcription
        const res = await adminFetch(`/api/admin/calls/${activeCallId}/transcribe`, {
          method: "POST",
          headers: { "Content-Type": audioBlob.type },
          body: audioBlob,
        });
        const data = await res.json();
        if (data.success) {
          setTranscript(data.transcript);
          setSelectedSession((prev) => prev ? { ...prev, status: "generating" } : prev);
          // Auto-generate SOAP note
          await handleGenerateSoap(activeCallId);
        } else {
          setError(data.message || "Transcription failed");
        }
      } else {
        // No transcription provider -- switch to manual entry
        setSelectedSession((prev) => prev ? { ...prev, status: "transcribing" } : prev);
      }
    } catch (err: any) {
      setError(err.message || "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleManualTranscript = async () => {
    if (!activeCallId || !manualTranscript.trim()) return;
    setProcessing(true);
    setError(null);

    try {
      const res = await adminFetch(`/api/admin/calls/${activeCallId}/transcribe`, {
        method: "POST",
        body: JSON.stringify({ text: manualTranscript }),
      });
      const data = await res.json();
      if (data.success) {
        setTranscript(data.transcript);
        setSelectedSession((prev) => prev ? { ...prev, status: "generating" } : prev);
        await handleGenerateSoap(activeCallId);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to save transcript");
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateSoap = async (callId: number) => {
    setProcessing(true);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/calls/${callId}/generate-soap`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSoapNote(data.soapNote);
        setSoapForm({
          subjective: data.soapNote.subjective,
          objective: data.soapNote.objective,
          assessment: data.soapNote.assessment,
          plan: data.soapNote.plan,
        });
        setSelectedSession((prev) => prev ? { ...prev, status: "review" } : prev);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to generate SOAP note");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveSoap = async () => {
    if (!selectedSession) return;
    setProcessing(true);
    try {
      const res = await adminFetch(`/api/admin/calls/${selectedSession.id}/soap`, {
        method: "PUT",
        body: JSON.stringify(soapForm),
      });
      const data = await res.json();
      if (data.success) {
        setSoapNote((prev) => prev ? { ...prev, ...soapForm, status: "reviewed" } : prev);
        setEditingSoap(false);
      }
    } catch (err) {
      setError("Failed to save SOAP note");
    } finally {
      setProcessing(false);
    }
  };

  const handleSignSoap = async () => {
    if (!selectedSession) return;
    setProcessing(true);
    try {
      const res = await adminFetch(`/api/admin/calls/${selectedSession.id}/sign`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setSoapNote((prev) => prev ? { ...prev, status: "signed", signedAt: new Date().toISOString() } : prev);
        setSelectedSession((prev) => prev ? { ...prev, status: "signed" } : prev);
      }
    } catch (err) {
      setError("Failed to sign SOAP note");
    } finally {
      setProcessing(false);
    }
  };

  const resetNewCall = () => {
    setActiveCallId(null);
    setSelectedSession(null);
    setTranscript(null);
    setSoapNote(null);
    setNewCallPatient("");
    setNewCallProgram("");
    setNewCallPractice("");
    setManualTranscript("");
    setCallTimer(0);
    setEditingSoap(false);
    setError(null);
  };

  const resetImport = () => {
    setImportPatient("");
    setImportProgram("");
    setImportPractice("");
    setImportDate(new Date().toISOString().split("T")[0]);
    setImportDuration("");
    setImportTranscript("");
    setImportSubjective("");
    setImportObjective("");
    setImportAssessment("");
    setImportPlan("");
    setBulkJson("");
    setBulkResults(null);
    setError(null);
  };

  const handleImportSingle = async () => {
    setProcessing(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/calls/import", {
        method: "POST",
        body: JSON.stringify({
          patientReference: importPatient || undefined,
          programType: importProgram || undefined,
          practiceId: importPractice || undefined,
          callDate: importDate || undefined,
          durationMinutes: importDuration ? parseInt(importDuration) : undefined,
          transcript: importTranscript || undefined,
          subjective: importSubjective || undefined,
          objective: importObjective || undefined,
          assessment: importAssessment || undefined,
          plan: importPlan || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Show the imported record
        setSelectedSession(data.session);
        setTranscript(data.transcript);
        setSoapNote(data.soapNote);
        if (data.soapNote) {
          setSoapForm({
            subjective: data.soapNote.subjective,
            objective: data.soapNote.objective,
            assessment: data.soapNote.assessment,
            plan: data.soapNote.plan,
          });
        }
        setViewMode("detail");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to import record");
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkImport = async () => {
    setProcessing(true);
    setError(null);
    setBulkResults(null);
    try {
      let records: any[];
      try {
        const parsed = JSON.parse(bulkJson);
        records = Array.isArray(parsed) ? parsed : parsed.records || [parsed];
      } catch {
        setError("Invalid JSON format. Paste a JSON array of records.");
        setProcessing(false);
        return;
      }

      const res = await adminFetch("/api/admin/calls/import-bulk", {
        method: "POST",
        body: JSON.stringify({ records }),
      });
      const data = await res.json();
      if (data.success) {
        setBulkResults({ imported: data.imported, failed: data.failed, total: data.total });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to process bulk import");
    } finally {
      setProcessing(false);
    }
  };

  // ============================
  // RENDER: Call List
  // ============================
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Call Recordings</h2>
            <p className="text-sm text-slate-500">Record calls, import from CareCo, and manage SOAP notes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { resetImport(); setViewMode("import"); }} className="gap-2">
              <Upload className="w-4 h-4" />
              Import from CareCo
            </Button>
            <Button variant="outline" onClick={() => { resetImport(); setViewMode("import-bulk"); }} className="gap-2 text-xs">
              <Download className="w-4 h-4" />
              Bulk Import
            </Button>
            <Button onClick={() => { resetNewCall(); setViewMode("new-call"); }} className="gap-2">
              <Plus className="w-4 h-4" />
              New Call
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mic className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No call recordings yet.</p>
              <p className="text-sm text-slate-400 mt-1">Import from CareCo or start a new call to record directly.</p>
              <div className="flex gap-3 justify-center mt-4">
                <Button variant="outline" onClick={() => { resetImport(); setViewMode("import"); }} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import from CareCo
                </Button>
                <Button onClick={() => { resetNewCall(); setViewMode("new-call"); }} className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Call
                </Button>
              </div>
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
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => { setViewMode("detail"); loadSessionDetail(s.id); }}>
                        <td className="py-3 px-4 text-slate-700">{formatDate(s.callStartedAt)}</td>
                        <td className="py-3 px-4 text-slate-700">{s.patientReference || "—"}</td>
                        <td className="py-3 px-4">
                          {s.programType ? (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{s.programType}</span>
                          ) : "—"}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{s.durationSeconds ? formatDuration(s.durationSeconds) : "—"}</td>
                        <td className="py-3 px-4"><StatusBadge status={s.status} /></td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            View <ArrowRight className="w-3 h-3" />
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

  // ============================
  // RENDER: New Call
  // ============================
  if (viewMode === "new-call") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { resetNewCall(); setViewMode("list"); loadSessions(); }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-slate-800">
            {activeCallId ? "Call in Progress" : "New Call"}
          </h2>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setError(null)}>Dismiss</Button>
            </CardContent>
          </Card>
        )}

        {/* Call setup form (before recording starts) */}
        {!activeCallId && (
          <Card>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base">Call Details</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Patient Reference (optional)</label>
                <input
                  type="text"
                  value={newCallPatient}
                  onChange={(e) => setNewCallPatient(e.target.value)}
                  placeholder="Patient name or MRN"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Program Type</label>
                  <select
                    value={newCallProgram}
                    onChange={(e) => setNewCallProgram(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
                  >
                    <option value="">Select program...</option>
                    {PROGRAM_TYPES.map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Practice</label>
                  <select
                    value={newCallPractice}
                    onChange={(e) => setNewCallPractice(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
                  >
                    <option value="">Select practice...</option>
                    {practices.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={handleStartCall} className="w-full gap-2 mt-2" size="lg">
                <Mic className="w-5 h-5" />
                Start Call Session
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Active call: recorder + processing */}
        {activeCallId && (
          <>
            {selectedSession && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-4 text-sm">
                    {selectedSession.patientReference && (
                      <span className="text-blue-800">
                        <span className="font-medium">Patient:</span> {selectedSession.patientReference}
                      </span>
                    )}
                    {selectedSession.programType && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{selectedSession.programType}</span>
                    )}
                    <StatusBadge status={selectedSession.status} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Record */}
            {selectedSession?.status === "recording" && (
              <CallRecorder
                callSessionId={activeCallId}
                onRecordingComplete={handleRecordingComplete}
                onTimerUpdate={setCallTimer}
              />
            )}

            {/* Processing indicator */}
            {processing && (
              <Card>
                <CardContent className="py-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">
                    {selectedSession?.status === "transcribing" ? "Transcribing audio..." :
                     selectedSession?.status === "generating" ? "Generating SOAP note..." :
                     "Processing..."}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Manual transcript entry (when no transcription provider) */}
            {!processing && selectedSession?.status === "transcribing" && !transcript && (
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base">Enter Transcript</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {!config?.transcriptionAvailable && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                      Automatic transcription is not configured. Enter the transcript manually below.
                    </p>
                  )}
                  <textarea
                    value={manualTranscript}
                    onChange={(e) => setManualTranscript(e.target.value)}
                    placeholder="Paste or type the call transcript here..."
                    rows={10}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-y"
                  />
                  <Button
                    onClick={handleManualTranscript}
                    disabled={!manualTranscript.trim()}
                    className="gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Submit Transcript
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review transcript & SOAP note */}
            {!processing && transcript && (
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcript
                    {transcript.provider && (
                      <span className="text-xs font-normal text-slate-400">via {transcript.provider}</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-lg p-3 max-h-60 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap">
                    {transcript.content}
                  </div>
                </CardContent>
              </Card>
            )}

            {!processing && soapNote && (
              <SoapNoteCard
                soapNote={soapNote}
                soapForm={soapForm}
                editing={editingSoap}
                onEdit={() => setEditingSoap(true)}
                onSave={handleSaveSoap}
                onSign={handleSignSoap}
                onChange={(field, value) => setSoapForm((prev) => ({ ...prev, [field]: value }))}
                processing={processing}
              />
            )}

            {/* Generate SOAP button if transcript exists but no SOAP note */}
            {!processing && transcript && !soapNote && (
              <Button onClick={() => handleGenerateSoap(activeCallId)} className="gap-2">
                <FileText className="w-4 h-4" />
                Generate SOAP Note
              </Button>
            )}

            {/* Done / Back to list */}
            {soapNote?.status === "signed" && (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-slate-600">SOAP note signed and finalized.</p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => { resetNewCall(); setViewMode("list"); loadSessions(); }}
                >
                  Back to Call List
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ============================
  // RENDER: Import from CareCo (Single)
  // ============================
  if (viewMode === "import") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { resetImport(); setViewMode("list"); loadSessions(); }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-slate-800">Import from CareCo</h2>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setError(null)}>Dismiss</Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">Call Details</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Patient Reference</label>
                <input
                  type="text"
                  value={importPatient}
                  onChange={(e) => setImportPatient(e.target.value)}
                  placeholder="Patient name or MRN"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Program Type</label>
                <select
                  value={importProgram}
                  onChange={(e) => setImportProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
                >
                  <option value="">Select program...</option>
                  {PROGRAM_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Call Date</label>
                <input
                  type="date"
                  value={importDate}
                  onChange={(e) => setImportDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={importDuration}
                  onChange={(e) => setImportDuration(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Practice</label>
              <select
                value={importPractice}
                onChange={(e) => setImportPractice(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white"
              >
                <option value="">Select practice...</option>
                {practices.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">Transcript (from CareCo)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <textarea
              value={importTranscript}
              onChange={(e) => setImportTranscript(e.target.value)}
              placeholder="Paste the CareCo transcript here..."
              rows={8}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-y"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">SOAP Note (from CareCo)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="border-l-4 border-l-blue-500 pl-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Subjective</label>
              <textarea
                value={importSubjective}
                onChange={(e) => setImportSubjective(e.target.value)}
                placeholder="Patient's reported symptoms, complaints, history..."
                rows={3}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm resize-y"
              />
            </div>
            <div className="border-l-4 border-l-green-500 pl-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Objective</label>
              <textarea
                value={importObjective}
                onChange={(e) => setImportObjective(e.target.value)}
                placeholder="Observable findings, vitals, exam results..."
                rows={3}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm resize-y"
              />
            </div>
            <div className="border-l-4 border-l-orange-500 pl-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Assessment</label>
              <textarea
                value={importAssessment}
                onChange={(e) => setImportAssessment(e.target.value)}
                placeholder="Clinical impressions, diagnoses..."
                rows={3}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm resize-y"
              />
            </div>
            <div className="border-l-4 border-l-purple-500 pl-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Plan</label>
              <textarea
                value={importPlan}
                onChange={(e) => setImportPlan(e.target.value)}
                placeholder="Treatment plan, medications, follow-up..."
                rows={3}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm resize-y"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handleImportSingle}
            disabled={processing}
            className="gap-2"
            size="lg"
          >
            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            Import Record
          </Button>
          <Button
            variant="outline"
            onClick={() => { resetImport(); setViewMode("list"); }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ============================
  // RENDER: Bulk Import
  // ============================
  if (viewMode === "import-bulk") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { resetImport(); setViewMode("list"); loadSessions(); }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-slate-800">Bulk Import from CareCo</h2>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setError(null)}>Dismiss</Button>
            </CardContent>
          </Card>
        )}

        {bulkResults && (
          <Card className={bulkResults.failed > 0 ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={`w-5 h-5 ${bulkResults.failed > 0 ? "text-amber-600" : "text-green-600"}`} />
                <span className="font-medium text-sm">
                  Import complete: {bulkResults.imported} of {bulkResults.total} records imported
                </span>
              </div>
              {bulkResults.failed > 0 && (
                <p className="text-xs text-amber-700">{bulkResults.failed} records failed to import.</p>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => { resetImport(); setViewMode("list"); loadSessions(); }}
              >
                View All Records
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">Paste JSON Data</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-slate-500">
              Paste a JSON array of records from CareCo. Each record can include:
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">patientReference</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">programType</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">callDate</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">durationMinutes</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">transcript</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">subjective</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">objective</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">assessment</code>,
              <code className="mx-1 text-xs bg-slate-100 px-1 rounded">plan</code>
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">Show example JSON</summary>
              <pre className="mt-2 bg-slate-50 p-3 rounded-lg overflow-x-auto text-slate-700">{`[
  {
    "patientReference": "John Smith",
    "programType": "CCM",
    "callDate": "2026-02-15",
    "durationMinutes": 25,
    "transcript": "Full call transcript text here...",
    "subjective": "Patient reports improved blood pressure...",
    "objective": "BP 128/82, HR 72, weight stable at 185 lbs...",
    "assessment": "Hypertension - well controlled on current regimen...",
    "plan": "Continue current medications. Follow up in 30 days..."
  },
  {
    "patientReference": "Jane Doe",
    "programType": "BHI",
    "callDate": "2026-02-14",
    "durationMinutes": 18,
    "transcript": "Another transcript...",
    "subjective": "...",
    "objective": "...",
    "assessment": "...",
    "plan": "..."
  }
]`}</pre>
            </details>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder='[{"patientReference": "...", "programType": "CCM", ...}]'
              rows={12}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm font-mono resize-y"
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handleBulkImport}
            disabled={processing || !bulkJson.trim()}
            className="gap-2"
            size="lg"
          >
            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {processing ? "Importing..." : "Import All Records"}
          </Button>
          <Button
            variant="outline"
            onClick={() => { resetImport(); setViewMode("list"); }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // ============================
  // RENDER: Detail View
  // ============================
  if (viewMode === "detail" && selectedSession) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setViewMode("list"); setSelectedSession(null); setTranscript(null); setSoapNote(null); setEditingSoap(false); }}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-slate-800">Call Detail</h2>
          <StatusBadge status={selectedSession.status} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </CardContent>
              </Card>
            )}

            {/* Call info */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="font-medium">{formatDate(selectedSession.callStartedAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Duration</p>
                    <p className="font-medium">{selectedSession.durationSeconds ? formatDuration(selectedSession.durationSeconds) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Patient</p>
                    <p className="font-medium">{selectedSession.patientReference || "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Program</p>
                    <p className="font-medium">{selectedSession.programType || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript */}
            {transcript && (
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcript
                    {transcript.provider && (
                      <span className="text-xs font-normal text-slate-400">via {transcript.provider}</span>
                    )}
                    {transcript.confidenceScore && (
                      <span className="text-xs font-normal text-slate-400">
                        ({(parseFloat(transcript.confidenceScore) * 100).toFixed(0)}% confidence)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-lg p-3 max-h-60 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap">
                    {transcript.content}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SOAP Note */}
            {soapNote && (
              <SoapNoteCard
                soapNote={soapNote}
                soapForm={soapForm}
                editing={editingSoap}
                onEdit={() => setEditingSoap(true)}
                onSave={handleSaveSoap}
                onSign={handleSignSoap}
                onChange={(field, value) => setSoapForm((prev) => ({ ...prev, [field]: value }))}
                processing={processing}
              />
            )}

            {/* Generate SOAP for old sessions without one */}
            {transcript && !soapNote && !processing && (
              <Button onClick={() => handleGenerateSoap(selectedSession.id)} className="gap-2">
                <FileText className="w-4 h-4" />
                Generate SOAP Note
              </Button>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}

// ============================
// SOAP Note Card Component
// ============================

function SoapNoteCard({
  soapNote,
  soapForm,
  editing,
  onEdit,
  onSave,
  onSign,
  onChange,
  processing,
}: {
  soapNote: SoapNote;
  soapForm: { subjective: string; objective: string; assessment: string; plan: string };
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onSign: () => void;
  onChange: (field: string, value: string) => void;
  processing: boolean;
}) {
  const sections: { key: keyof typeof soapForm; label: string; color: string }[] = [
    { key: "subjective", label: "Subjective", color: "border-l-blue-500" },
    { key: "objective", label: "Objective", color: "border-l-green-500" },
    { key: "assessment", label: "Assessment", color: "border-l-orange-500" },
    { key: "plan", label: "Plan", color: "border-l-purple-500" },
  ];

  const isSigned = soapNote.status === "signed";

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            SOAP Note
            <StatusBadge status={soapNote.status} />
            {soapNote.aiModel && soapNote.aiModel !== "manual" && (
              <span className="text-xs font-normal text-slate-400">AI-generated</span>
            )}
          </CardTitle>
          {!isSigned && !editing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit} className="gap-1 text-xs">
                <Pen className="w-3 h-3" />
                Edit
              </Button>
              <Button size="sm" onClick={onSign} disabled={processing} className="gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3" />
                Sign
              </Button>
            </div>
          )}
          {editing && (
            <Button size="sm" onClick={onSave} disabled={processing} className="gap-1 text-xs">
              {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {soapNote.aiModel && soapNote.aiModel !== "manual" && !isSigned && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
            This note was generated by AI. Please review for accuracy before signing.
          </p>
        )}
        {sections.map(({ key, label, color }) => (
          <div key={key} className={`border-l-4 ${color} pl-3`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            {editing && !isSigned ? (
              <textarea
                value={soapForm[key]}
                onChange={(e) => onChange(key, e.target.value)}
                rows={3}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm resize-y"
              />
            ) : (
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{soapForm[key] || soapNote[key]}</p>
            )}
          </div>
        ))}
        {soapNote.signedAt && (
          <p className="text-xs text-green-600 mt-2">Signed on {formatDate(soapNote.signedAt)}</p>
        )}
      </CardContent>
    </Card>
  );
}

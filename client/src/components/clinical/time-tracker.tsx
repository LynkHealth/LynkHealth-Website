import { useState, useEffect, useRef, useCallback } from "react";
import { adminFetch } from "@/lib/admin-auth";
import { getAdminUser } from "@/lib/admin-auth";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Square, Clock, Timer, User } from "lucide-react";

const STORAGE_KEY = "lynk_timer_state";

const PROGRAM_TYPES = ["CCM", "PCM", "BHI", "RPM", "RTM", "TCM", "APCM", "AWV"];
const ACTIVITY_TYPES = [
  { value: "care_coordination", label: "Care Coordination" },
  { value: "phone_call", label: "Phone Call" },
  { value: "documentation", label: "Documentation" },
  { value: "review", label: "Review" },
  { value: "education", label: "Education" },
];

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsed: number;
  patientId: string;
  programType: string;
  activityType: string;
}

const DEFAULT_STATE: TimerState = {
  isRunning: false,
  startTime: null,
  elapsed: 0,
  patientId: "",
  programType: "CCM",
  activityType: "care_coordination",
};

function loadState(): TimerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_STATE };
}

function saveState(state: TimerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function TimeTracker() {
  const [state, setState] = useState<TimerState>(loadState);
  const [expanded, setExpanded] = useState(false);
  const [displayElapsed, setDisplayElapsed] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const computeElapsed = useCallback(() => {
    if (state.isRunning && state.startTime) {
      return Math.floor((Date.now() - state.startTime) / 1000) + state.elapsed;
    }
    return state.elapsed;
  }, [state.isRunning, state.startTime, state.elapsed]);

  useEffect(() => {
    setDisplayElapsed(computeElapsed());

    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setDisplayElapsed(
          Math.floor((Date.now() - (state.startTime || Date.now())) / 1000) + state.elapsed
        );
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.startTime, state.elapsed, computeElapsed]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleStart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      startTime: Date.now(),
    }));
  }, []);

  const handlePause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      startTime: null,
      elapsed: prev.startTime
        ? Math.floor((Date.now() - prev.startTime) / 1000) + prev.elapsed
        : prev.elapsed,
    }));
  }, []);

  const handleStop = useCallback(async () => {
    const finalElapsed = state.isRunning && state.startTime
      ? Math.floor((Date.now() - state.startTime) / 1000) + state.elapsed
      : state.elapsed;

    if (finalElapsed === 0) return;

    const user = getAdminUser();
    const patientIdNum = parseInt(state.patientId, 10);

    if (!patientIdNum || isNaN(patientIdNum)) {
      setExpanded(true);
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];
      await adminFetch("/api/clinical/time-logs", {
        method: "POST",
        body: JSON.stringify({
          patientId: patientIdNum,
          programType: state.programType,
          durationSeconds: finalElapsed,
          activityType: state.activityType,
          description: "Timed session",
          logDate: today,
          userId: user?.id || 0,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ["/api/clinical/dashboard/stats"] });

      setSuccessMsg(`Saved ${formatTime(finalElapsed)} for patient #${patientIdNum}`);
      setTimeout(() => setSuccessMsg(""), 3000);

      setState({ ...DEFAULT_STATE });
      setDisplayElapsed(0);
      setExpanded(false);
    } catch (err) {
      console.error("Failed to save time log:", err);
    }
  }, [state]);

  const updateField = useCallback((field: keyof TimerState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const status: "idle" | "running" | "paused" =
    state.isRunning ? "running" : displayElapsed > 0 ? "paused" : "idle";

  if (!expanded) {
    return (
      <>
        {successMsg && (
          <div className="fixed bottom-20 right-4 z-[60] bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
            ✓ {successMsg}
          </div>
        )}
        <button
          onClick={() => setExpanded(true)}
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 ${
            status === "running"
              ? "bg-green-600 text-white hover:bg-green-700"
              : status === "paused"
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
          }`}
        >
          {status === "running" && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-200" />
            </span>
          )}
          {status === "paused" && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200" />
            </span>
          )}
          <Timer className="w-4 h-4" />
          <span className="text-sm font-medium">
            {status === "idle" ? "Start Timer" : formatTime(displayElapsed)}
          </span>
        </button>
      </>
    );
  }

  return (
    <>
      {successMsg && (
        <div className="fixed bottom-[340px] right-4 z-[60] bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          ✓ {successMsg}
        </div>
      )}
      <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl border-slate-200 overflow-hidden">
        <div
          className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
            status === "running"
              ? "bg-green-600 text-white"
              : status === "paused"
                ? "bg-amber-500 text-white"
                : "bg-slate-700 text-slate-200"
          }`}
          onClick={() => setExpanded(false)}
        >
          <div className="flex items-center gap-2">
            {status === "running" && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-200" />
              </span>
            )}
            {status === "paused" && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200" />
              </span>
            )}
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">Time Tracker</span>
          </div>
          <Badge
            variant="secondary"
            className={`font-mono text-base ${
              status === "running"
                ? "bg-green-700 text-green-100"
                : status === "paused"
                  ? "bg-amber-600 text-amber-100"
                  : "bg-slate-600 text-slate-200"
            }`}
          >
            {formatTime(displayElapsed)}
          </Badge>
        </div>

        <div className="p-4 space-y-3 bg-white">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <Input
              type="text"
              placeholder="Patient ID"
              value={state.patientId}
              onChange={(e) => updateField("patientId", e.target.value)}
              className="h-8 text-sm"
              disabled={state.isRunning}
            />
          </div>

          <Select
            value={state.programType}
            onValueChange={(v) => updateField("programType", v)}
            disabled={state.isRunning}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Program Type" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_TYPES.map((pt) => (
                <SelectItem key={pt} value={pt}>
                  {pt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={state.activityType}
            onValueChange={(v) => updateField("activityType", v)}
            disabled={state.isRunning}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((at) => (
                <SelectItem key={at.value} value={at.value}>
                  {at.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 pt-1">
            {status === "idle" || status === "paused" ? (
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleStart}
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                {status === "paused" ? "Resume" : "Start"}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-amber-400 text-amber-600 hover:bg-amber-50"
                onClick={handlePause}
              >
                <Pause className="w-3.5 h-3.5 mr-1" />
                Pause
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={handleStop}
              disabled={displayElapsed === 0}
            >
              <Square className="w-3.5 h-3.5 mr-1" />
              Stop & Save
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

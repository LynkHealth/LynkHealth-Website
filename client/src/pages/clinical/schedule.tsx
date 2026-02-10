import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminFetch } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleEvent {
  id: number;
  title: string;
  eventType: string;
  startTime: string;
  endTime: string;
  status: string;
  outcome: string | null;
  notes: string | null;
  patientId: number | null;
  userId: number | null;
  createdAt: string;
}

interface EventFormData {
  title: string;
  eventType: string;
  startTime: string;
  endTime: string;
  patientId: string;
  notes: string;
  status: string;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  call: "bg-blue-100 border-blue-300 text-blue-800",
  follow_up: "bg-green-100 border-green-300 text-green-800",
  assessment: "bg-purple-100 border-purple-300 text-purple-800",
  appointment: "bg-amber-100 border-amber-300 text-amber-800",
  other: "bg-slate-100 border-slate-300 text-slate-800",
};

const EVENT_TYPE_BADGE: Record<string, string> = {
  call: "bg-blue-500 hover:bg-blue-600 text-white",
  follow_up: "bg-green-500 hover:bg-green-600 text-white",
  assessment: "bg-purple-500 hover:bg-purple-600 text-white",
  appointment: "bg-amber-500 hover:bg-amber-600 text-white",
  other: "bg-slate-500 hover:bg-slate-600 text-white",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  call: "Call",
  follow_up: "Follow Up",
  assessment: "Assessment",
  appointment: "Appointment",
  other: "Other",
};

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function toLocalDatetimeString(date: Date): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const defaultFormData: EventFormData = {
  title: "",
  eventType: "call",
  startTime: "",
  endTime: "",
  patientId: "",
  notes: "",
  status: "scheduled",
};

export default function Schedule() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);
  const { toast } = useToast();

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const weekEnd = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [weekStart]);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/clinical/events', weekStart.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
      });
      const res = await adminFetch(`/api/clinical/events?${params}`);
      if (!res.ok) return [];
      return res.json() as Promise<ScheduleEvent[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const body = {
        title: data.title,
        eventType: data.eventType,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        patientId: data.patientId ? parseInt(data.patientId) : null,
        notes: data.notes || null,
        status: data.status,
      };
      const res = await adminFetch('/api/clinical/events', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/events'] });
      toast({ title: "Event created", description: "New event has been scheduled." });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EventFormData }) => {
      const body = {
        title: data.title,
        eventType: data.eventType,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        patientId: data.patientId ? parseInt(data.patientId) : null,
        notes: data.notes || null,
        status: data.status,
      };
      const res = await adminFetch(`/api/clinical/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/events'] });
      toast({ title: "Event updated", description: "Event has been updated successfully." });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await adminFetch(`/api/clinical/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/events'] });
      toast({ title: "Event deleted", description: "Event has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  function closeDialog() {
    setDialogOpen(false);
    setEditingEvent(null);
    setFormData(defaultFormData);
  }

  function openCreate() {
    setEditingEvent(null);
    const now = new Date();
    const start = new Date(now);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    setFormData({
      ...defaultFormData,
      startTime: toLocalDatetimeString(start),
      endTime: toLocalDatetimeString(end),
    });
    setDialogOpen(true);
  }

  function openEdit(event: ScheduleEvent) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      eventType: event.eventType,
      startTime: toLocalDatetimeString(new Date(event.startTime)),
      endTime: toLocalDatetimeString(new Date(event.endTime)),
      patientId: event.patientId ? String(event.patientId) : "",
      notes: event.notes || "",
      status: event.status,
    });
    setDialogOpen(true);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: "Validation Error", description: "Title is required.", variant: "destructive" });
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast({ title: "Validation Error", description: "Start and end times are required.", variant: "destructive" });
      return;
    }
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function goToPreviousWeek() {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }

  function goToNextWeek() {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  function goToToday() {
    setWeekStart(getMonday(new Date()));
  }

  function getEventsForDay(day: Date): ScheduleEvent[] {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, day);
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  const today = new Date();
  const isCurrentWeek = isSameDay(getMonday(today), weekStart);
  const isMutating = createMutation.isPending || updateMutation.isPending;

  const weekLabel = `${formatDate(weekDays[0])} – ${formatDate(weekDays[6])}, ${weekDays[6].getFullYear()}`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">{weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} disabled={isCurrentWeek}>
            Today
          </Button>
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className="min-h-[200px]">
                <div
                  className={`text-center py-2 rounded-t-lg border-b-2 ${
                    isToday
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  <div className="text-xs font-medium uppercase tracking-wide">
                    {formatDayName(day)}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? "text-white" : "text-slate-900"}`}>
                    {day.getDate()}
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 min-h-[160px]">
                  {dayEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center pt-4">No events</p>
                  ) : (
                    dayEvents.map((event) => (
                      <Card
                        key={event.id}
                        className={`cursor-pointer border transition-shadow hover:shadow-md ${
                          EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS.other
                        }`}
                        onClick={() => openEdit(event)}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-xs font-semibold truncate leading-tight">
                              {event.title}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 shrink-0 opacity-60 hover:opacity-100 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate(event.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 opacity-70" />
                            <span className="text-[10px]">
                              {formatTime(event.startTime)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <Badge className={`text-[9px] px-1 py-0 ${EVENT_TYPE_BADGE[event.eventType] || EVENT_TYPE_BADGE.other}`}>
                              {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                            </Badge>
                          </div>
                          {event.status !== "scheduled" && (
                            <Badge
                              variant="outline"
                              className="mt-1 text-[9px] px-1 py-0"
                            >
                              {event.status}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingEvent ? (
                <>
                  <Edit className="w-5 h-5 text-blue-600" />
                  Edit Event
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-blue-600" />
                  New Event
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Event title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(val) => setFormData({ ...formData, eventType: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="patientId">Patient ID (optional)</Label>
              <Input
                id="patientId"
                type="number"
                placeholder="Patient ID"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-between pt-2">
              {editingEvent ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    deleteMutation.mutate(editingEvent.id);
                    closeDialog();
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isMutating}>
                  {isMutating ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

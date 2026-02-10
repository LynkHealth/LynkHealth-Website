import { useMutation, useQuery } from "@tanstack/react-query";
import { adminFetch, getAdminUser } from "@/lib/admin-auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  ClipboardList,
  Clock,
  Activity,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalPatients: number;
  activeEnrollments: number;
  pendingTasks: number;
  todayEvents: number;
  minutesThisMonth: number;
}

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  dueDate: string | null;
  patientId: number | null;
}

interface ScheduleEvent {
  id: number;
  title: string;
  eventType: string;
  startTime: string;
  endTime: string | null;
  status: string;
  patientId: number | null;
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">High</Badge>;
    case "normal":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Normal</Badge>;
    case "low":
      return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">Low</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getEventTypeBadge(eventType: string) {
  const colors: Record<string, string> = {
    call: "bg-blue-100 text-blue-700",
    visit: "bg-green-100 text-green-700",
    review: "bg-purple-100 text-purple-700",
    followup: "bg-amber-100 text-amber-700",
  };
  const cls = colors[eventType] || "bg-gray-100 text-gray-600";
  return <Badge className={`${cls} hover:opacity-80`}>{eventType}</Badge>;
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

function EventListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function ClinicalDashboard() {
  const user = getAdminUser();
  const { toast } = useToast();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/clinical/dashboard/stats"],
    queryFn: async () => {
      const res = await adminFetch("/api/clinical/dashboard/stats");
      if (!res.ok) throw new Error("Failed to load stats");
      return res.json();
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/clinical/dashboard/recent-tasks"],
    queryFn: async () => {
      const res = await adminFetch("/api/clinical/dashboard/recent-tasks");
      if (!res.ok) throw new Error("Failed to load tasks");
      return res.json();
    },
  });

  const { data: events, isLoading: eventsLoading } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/clinical/dashboard/upcoming-events"],
    queryFn: async () => {
      const res = await adminFetch("/api/clinical/dashboard/upcoming-events");
      if (!res.ok) throw new Error("Failed to load events");
      return res.json();
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const res = await adminFetch(`/api/clinical/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "completed", completedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to complete task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/dashboard/recent-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/dashboard/stats"] });
      toast({ title: "Task completed", description: "The task has been marked as complete." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const statCards = [
    {
      title: "Total Active Patients",
      value: stats?.totalPatients ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Enrollments",
      value: stats?.activeEnrollments ?? 0,
      icon: ClipboardList,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks ?? 0,
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Minutes This Month",
      value: stats?.minutesThisMonth ?? 0,
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0] || "Clinician"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading
          ? [1, 2, 3, 4].map((i) => <StatsCardSkeleton key={i} />)
          : statCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{card.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              My Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <TaskListSkeleton />
            ) : !tasks || tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2" />
                <p className="font-medium">All caught up!</p>
                <p className="text-sm mt-1">No pending tasks right now.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getPriorityBadge(task.priority)}
                        <span className="text-xs text-slate-400">
                          Due {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    {task.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 ml-2 shrink-0"
                        onClick={() => completeMutation.mutate(task.id)}
                        disabled={completeMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <EventListSkeleton />
            ) : !events || events.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Calendar className="h-10 w-10 mx-auto mb-2" />
                <p className="font-medium">No upcoming events</p>
                <p className="text-sm mt-1">Your schedule is clear for the next 7 days.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg p-2 min-w-[48px]">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatEventDate(event.startTime)} · {formatTime(event.startTime)}
                        {event.endTime && ` – ${formatTime(event.endTime)}`}
                      </p>
                    </div>
                    {getEventTypeBadge(event.eventType)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, getAdminUser } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { FileText, Check, X, Clock, Eye, ChevronRight, DollarSign, UserX, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PoorEngagementForm {
  id: number;
  careManagerName: string;
  clinic: string;
  patientName: string;
  patientDob: string;
  guidelinesFollowed: boolean;
  notes: string | null;
  status: string;
  submittedBy: number | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
}

interface BillingEvaluationForm {
  id: number;
  patientName: string;
  patientDob: string;
  clinicPartnerName: string;
  employeeName: string;
  description: string;
  issueType: string;
  issueTypeOther: string | null;
  patientCommunicated: boolean;
  requestedAction: string;
  status: string;
  submittedBy: number | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
    case "approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><Check className="w-3 h-3 mr-1" />Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

const BILLING_ISSUE_TYPES = [
  "Patient was billed incorrectly",
  "Patient has insurance/copay questions",
  "Deductible Concern",
  "Other (please specify below)",
];

type FormType = "poor-engagement" | "billing-evaluation";
type ViewMode = "hub" | "submit" | "submissions";

export default function ClinicalForms() {
  const { toast } = useToast();
  const user = getAdminUser();
  const userRole = user?.role || "care_manager";
  const isReviewer = userRole === "admin" || userRole === "supervisor";

  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("hub");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [peFormData, setPeFormData] = useState({
    careManagerName: user?.name || "",
    clinic: "",
    patientName: "",
    patientDob: "",
    guidelinesFollowed: false,
    notes: "",
  });

  const [beFormData, setBeFormData] = useState({
    patientName: "",
    patientDob: "",
    clinicPartnerName: "",
    employeeName: "",
    description: "",
    issueType: "",
    issueTypeOther: "",
    patientCommunicated: false,
    requestedAction: "",
  });

  const { data: peSubmissions = [] } = useQuery<PoorEngagementForm[]>({
    queryKey: ["/api/clinical/forms/poor-engagement", statusFilter],
    queryFn: async () => {
      const url = statusFilter !== "all"
        ? `/api/clinical/forms/poor-engagement?status=${statusFilter}`
        : "/api/clinical/forms/poor-engagement";
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: selectedFormType === "poor-engagement" && viewMode === "submissions",
  });

  const { data: beSubmissions = [] } = useQuery<BillingEvaluationForm[]>({
    queryKey: ["/api/clinical/forms/billing-evaluation", statusFilter],
    queryFn: async () => {
      const url = statusFilter !== "all"
        ? `/api/clinical/forms/billing-evaluation?status=${statusFilter}`
        : "/api/clinical/forms/billing-evaluation";
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: selectedFormType === "billing-evaluation" && viewMode === "submissions",
  });

  const { data: allPeSubs = [] } = useQuery<PoorEngagementForm[]>({
    queryKey: ["/api/clinical/forms/poor-engagement", "all-for-count"],
    queryFn: async () => {
      const res = await adminFetch("/api/clinical/forms/poor-engagement");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: allBeSubs = [] } = useQuery<BillingEvaluationForm[]>({
    queryKey: ["/api/clinical/forms/billing-evaluation", "all-for-count"],
    queryFn: async () => {
      const res = await adminFetch("/api/clinical/forms/billing-evaluation");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const peSubmitMutation = useMutation({
    mutationFn: async (data: typeof peFormData) => {
      const res = await adminFetch("/api/clinical/forms/poor-engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Form submitted", description: "Your poor engagement form has been submitted for review." });
      setPeFormData({ careManagerName: user?.name || "", clinic: "", patientName: "", patientDob: "", guidelinesFollowed: false, notes: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/forms/poor-engagement"], exact: false });
      setViewMode("submissions");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit form.", variant: "destructive" });
    },
  });

  const beSubmitMutation = useMutation({
    mutationFn: async (data: typeof beFormData) => {
      const res = await adminFetch("/api/clinical/forms/billing-evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Form submitted", description: "Your billing evaluation request has been submitted for review." });
      setBeFormData({ patientName: "", patientDob: "", clinicPartnerName: "", employeeName: "", description: "", issueType: "", issueTypeOther: "", patientCommunicated: false, requestedAction: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/forms/billing-evaluation"], exact: false });
      setViewMode("submissions");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit form.", variant: "destructive" });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ formType, id, status, reviewNotes }: { formType: FormType; id: number; status: string; reviewNotes?: string }) => {
      const res = await adminFetch(`/api/clinical/forms/${formType}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: (_, vars) => {
      toast({ title: vars.status === "approved" ? "Approved" : "Rejected", description: `The form has been ${vars.status}.` });
      setReviewDialogOpen(false);
      setSelectedSubmission(null);
      setReviewNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/forms/poor-engagement"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/forms/billing-evaluation"], exact: false });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update form status.", variant: "destructive" });
    },
  });

  const handlePeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peFormData.careManagerName || !peFormData.clinic || !peFormData.patientName || !peFormData.patientDob) {
      toast({ title: "Missing fields", description: "Please fill out all required fields.", variant: "destructive" });
      return;
    }
    peSubmitMutation.mutate(peFormData);
  };

  const handleBeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beFormData.patientName || !beFormData.patientDob || !beFormData.clinicPartnerName || !beFormData.employeeName || !beFormData.description || !beFormData.issueType || !beFormData.requestedAction) {
      toast({ title: "Missing fields", description: "Please fill out all required fields.", variant: "destructive" });
      return;
    }
    if (beFormData.issueType === "Other (please specify below)" && !beFormData.issueTypeOther) {
      toast({ title: "Missing fields", description: "Please specify the billing issue type.", variant: "destructive" });
      return;
    }
    beSubmitMutation.mutate(beFormData);
  };

  const goToHub = () => {
    setSelectedFormType(null);
    setViewMode("hub");
    setStatusFilter("all");
  };

  const selectForm = (type: FormType, mode: ViewMode) => {
    setSelectedFormType(type);
    setViewMode(mode);
    setStatusFilter("all");
  };

  const pePendingCount = allPeSubs.filter(s => s.status === "pending").length;
  const bePendingCount = allBeSubs.filter(s => s.status === "pending").length;
  const totalPending = pePendingCount + bePendingCount;

  if (viewMode === "hub") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Forms</h1>
            <p className="text-slate-500 text-sm mt-1">Submit and manage clinical forms</p>
          </div>
          {isReviewer && totalPending > 0 && (
            <Badge className="bg-amber-100 text-amber-800 text-sm px-3 py-1">
              {totalPending} pending review
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Poor Engagement Form</CardTitle>
                  {pePendingCount > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 mt-1 text-xs">{pePendingCount} pending</Badge>
                  )}
                </div>
              </div>
              <CardDescription className="mt-2">
                Escalation for active patients historically difficult to connect with.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" onClick={() => selectForm("poor-engagement", "submit")}>
                <FileText className="w-4 h-4 mr-1" />
                Submit
              </Button>
              <Button size="sm" variant="outline" onClick={() => selectForm("poor-engagement", "submissions")}>
                View Submissions ({allPeSubs.length})
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Billing Evaluation Request</CardTitle>
                  {bePendingCount > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 mt-1 text-xs">{bePendingCount} pending</Badge>
                  )}
                </div>
              </div>
              <CardDescription className="mt-2">
                Request an evaluation of patient billing issues by the Billing and Claims Department.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" onClick={() => selectForm("billing-evaluation", "submit")}>
                <FileText className="w-4 h-4 mr-1" />
                Submit
              </Button>
              <Button size="sm" variant="outline" onClick={() => selectForm("billing-evaluation", "submissions")}>
                View Submissions ({allBeSubs.length})
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const submissions = selectedFormType === "poor-engagement" ? peSubmissions : beSubmissions;
  const currentPendingCount = selectedFormType === "poor-engagement" ? pePendingCount : bePendingCount;
  const formTitle = selectedFormType === "poor-engagement" ? "Poor Engagement Form" : "Billing Evaluation Request";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={goToHub}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Forms
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{formTitle}</h1>
        </div>
        {isReviewer && currentPendingCount > 0 && (
          <Badge className="bg-amber-100 text-amber-800 text-sm px-3 py-1">
            {currentPendingCount} pending review
          </Badge>
        )}
      </div>

      <Tabs value={viewMode === "submit" ? "submit" : "submissions"} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList className="mb-4">
          <TabsTrigger value="submit">Submit Form</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions
            {currentPendingCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">{currentPendingCount}</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <div className="max-w-2xl">
            {selectedFormType === "poor-engagement" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-orange-600" />
                    Lynk Health - Poor Engagement Form
                  </CardTitle>
                  <CardDescription>
                    Escalation for active patients historically difficult to connect with.
                    When you submit this form, it will go into a pending status for administrator review.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePeSubmit} className="space-y-5">
                    <div>
                      <Label className="text-sm font-medium">1. Care Manager Name <span className="text-red-500">*</span></Label>
                      <Input className="mt-1.5" value={peFormData.careManagerName} onChange={(e) => setPeFormData(prev => ({ ...prev, careManagerName: e.target.value }))} placeholder="Enter your name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">2. Clinic <span className="text-red-500">*</span></Label>
                      <Input className="mt-1.5" value={peFormData.clinic} onChange={(e) => setPeFormData(prev => ({ ...prev, clinic: e.target.value }))} placeholder="Enter clinic name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">3. Patient Name <span className="text-red-500">*</span></Label>
                      <Input className="mt-1.5" value={peFormData.patientName} onChange={(e) => setPeFormData(prev => ({ ...prev, patientName: e.target.value }))} placeholder="Enter patient name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">4. Patient DOB <span className="text-red-500">*</span></Label>
                      <Input type="date" className="mt-1.5" value={peFormData.patientDob} onChange={(e) => setPeFormData(prev => ({ ...prev, patientDob: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">5. Have the Care Communication Guidelines been followed and documented?</Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Checkbox checked={peFormData.guidelinesFollowed} onCheckedChange={(checked) => setPeFormData(prev => ({ ...prev, guidelinesFollowed: checked === true }))} />
                        <Label className="text-sm font-normal cursor-pointer">Yes</Label>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">6. Other Notes:</Label>
                      <Textarea className="mt-1.5" rows={4} value={peFormData.notes} onChange={(e) => setPeFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Any additional notes..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={peSubmitMutation.isPending}>
                      {peSubmitMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Billing Evaluation Request
                  </CardTitle>
                  <CardDescription>
                    Please complete this form to request an evaluation of patient billing issues by the Billing and Claims Department.
                    Provide as much detail as possible to help us resolve the issue efficiently.
                    When you submit this form, it will not automatically collect your details like name and email address unless you provide it yourself.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBeSubmit} className="space-y-5">
                    <div>
                      <Label className="text-sm font-medium">1. Patient Full Name <span className="text-red-500">*</span></Label>
                      <Input className="mt-1.5" value={beFormData.patientName} onChange={(e) => setBeFormData(prev => ({ ...prev, patientName: e.target.value }))} placeholder="Enter patient full name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">2. Patient Date of Birth <span className="text-red-500">*</span></Label>
                      <Input type="date" className="mt-1.5" value={beFormData.patientDob} onChange={(e) => setBeFormData(prev => ({ ...prev, patientDob: e.target.value }))} />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">3. Clinic Partner Name <span className="text-red-500">*</span></Label>
                      <Input className="mt-1.5" value={beFormData.clinicPartnerName} onChange={(e) => setBeFormData(prev => ({ ...prev, clinicPartnerName: e.target.value }))} placeholder="Enter clinic partner name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">4. Employee Name <span className="text-red-500">*</span></Label>
                      <Input className="mt-1.5" value={beFormData.employeeName} onChange={(e) => setBeFormData(prev => ({ ...prev, employeeName: e.target.value }))} placeholder="Enter your name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">5. DETAILED Description of Billing Issue <span className="text-red-500">*</span></Label>
                      <p className="text-xs text-slate-500 mt-0.5 mb-1.5">Please describe the billing issue in detail, including any relevant dates, services, or communications.</p>
                      <Textarea className="mt-1" rows={5} value={beFormData.description} onChange={(e) => setBeFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the billing issue in detail..." />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">6. Type of Billing Issue <span className="text-red-500">*</span></Label>
                      <RadioGroup className="mt-2 space-y-2" value={beFormData.issueType} onValueChange={(val) => setBeFormData(prev => ({ ...prev, issueType: val }))}>
                        {BILLING_ISSUE_TYPES.map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <RadioGroupItem value={type} id={`issue-${type}`} />
                            <Label htmlFor={`issue-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    {beFormData.issueType === "Other (please specify below)" && (
                      <div>
                        <Label className="text-sm font-medium">7. If you selected 'Other', please specify: <span className="text-red-500">*</span></Label>
                        <Input className="mt-1.5" value={beFormData.issueTypeOther} onChange={(e) => setBeFormData(prev => ({ ...prev, issueTypeOther: e.target.value }))} placeholder="Specify the billing issue type" />
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium">{beFormData.issueType === "Other (please specify below)" ? "8" : "7"}. Have you already communicated with the patient about this issue? <span className="text-red-500">*</span></Label>
                      <RadioGroup className="mt-2 space-y-2" value={beFormData.patientCommunicated ? "yes" : "no"} onValueChange={(val) => setBeFormData(prev => ({ ...prev, patientCommunicated: val === "yes" }))}>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="yes" id="communicated-yes" />
                          <Label htmlFor="communicated-yes" className="text-sm font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="communicated-no" />
                          <Label htmlFor="communicated-no" className="text-sm font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">{beFormData.issueType === "Other (please specify below)" ? "9" : "8"}. Requested Action from Billing and Claims Department <span className="text-red-500">*</span></Label>
                      <p className="text-xs text-slate-500 mt-0.5 mb-1.5">Describe what you would like the Billing and Claims Department to do regarding this issue.</p>
                      <Textarea className="mt-1" rows={4} value={beFormData.requestedAction} onChange={(e) => setBeFormData(prev => ({ ...prev, requestedAction: e.target.value }))} placeholder="Describe the requested action..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={beSubmitMutation.isPending}>
                      {beSubmitMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{formTitle} Submissions</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No submissions found.</div>
              ) : selectedFormType === "poor-engagement" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Care Manager</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Guidelines</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(submissions as PoorEngagementForm[]).map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="text-sm text-slate-600">{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{form.careManagerName}</TableCell>
                        <TableCell>{form.clinic}</TableCell>
                        <TableCell>{form.patientName}</TableCell>
                        <TableCell>{form.guidelinesFollowed ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-500" />}</TableCell>
                        <TableCell>{getStatusBadge(form.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSubmission(form); setDetailDialogOpen(true); }}><Eye className="w-4 h-4" /></Button>
                            {isReviewer && form.status === "pending" && (
                              <Button variant="outline" size="sm" onClick={() => { setSelectedSubmission(form); setReviewNotes(""); setReviewDialogOpen(true); }}>Review<ChevronRight className="w-3 h-3 ml-1" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Issue Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(submissions as BillingEvaluationForm[]).map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="text-sm text-slate-600">{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{form.employeeName}</TableCell>
                        <TableCell>{form.clinicPartnerName}</TableCell>
                        <TableCell>{form.patientName}</TableCell>
                        <TableCell className="text-sm">{form.issueType === "Other (please specify below)" ? form.issueTypeOther || "Other" : form.issueType}</TableCell>
                        <TableCell>{getStatusBadge(form.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedSubmission(form); setDetailDialogOpen(true); }}><Eye className="w-4 h-4" /></Button>
                            {isReviewer && form.status === "pending" && (
                              <Button variant="outline" size="sm" onClick={() => { setSelectedSubmission(form); setReviewNotes(""); setReviewDialogOpen(true); }}>Review<ChevronRight className="w-3 h-3 ml-1" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                {getStatusBadge(selectedSubmission.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted</span>
                <span>{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
              </div>
              <hr />
              {selectedFormType === "poor-engagement" ? (
                <>
                  <div><span className="text-slate-500 block mb-1">Care Manager</span><span className="font-medium">{selectedSubmission.careManagerName}</span></div>
                  <div><span className="text-slate-500 block mb-1">Clinic</span><span className="font-medium">{selectedSubmission.clinic}</span></div>
                  <div><span className="text-slate-500 block mb-1">Patient Name</span><span className="font-medium">{selectedSubmission.patientName}</span></div>
                  <div><span className="text-slate-500 block mb-1">Patient DOB</span><span className="font-medium">{selectedSubmission.patientDob}</span></div>
                  <div><span className="text-slate-500 block mb-1">Guidelines Followed</span><span className="font-medium">{selectedSubmission.guidelinesFollowed ? "Yes" : "No"}</span></div>
                  {selectedSubmission.notes && <div><span className="text-slate-500 block mb-1">Notes</span><p className="text-slate-700 bg-slate-50 rounded p-2">{selectedSubmission.notes}</p></div>}
                </>
              ) : (
                <>
                  <div><span className="text-slate-500 block mb-1">Patient Name</span><span className="font-medium">{selectedSubmission.patientName}</span></div>
                  <div><span className="text-slate-500 block mb-1">Patient DOB</span><span className="font-medium">{selectedSubmission.patientDob}</span></div>
                  <div><span className="text-slate-500 block mb-1">Clinic Partner</span><span className="font-medium">{selectedSubmission.clinicPartnerName}</span></div>
                  <div><span className="text-slate-500 block mb-1">Employee</span><span className="font-medium">{selectedSubmission.employeeName}</span></div>
                  <div><span className="text-slate-500 block mb-1">Issue Type</span><span className="font-medium">{selectedSubmission.issueType === "Other (please specify below)" ? selectedSubmission.issueTypeOther || "Other" : selectedSubmission.issueType}</span></div>
                  <div><span className="text-slate-500 block mb-1">Description</span><p className="text-slate-700 bg-slate-50 rounded p-2 whitespace-pre-wrap">{selectedSubmission.description}</p></div>
                  <div><span className="text-slate-500 block mb-1">Patient Communicated</span><span className="font-medium">{selectedSubmission.patientCommunicated ? "Yes" : "No"}</span></div>
                  <div><span className="text-slate-500 block mb-1">Requested Action</span><p className="text-slate-700 bg-slate-50 rounded p-2 whitespace-pre-wrap">{selectedSubmission.requestedAction}</p></div>
                </>
              )}
              {selectedSubmission.reviewedAt && (
                <>
                  <hr />
                  <div><span className="text-slate-500 block mb-1">Reviewed At</span><span className="font-medium">{new Date(selectedSubmission.reviewedAt).toLocaleString()}</span></div>
                  {selectedSubmission.reviewNotes && <div><span className="text-slate-500 block mb-1">Review Notes</span><p className="text-slate-700 bg-slate-50 rounded p-2">{selectedSubmission.reviewNotes}</p></div>}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && selectedFormType && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                {selectedFormType === "poor-engagement" ? (
                  <>
                    <div><span className="text-slate-500">Care Manager:</span> <span className="font-medium">{selectedSubmission.careManagerName}</span></div>
                    <div><span className="text-slate-500">Clinic:</span> <span className="font-medium">{selectedSubmission.clinic}</span></div>
                    <div><span className="text-slate-500">Patient:</span> <span className="font-medium">{selectedSubmission.patientName}</span></div>
                    <div><span className="text-slate-500">DOB:</span> <span className="font-medium">{selectedSubmission.patientDob}</span></div>
                    <div><span className="text-slate-500">Guidelines Followed:</span> <span className="font-medium">{selectedSubmission.guidelinesFollowed ? "Yes" : "No"}</span></div>
                    {selectedSubmission.notes && <div><span className="text-slate-500">Notes:</span> <p className="mt-1">{selectedSubmission.notes}</p></div>}
                  </>
                ) : (
                  <>
                    <div><span className="text-slate-500">Patient:</span> <span className="font-medium">{selectedSubmission.patientName}</span></div>
                    <div><span className="text-slate-500">DOB:</span> <span className="font-medium">{selectedSubmission.patientDob}</span></div>
                    <div><span className="text-slate-500">Clinic:</span> <span className="font-medium">{selectedSubmission.clinicPartnerName}</span></div>
                    <div><span className="text-slate-500">Employee:</span> <span className="font-medium">{selectedSubmission.employeeName}</span></div>
                    <div><span className="text-slate-500">Issue Type:</span> <span className="font-medium">{selectedSubmission.issueType === "Other (please specify below)" ? selectedSubmission.issueTypeOther || "Other" : selectedSubmission.issueType}</span></div>
                    <div><span className="text-slate-500">Description:</span> <p className="mt-1 whitespace-pre-wrap">{selectedSubmission.description}</p></div>
                    <div><span className="text-slate-500">Patient Communicated:</span> <span className="font-medium">{selectedSubmission.patientCommunicated ? "Yes" : "No"}</span></div>
                    <div><span className="text-slate-500">Requested Action:</span> <p className="mt-1 whitespace-pre-wrap">{selectedSubmission.requestedAction}</p></div>
                  </>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Review Notes (optional)</Label>
                <Textarea className="mt-1.5" rows={3} value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder="Add notes about your decision..." />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ formType: selectedFormType, id: selectedSubmission.id, status: "rejected", reviewNotes })}>
                  <X className="w-4 h-4 mr-1" />Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ formType: selectedFormType, id: selectedSubmission.id, status: "approved", reviewNotes })}>
                  <Check className="w-4 h-4 mr-1" />Approve
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

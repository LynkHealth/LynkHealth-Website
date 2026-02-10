import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, getAdminUser } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { FileText, Check, X, Clock, Eye, ChevronRight } from "lucide-react";
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

export default function ClinicalForms() {
  const { toast } = useToast();
  const user = getAdminUser();
  const userRole = user?.role || "care_manager";
  const isReviewer = userRole === "admin" || userRole === "supervisor";

  const [activeTab, setActiveTab] = useState("submit");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<PoorEngagementForm | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    careManagerName: user?.name || "",
    clinic: "",
    patientName: "",
    patientDob: "",
    guidelinesFollowed: false,
    notes: "",
  });

  const { data: submissions = [], isLoading } = useQuery<PoorEngagementForm[]>({
    queryKey: ["/api/clinical/forms/poor-engagement", statusFilter],
    queryFn: async () => {
      const url = statusFilter !== "all"
        ? `/api/clinical/forms/poor-engagement?status=${statusFilter}`
        : "/api/clinical/forms/poor-engagement";
      const res = await adminFetch(url);
      if (!res.ok) throw new Error("Failed to fetch forms");
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await adminFetch("/api/clinical/forms/poor-engagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit form");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Form submitted", description: "Your poor engagement form has been submitted for review." });
      setFormData({ careManagerName: user?.name || "", clinic: "", patientName: "", patientDob: "", guidelinesFollowed: false, notes: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/forms/poor-engagement"] });
      setActiveTab("submissions");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit the form. Please try again.", variant: "destructive" });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, reviewNotes }: { id: number; status: string; reviewNotes?: string }) => {
      const res = await adminFetch(`/api/clinical/forms/poor-engagement/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes }),
      });
      if (!res.ok) throw new Error("Failed to update form");
      return res.json();
    },
    onSuccess: (_, vars) => {
      toast({ title: vars.status === "approved" ? "Form Approved" : "Form Rejected", description: `The poor engagement form has been ${vars.status}.` });
      setReviewDialogOpen(false);
      setSelectedForm(null);
      setReviewNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/forms/poor-engagement"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update the form status.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.careManagerName || !formData.clinic || !formData.patientName || !formData.patientDob) {
      toast({ title: "Missing fields", description: "Please fill out all required fields.", variant: "destructive" });
      return;
    }
    submitMutation.mutate(formData);
  };

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Forms</h1>
          <p className="text-slate-500 text-sm mt-1">Submit and manage clinical forms</p>
        </div>
        {isReviewer && pendingCount > 0 && (
          <Badge className="bg-amber-100 text-amber-800 text-sm px-3 py-1">
            {pendingCount} pending review
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="submit">Submit Form</TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions
            {pendingCount > 0 && <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">{pendingCount}</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Lynk Health &lt;&gt; Poor Engagement Form
                </CardTitle>
                <CardDescription>
                  Escalation for active patients historically difficult to connect with.
                  When you submit this form, it will go into a pending status for administrator review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="careManagerName" className="text-sm font-medium">1. Care Manager Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="careManagerName"
                      className="mt-1.5"
                      value={formData.careManagerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, careManagerName: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinic" className="text-sm font-medium">2. Clinic <span className="text-red-500">*</span></Label>
                    <Input
                      id="clinic"
                      className="mt-1.5"
                      value={formData.clinic}
                      onChange={(e) => setFormData(prev => ({ ...prev, clinic: e.target.value }))}
                      placeholder="Enter clinic name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientName" className="text-sm font-medium">3. Patient Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="patientName"
                      className="mt-1.5"
                      value={formData.patientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patientDob" className="text-sm font-medium">4. Patient DOB <span className="text-red-500">*</span></Label>
                    <Input
                      id="patientDob"
                      type="date"
                      className="mt-1.5"
                      value={formData.patientDob}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientDob: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">5. Have the Care Communication Guidelines been followed and documented?</Label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Checkbox
                        id="guidelinesFollowed"
                        checked={formData.guidelinesFollowed}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, guidelinesFollowed: checked === true }))}
                      />
                      <Label htmlFor="guidelinesFollowed" className="text-sm font-normal cursor-pointer">Yes</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">6. Other Notes:</Label>
                    <Textarea
                      id="notes"
                      className="mt-1.5"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Form Submissions</CardTitle>
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
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No submissions found.</div>
              ) : (
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
                    {submissions.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="text-sm text-slate-600">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">{form.careManagerName}</TableCell>
                        <TableCell>{form.clinic}</TableCell>
                        <TableCell>{form.patientName}</TableCell>
                        <TableCell>
                          {form.guidelinesFollowed ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(form.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setSelectedForm(form); setDetailDialogOpen(true); }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {isReviewer && form.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedForm(form); setReviewNotes(""); setReviewDialogOpen(true); }}
                              >
                                Review
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                {getStatusBadge(selectedForm.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submitted</span>
                <span>{new Date(selectedForm.createdAt).toLocaleString()}</span>
              </div>
              <hr />
              <div>
                <span className="text-slate-500 block mb-1">Care Manager</span>
                <span className="font-medium">{selectedForm.careManagerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Clinic</span>
                <span className="font-medium">{selectedForm.clinic}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Patient Name</span>
                <span className="font-medium">{selectedForm.patientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Patient DOB</span>
                <span className="font-medium">{selectedForm.patientDob}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Guidelines Followed</span>
                <span className="font-medium">{selectedForm.guidelinesFollowed ? "Yes" : "No"}</span>
              </div>
              {selectedForm.notes && (
                <div>
                  <span className="text-slate-500 block mb-1">Notes</span>
                  <p className="text-slate-700 bg-slate-50 rounded p-2">{selectedForm.notes}</p>
                </div>
              )}
              {selectedForm.reviewedAt && (
                <>
                  <hr />
                  <div>
                    <span className="text-slate-500 block mb-1">Reviewed At</span>
                    <span className="font-medium">{new Date(selectedForm.reviewedAt).toLocaleString()}</span>
                  </div>
                  {selectedForm.reviewNotes && (
                    <div>
                      <span className="text-slate-500 block mb-1">Review Notes</span>
                      <p className="text-slate-700 bg-slate-50 rounded p-2">{selectedForm.reviewNotes}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                <div><span className="text-slate-500">Care Manager:</span> <span className="font-medium">{selectedForm.careManagerName}</span></div>
                <div><span className="text-slate-500">Clinic:</span> <span className="font-medium">{selectedForm.clinic}</span></div>
                <div><span className="text-slate-500">Patient:</span> <span className="font-medium">{selectedForm.patientName}</span></div>
                <div><span className="text-slate-500">DOB:</span> <span className="font-medium">{selectedForm.patientDob}</span></div>
                <div><span className="text-slate-500">Guidelines Followed:</span> <span className="font-medium">{selectedForm.guidelinesFollowed ? "Yes" : "No"}</span></div>
                {selectedForm.notes && <div><span className="text-slate-500">Notes:</span> <p className="mt-1">{selectedForm.notes}</p></div>}
              </div>

              <div>
                <Label htmlFor="reviewNotes" className="text-sm font-medium">Review Notes (optional)</Label>
                <Textarea
                  id="reviewNotes"
                  className="mt-1.5"
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  disabled={reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate({ id: selectedForm.id, status: "rejected", reviewNotes })}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate({ id: selectedForm.id, status: "approved", reviewNotes })}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

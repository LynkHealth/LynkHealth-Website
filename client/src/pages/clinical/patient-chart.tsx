import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Pill, AlertTriangle, Activity, Shield, ClipboardList, Clock, FileText, Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Patient, PatientCondition, PatientMedication, PatientAllergy, PatientVital, PatientInsurance, ProgramEnrollment, CarePlan, TimeLog } from "@shared/schema";
import { insertPatientConditionSchema, insertPatientMedicationSchema, insertPatientAllergySchema, insertPatientVitalSchema, insertPatientInsuranceSchema, insertProgramEnrollmentSchema, insertTimeLogSchema } from "@shared/schema";

function getRiskBadge(level: string | null) {
  if (level === "high") return <Badge variant="destructive">High</Badge>;
  if (level === "medium") return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
  if (level === "low") return <Badge className="bg-green-500 text-white">Low</Badge>;
  return <Badge variant="secondary">{level || "N/A"}</Badge>;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
    </div>
  );
}

function OverviewTab({ patient, id }: { patient: Patient; id: string }) {
  const { data: conditions } = useQuery<PatientCondition[]>({
    queryKey: ['/api/clinical/patients', id, 'conditions'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/conditions`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const { data: medications } = useQuery<PatientMedication[]>({
    queryKey: ['/api/clinical/patients', id, 'medications'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/medications`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const { data: enrollments } = useQuery<ProgramEnrollment[]>({
    queryKey: ['/api/clinical/patients', id, 'enrollments'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/enrollments`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Demographics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoRow label="First Name" value={patient.firstName} />
            <InfoRow label="Last Name" value={patient.lastName} />
            <InfoRow label="Date of Birth" value={patient.dateOfBirth} />
            <InfoRow label="Gender" value={patient.gender} />
            <InfoRow label="Phone" value={patient.phone} />
            <InfoRow label="Email" value={patient.email} />
            <InfoRow label="Address" value={patient.address} />
            <InfoRow label="City" value={patient.city} />
            <InfoRow label="State" value={patient.state} />
            <InfoRow label="Zip Code" value={patient.zipCode} />
            <InfoRow label="Emergency Contact" value={patient.emergencyContactName} />
            <InfoRow label="Emergency Phone" value={patient.emergencyContactPhone} />
            <InfoRow label="Consent Status" value={patient.consentStatus} />
            <InfoRow label="Risk Level" value={patient.riskLevel} />
          </div>
          {patient.notes && (
            <div className="mt-4">
              <p className="text-xs text-slate-500">Notes</p>
              <p className="text-sm text-slate-700 mt-1">{patient.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="w-8 h-8 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold">{conditions?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Conditions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Pill className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{medications?.filter(m => m.status === 'active').length ?? 0}</p>
            <p className="text-xs text-slate-500">Active Medications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <ClipboardList className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{enrollments?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Enrollments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConditionsTab({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: conditions, isLoading } = useQuery<PatientCondition[]>({
    queryKey: ['/api/clinical/patients', id, 'conditions'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/conditions`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ resolver: zodResolver(insertPatientConditionSchema.omit({ patientId: true })), defaultValues: { icdCode: "", description: "", status: "active", onsetDate: "", isPrimary: 0 } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/patients/${id}/conditions`, vals); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'conditions'] }); toast({ title: "Condition added" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });
  const delMut = useMutation({
    mutationFn: async (cid: number) => { await apiRequest('DELETE', `/api/clinical/conditions/${cid}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'conditions'] }); toast({ title: "Condition removed" }); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Conditions</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Condition</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Condition</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="icdCode" render={({ field }) => (<FormItem><FormLabel>ICD Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="onsetDate" render={({ field }) => (<FormItem><FormLabel>Onset Date</FormLabel><FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="isPrimary" render={({ field }) => (<FormItem><FormLabel>Primary Condition</FormLabel><Select onValueChange={(v) => field.onChange(parseInt(v))} value={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="1">Yes</SelectItem><SelectItem value="0">No</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Adding..." : "Add Condition"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!conditions?.length ? <p className="text-slate-500 text-sm py-8 text-center">No conditions recorded yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>ICD Code</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead>Onset</TableHead><TableHead>Primary</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {conditions.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono">{c.icdCode}</TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell><Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                <TableCell>{c.onsetDate || "—"}</TableCell>
                <TableCell>{c.isPrimary ? "Yes" : "No"}</TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => delMut.mutate(c.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function MedicationsTab({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: meds, isLoading } = useQuery<PatientMedication[]>({
    queryKey: ['/api/clinical/patients', id, 'medications'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/medications`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ defaultValues: { name: "", dosage: "", frequency: "", prescribedBy: "", status: "active" } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/patients/${id}/medications`, vals); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'medications'] }); toast({ title: "Medication added" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });
  const delMut = useMutation({
    mutationFn: async (mid: number) => { await apiRequest('DELETE', `/api/clinical/medications/${mid}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'medications'] }); toast({ title: "Medication removed" }); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Medications</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Medication</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Medication</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="dosage" render={({ field }) => (<FormItem><FormLabel>Dosage</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="frequency" render={({ field }) => (<FormItem><FormLabel>Frequency</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="prescribedBy" render={({ field }) => (<FormItem><FormLabel>Prescribed By</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="discontinued">Discontinued</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Adding..." : "Add Medication"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!meds?.length ? <p className="text-slate-500 text-sm py-8 text-center">No medications recorded yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Dosage</TableHead><TableHead>Frequency</TableHead><TableHead>Prescribed By</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {meds.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.dosage || "—"}</TableCell>
                <TableCell>{m.frequency || "—"}</TableCell>
                <TableCell>{m.prescribedBy || "—"}</TableCell>
                <TableCell><Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => delMut.mutate(m.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function AllergiesTab({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: allergies, isLoading } = useQuery<PatientAllergy[]>({
    queryKey: ['/api/clinical/patients', id, 'allergies'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/allergies`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ defaultValues: { allergen: "", reaction: "", severity: "moderate", status: "active" } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/patients/${id}/allergies`, vals); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'allergies'] }); toast({ title: "Allergy added" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });
  const delMut = useMutation({
    mutationFn: async (aid: number) => { await apiRequest('DELETE', `/api/clinical/allergies/${aid}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'allergies'] }); toast({ title: "Allergy removed" }); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Allergies</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Allergy</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Allergy</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="allergen" render={({ field }) => (<FormItem><FormLabel>Allergen</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="reaction" render={({ field }) => (<FormItem><FormLabel>Reaction</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="severity" render={({ field }) => (<FormItem><FormLabel>Severity</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="mild">Mild</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="severe">Severe</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Adding..." : "Add Allergy"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!allergies?.length ? <p className="text-slate-500 text-sm py-8 text-center">No allergies recorded yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Allergen</TableHead><TableHead>Reaction</TableHead><TableHead>Severity</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {allergies.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.allergen}</TableCell>
                <TableCell>{a.reaction || "—"}</TableCell>
                <TableCell><Badge variant={a.severity === 'severe' ? 'destructive' : 'secondary'}>{a.severity}</Badge></TableCell>
                <TableCell><Badge variant={a.status === 'active' ? 'default' : 'secondary'}>{a.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => delMut.mutate(a.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function VitalsTab({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: vitals, isLoading } = useQuery<PatientVital[]>({
    queryKey: ['/api/clinical/patients', id, 'vitals'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/vitals?limit=50`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ defaultValues: { vitalType: "blood_pressure", value: "", unit: "" } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/patients/${id}/vitals`, vals); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'vitals'] }); toast({ title: "Vital recorded" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Vitals</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Vital</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Vital</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="vitalType" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="blood_pressure">Blood Pressure</SelectItem><SelectItem value="heart_rate">Heart Rate</SelectItem><SelectItem value="temperature">Temperature</SelectItem><SelectItem value="weight">Weight</SelectItem><SelectItem value="blood_glucose">Blood Glucose</SelectItem><SelectItem value="oxygen_saturation">Oxygen Saturation</SelectItem><SelectItem value="respiratory_rate">Respiratory Rate</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="value" render={({ field }) => (<FormItem><FormLabel>Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="unit" render={({ field }) => (<FormItem><FormLabel>Unit</FormLabel><FormControl><Input {...field} placeholder="e.g. mmHg, bpm, °F" /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Recording..." : "Record Vital"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!vitals?.length ? <p className="text-slate-500 text-sm py-8 text-center">No vitals recorded yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Unit</TableHead><TableHead>Recorded At</TableHead></TableRow></TableHeader>
          <TableBody>
            {vitals.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="capitalize">{v.vitalType.replace(/_/g, ' ')}</TableCell>
                <TableCell className="font-medium">{v.value}</TableCell>
                <TableCell>{v.unit || "—"}</TableCell>
                <TableCell>{v.recordedAt ? new Date(v.recordedAt).toLocaleString() : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function InsuranceTab({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: insurance, isLoading } = useQuery<PatientInsurance[]>({
    queryKey: ['/api/clinical/patients', id, 'insurance'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/insurance`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ defaultValues: { payerName: "", memberId: "", groupNumber: "", planName: "", insuranceType: "primary", status: "active" } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/patients/${id}/insurance`, vals); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'insurance'] }); toast({ title: "Insurance added" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });
  const delMut = useMutation({
    mutationFn: async (iid: number) => { await apiRequest('DELETE', `/api/clinical/insurance/${iid}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'insurance'] }); toast({ title: "Insurance removed" }); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Insurance</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Insurance</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Insurance</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="payerName" render={({ field }) => (<FormItem><FormLabel>Payer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="memberId" render={({ field }) => (<FormItem><FormLabel>Member ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="groupNumber" render={({ field }) => (<FormItem><FormLabel>Group Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="planName" render={({ field }) => (<FormItem><FormLabel>Plan Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="insuranceType" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="primary">Primary</SelectItem><SelectItem value="secondary">Secondary</SelectItem><SelectItem value="tertiary">Tertiary</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Adding..." : "Add Insurance"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!insurance?.length ? <p className="text-slate-500 text-sm py-8 text-center">No insurance records yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Payer</TableHead><TableHead>Member ID</TableHead><TableHead>Group #</TableHead><TableHead>Plan</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {insurance.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.payerName}</TableCell>
                <TableCell>{i.memberId || "—"}</TableCell>
                <TableCell>{i.groupNumber || "—"}</TableCell>
                <TableCell>{i.planName || "—"}</TableCell>
                <TableCell className="capitalize">{i.insuranceType}</TableCell>
                <TableCell><Badge variant={i.status === 'active' ? 'default' : 'secondary'}>{i.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => delMut.mutate(i.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function EnrollmentsTab({ id, patient }: { id: string; patient: Patient }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: enrollments, isLoading } = useQuery<ProgramEnrollment[]>({
    queryKey: ['/api/clinical/patients', id, 'enrollments'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/enrollments`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ defaultValues: { programType: "CCM" } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/enrollments`, { patientId: parseInt(id), practiceId: patient.practiceId, programType: vals.programType }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'enrollments'] }); toast({ title: "Enrollment added" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Program Enrollments</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Enrollment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Enroll in Program</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="programType" render={({ field }) => (<FormItem><FormLabel>Program</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["CCM","PCM","BHI","RPM","RTM","TCM","APCM","AWV"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Enrolling..." : "Enroll"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!enrollments?.length ? <p className="text-slate-500 text-sm py-8 text-center">No program enrollments yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Program</TableHead><TableHead>Status</TableHead><TableHead>Enrolled At</TableHead><TableHead>Consent</TableHead><TableHead>Care Manager ID</TableHead></TableRow></TableHeader>
          <TableBody>
            {enrollments.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.programType}</TableCell>
                <TableCell><Badge variant={e.status === 'enrolled' ? 'default' : 'secondary'}>{e.status}</Badge></TableCell>
                <TableCell>{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "—"}</TableCell>
                <TableCell>{e.consentObtained ? "Yes" : "No"}</TableCell>
                <TableCell>{e.assignedCareManagerId || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function CarePlansTab({ id }: { id: string }) {
  const { data: plans, isLoading } = useQuery<CarePlan[]>({
    queryKey: ['/api/clinical/patients', id, 'care-plans'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/care-plans`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Care Plans</h3>
      {!plans?.length ? <p className="text-slate-500 text-sm py-8 text-center">No care plans yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell><Badge variant={p.status === 'active' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell>
                <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function TimeLogsTab({ id }: { id: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { data: logs, isLoading } = useQuery<TimeLog[]>({
    queryKey: ['/api/clinical/patients', id, 'time-logs'],
    queryFn: async () => { const res = await fetch(`/api/clinical/patients/${id}/time-logs`, { credentials: 'include' }); if (!res.ok) throw new Error('Failed'); return res.json(); },
  });
  const form = useForm({ defaultValues: { programType: "CCM", durationSeconds: 0, activityType: "care_coordination", logDate: new Date().toISOString().split('T')[0], description: "" } });
  const addMut = useMutation({
    mutationFn: async (vals: any) => { await apiRequest('POST', `/api/clinical/time-logs`, { patientId: parseInt(id), userId: 1, programType: vals.programType, durationSeconds: parseInt(vals.durationSeconds), activityType: vals.activityType, logDate: vals.logDate, description: vals.description }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients', id, 'time-logs'] }); toast({ title: "Time log added" }); setOpen(false); form.reset(); },
    onError: (e: Error) => { toast({ title: "Error", description: e.message, variant: "destructive" }); },
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Time Logs</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Add Time Log</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Time</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => addMut.mutate(v))} className="space-y-3">
                <FormField control={form.control} name="programType" render={({ field }) => (<FormItem><FormLabel>Program</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{["CCM","PCM","BHI","RPM","RTM","TCM","APCM","AWV"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="durationSeconds" render={({ field }) => (<FormItem><FormLabel>Duration (seconds)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="activityType" render={({ field }) => (<FormItem><FormLabel>Activity Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="care_coordination">Care Coordination</SelectItem><SelectItem value="phone_call">Phone Call</SelectItem><SelectItem value="documentation">Documentation</SelectItem><SelectItem value="review">Review</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="logDate" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={addMut.isPending} className="w-full">{addMut.isPending ? "Logging..." : "Log Time"}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {!logs?.length ? <p className="text-slate-500 text-sm py-8 text-center">No time logs recorded yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Program</TableHead><TableHead>Duration</TableHead><TableHead>Activity</TableHead><TableHead>Description</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.programType}</TableCell>
                <TableCell>{Math.round(l.durationSeconds / 60)} min</TableCell>
                <TableCell className="capitalize">{l.activityType.replace(/_/g, ' ')}</TableCell>
                <TableCell>{l.description || "—"}</TableCell>
                <TableCell>{l.logDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function PatientChart() {
  const [, params] = useRoute("/clinical/patients/:id");
  const id = params?.id || "";

  const { data: patient, isLoading } = useQuery<Patient>({
    queryKey: ['/api/clinical/patients', id],
    queryFn: async () => {
      const res = await fetch(`/api/clinical/patients/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6"><p>Loading...</p></div>;
  if (!patient) return <div className="p-6"><p>Patient not found.</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clinical/patients">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{patient.lastName}, {patient.firstName}</h1>
          <div className="flex items-center gap-3 mt-1">
            {patient.mrn && <span className="text-sm text-slate-500">MRN: {patient.mrn}</span>}
            {patient.dateOfBirth && <span className="text-sm text-slate-500">DOB: {patient.dateOfBirth}</span>}
            <Badge variant={patient.status === "active" ? "default" : "secondary"}>{patient.status}</Badge>
            {getRiskBadge(patient.riskLevel)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview"><FileText className="w-3.5 h-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="conditions"><Heart className="w-3.5 h-3.5 mr-1" />Conditions</TabsTrigger>
          <TabsTrigger value="medications"><Pill className="w-3.5 h-3.5 mr-1" />Medications</TabsTrigger>
          <TabsTrigger value="allergies"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Allergies</TabsTrigger>
          <TabsTrigger value="vitals"><Activity className="w-3.5 h-3.5 mr-1" />Vitals</TabsTrigger>
          <TabsTrigger value="insurance"><Shield className="w-3.5 h-3.5 mr-1" />Insurance</TabsTrigger>
          <TabsTrigger value="enrollments"><ClipboardList className="w-3.5 h-3.5 mr-1" />Enrollments</TabsTrigger>
          <TabsTrigger value="care-plans"><FileText className="w-3.5 h-3.5 mr-1" />Care Plans</TabsTrigger>
          <TabsTrigger value="time-logs"><Clock className="w-3.5 h-3.5 mr-1" />Time Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab patient={patient} id={id} /></TabsContent>
        <TabsContent value="conditions"><ConditionsTab id={id} /></TabsContent>
        <TabsContent value="medications"><MedicationsTab id={id} /></TabsContent>
        <TabsContent value="allergies"><AllergiesTab id={id} /></TabsContent>
        <TabsContent value="vitals"><VitalsTab id={id} /></TabsContent>
        <TabsContent value="insurance"><InsuranceTab id={id} /></TabsContent>
        <TabsContent value="enrollments"><EnrollmentsTab id={id} patient={patient} /></TabsContent>
        <TabsContent value="care-plans"><CarePlansTab id={id} /></TabsContent>
        <TabsContent value="time-logs"><TimeLogsTab id={id} /></TabsContent>
      </Tabs>
    </div>
  );
}
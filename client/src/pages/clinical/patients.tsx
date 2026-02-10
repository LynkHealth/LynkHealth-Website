import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { adminFetch } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Patient } from "@shared/schema";
import { insertPatientSchema } from "@shared/schema";

const createPatientSchema = insertPatientSchema.pick({
  firstName: true,
  lastName: true,
  dateOfBirth: true,
  gender: true,
  email: true,
  phone: true,
  practiceId: true,
});

type CreatePatientForm = z.infer<typeof createPatientSchema>;

function getRiskBadge(riskLevel: string | null) {
  switch (riskLevel) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white">Low</Badge>;
    default:
      return <Badge variant="secondary">{riskLevel || "N/A"}</Badge>;
  }
}

function getConsentBadge(consentStatus: string | null) {
  switch (consentStatus) {
    case "obtained":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Obtained</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
    case "declined":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Declined</Badge>;
    default:
      return <Badge variant="secondary">{consentStatus || "N/A"}</Badge>;
  }
}

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useQuery({
    queryKey: ['/api/clinical/patients', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      if (search) params.set('search', search);
      const res = await adminFetch(`/api/clinical/patients?${params}`);
      return res.json() as Promise<{ patients: Patient[], total: number }>;
    }
  });

  const form = useForm<CreatePatientForm>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      practiceId: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreatePatientForm) => {
      const res = await adminFetch('/api/clinical/patients', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/patients'] });
      toast({ title: "Patient created", description: "New patient has been added successfully." });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (values: CreatePatientForm) => {
    createMutation.mutate(values);
  };

  const patients = data?.patients || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 25);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">{total} total patients</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Patient</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="practiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice ID *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Patient"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search patients by name, MRN..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium">No patients found</p>
              <p className="text-sm mt-1">
                {search ? "Try adjusting your search term" : "Add your first patient to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>MRN</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Consent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="cursor-pointer hover:bg-slate-50">
                      <TableCell>
                        <Link href={`/clinical/patients/${patient.id}`}>
                          <span className="text-blue-600 hover:text-blue-800 font-medium">
                            {patient.lastName}, {patient.firstName}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{patient.mrn || "—"}</TableCell>
                      <TableCell>{patient.dateOfBirth || "—"}</TableCell>
                      <TableCell>{patient.gender || "—"}</TableCell>
                      <TableCell>{patient.phone || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{getRiskBadge(patient.riskLevel)}</TableCell>
                      <TableCell>{getConsentBadge(patient.consentStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages} ({total} patients)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

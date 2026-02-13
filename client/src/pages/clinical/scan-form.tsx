import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, Camera, FileImage, Loader2, CheckCircle2, AlertTriangle, UserPlus, RotateCcw, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ScannedData {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  insuranceType: string | null;
  consentSigned: boolean;
  consentDate: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
  warnings: string[];
}

interface Practice {
  id: number;
  name: string;
  active?: boolean;
}

export default function ScanIntakeForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [patientCreated, setPatientCreated] = useState(false);

  const { data: practices = [] } = useQuery<Practice[]>({
    queryKey: ["/api/admin/practices"],
    queryFn: () => adminFetch("/api/admin/practices").then(r => r.json()).then(data => data.practices || []),
  });
  const activePractices = practices.filter((p: Practice) => p.active !== false);

  const scanMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const res = await adminFetch("/api/clinical/scan-intake-form", {
        method: "POST",
        body: JSON.stringify({ image: imageData }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to scan form");
      }
      return res.json();
    },
    onSuccess: (result) => {
      setScannedData(result.data);
      setEditedData({});
      toast({ title: "Form scanned successfully", description: `Confidence: ${result.data.confidence}` });
    },
    onError: (error: Error) => {
      toast({ title: "Scan failed", description: error.message, variant: "destructive" });
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      const res = await adminFetch("/api/clinical/patients", {
        method: "POST",
        body: JSON.stringify(patientData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create patient");
      }
      return res.json();
    },
    onSuccess: () => {
      setPatientCreated(true);
      queryClient.invalidateQueries({ queryKey: ["/api/clinical/patients"] });
      toast({ title: "Patient created", description: "Patient profile has been created from the scanned form." });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create patient", description: error.message, variant: "destructive" });
    },
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file (JPG, PNG, etc.)", variant: "destructive" });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 15MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);
      setScannedData(null);
      setEditedData({});
      setPatientCreated(false);
      scanMutation.mutate(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [scanMutation, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImagePreview(dataUrl);
        setScannedData(null);
        setEditedData({});
        setPatientCreated(false);
        scanMutation.mutate(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [scanMutation]);

  const getFieldValue = (field: string) => {
    if (field in editedData) return editedData[field];
    return scannedData ? (scannedData as any)[field] || "" : "";
  };

  const setFieldValue = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePatient = () => {
    if (!selectedPractice) {
      toast({ title: "Practice required", description: "Please select a practice to assign this patient to.", variant: "destructive" });
      return;
    }

    const firstName = getFieldValue("firstName");
    const lastName = getFieldValue("lastName");

    if (!firstName || !lastName) {
      toast({ title: "Name required", description: "First name and last name are required to create a patient.", variant: "destructive" });
      return;
    }

    const patientData: any = {
      practiceId: parseInt(selectedPractice),
      firstName,
      lastName,
      status: "active",
    };

    const optionalFields = ["dateOfBirth", "gender", "phone", "email", "address", "city", "state", "zipCode", "emergencyContactName", "emergencyContactPhone"];
    for (const field of optionalFields) {
      const val = getFieldValue(field);
      if (val) patientData[field] = val;
    }

    if (scannedData?.consentSigned) {
      patientData.consentStatus = "signed";
      patientData.consentDate = getFieldValue("consentDate") || new Date().toLocaleDateString("en-US");
    }

    const notes = getFieldValue("notes");
    const insuranceType = getFieldValue("insuranceType");
    const notesParts = [];
    if (insuranceType) notesParts.push(`Insurance: ${insuranceType}`);
    if (notes) notesParts.push(notes);
    if (notesParts.length > 0) patientData.notes = notesParts.join("\n");

    createPatientMutation.mutate(patientData);
  };

  const handleReset = () => {
    setImagePreview(null);
    setScannedData(null);
    setEditedData({});
    setSelectedPractice("");
    setPatientCreated(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confidenceColor = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan Intake Form</h1>
        <p className="text-sm text-slate-500 mt-1">Upload a photo of a handwritten intake form to automatically extract patient information using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Upload Form Image
              </CardTitle>
              <CardDescription>Take a photo or upload a scan of the intake form</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-700">Drop an image here or click to upload</p>
                  <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG up to 15MB</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      <Upload className="w-4 h-4 mr-1" /> Upload File
                    </Button>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      <Camera className="w-4 h-4 mr-1" /> Take Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative max-h-[600px] overflow-auto rounded-lg border border-slate-200">
                    <img src={imagePreview} alt="Uploaded form" className="w-full rounded-lg" style={{ imageRendering: "auto" }} />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="sticky top-2 float-right mr-2 h-7 w-7 z-10"
                      onClick={handleReset}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {scanMutation.isPending && (
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">AI is reading the form...</span>
                    </div>
                  )}
                  {scannedData && (
                    <Button variant="outline" size="sm" onClick={() => scanMutation.mutate(imagePreview)}>
                      <RotateCcw className="w-4 h-4 mr-1" /> Re-scan
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {scannedData && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Extracted Information
                    </CardTitle>
                    <Badge className={confidenceColor[scannedData.confidence]}>
                      {scannedData.confidence} confidence
                    </Badge>
                  </div>
                  <CardDescription>Review and edit the extracted data before creating the patient profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scannedData.warnings.length > 0 && (
                    <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Reading warnings:</strong>
                        <ul className="list-disc ml-5 mt-1 text-xs">
                          {scannedData.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">First Name *</Label>
                      <Input value={getFieldValue("firstName")} onChange={e => setFieldValue("firstName", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Last Name *</Label>
                      <Input value={getFieldValue("lastName")} onChange={e => setFieldValue("lastName", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Date of Birth</Label>
                      <Input value={getFieldValue("dateOfBirth")} onChange={e => setFieldValue("dateOfBirth", e.target.value)} placeholder="MM/DD/YYYY" className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Gender</Label>
                      <Select value={getFieldValue("gender") || ""} onValueChange={v => setFieldValue("gender", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input value={getFieldValue("phone")} onChange={e => setFieldValue("phone", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Email</Label>
                      <Input value={getFieldValue("email")} onChange={e => setFieldValue("email", e.target.value)} className="h-9 text-sm" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Address</Label>
                    <Input value={getFieldValue("address")} onChange={e => setFieldValue("address", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">City</Label>
                      <Input value={getFieldValue("city")} onChange={e => setFieldValue("city", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">State</Label>
                      <Input value={getFieldValue("state")} onChange={e => setFieldValue("state", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Zip Code</Label>
                      <Input value={getFieldValue("zipCode")} onChange={e => setFieldValue("zipCode", e.target.value)} className="h-9 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Emergency Contact</Label>
                      <Input value={getFieldValue("emergencyContactName")} onChange={e => setFieldValue("emergencyContactName", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Emergency Phone</Label>
                      <Input value={getFieldValue("emergencyContactPhone")} onChange={e => setFieldValue("emergencyContactPhone", e.target.value)} className="h-9 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Insurance Type</Label>
                      <Input value={getFieldValue("insuranceType")} onChange={e => setFieldValue("insuranceType", e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Consent Date</Label>
                      <Input value={getFieldValue("consentDate")} onChange={e => setFieldValue("consentDate", e.target.value)} className="h-9 text-sm" />
                    </div>
                  </div>

                  {scannedData.consentSigned && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Consent Signed
                    </Badge>
                  )}

                  <div>
                    <Label className="text-xs">Additional Notes</Label>
                    <Textarea value={getFieldValue("notes")} onChange={e => setFieldValue("notes", e.target.value)} rows={2} className="text-sm" />
                  </div>
                </CardContent>
              </Card>

              {!patientCreated ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create Patient Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Assign to Practice *</Label>
                      <Select value={selectedPractice} onValueChange={setSelectedPractice}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select a practice" /></SelectTrigger>
                        <SelectContent>
                          {activePractices.map((p: Practice) => (
                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleCreatePatient}
                      disabled={createPatientMutation.isPending}
                    >
                      {createPatientMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                      ) : (
                        <><UserPlus className="w-4 h-4 mr-2" /> Create Patient from Scanned Data</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Patient profile created successfully! You can <button className="underline font-medium" onClick={handleReset}>scan another form</button>.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

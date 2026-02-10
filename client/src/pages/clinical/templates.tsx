import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminFetch } from "@/lib/admin-auth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, FileText, X, ChevronDown, ChevronUp, Target, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

interface TemplateItem {
  id?: number;
  itemType: string;
  description: string;
  sortOrder?: number;
}

interface Template {
  id: number;
  name: string;
  programType: string;
  description: string | null;
  isActive: boolean;
  items: TemplateItem[];
}

const PROGRAM_TYPES = ["CCM", "PCM", "BHI", "RPM", "RTM", "TCM", "APCM", "AWV"];
const FILTER_TYPES = ["All", "CCM", "PCM", "BHI", "RPM", "RTM"];
const ITEM_TYPES = ["goal", "intervention", "outcome"];

function getProgramBadgeColor(program: string) {
  const colors: Record<string, string> = {
    CCM: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    PCM: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    BHI: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    RPM: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    RTM: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    TCM: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    APCM: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    AWV: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  };
  return colors[program] || "bg-slate-100 text-slate-800";
}

function getItemTypeIcon(type: string) {
  switch (type) {
    case "goal":
      return <Target className="w-4 h-4 text-blue-500" />;
    case "intervention":
      return <Activity className="w-4 h-4 text-green-500" />;
    case "outcome":
      return <TrendingUp className="w-4 h-4 text-purple-500" />;
    default:
      return <FileText className="w-4 h-4 text-slate-400" />;
  }
}

export default function CarePlanTemplates() {
  const [filter, setFilter] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { toast } = useToast();

  const [formName, setFormName] = useState("");
  const [formProgramType, setFormProgramType] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formItems, setFormItems] = useState<TemplateItem[]>([]);

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ['/api/clinical/templates', filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "All") params.set("programType", filter);
      const res = await adminFetch(`/api/clinical/templates?${params}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; programType: string; description: string; items: TemplateItem[] }) => {
      const res = await adminFetch("/api/clinical/templates", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/templates'] });
      toast({ title: "Template created", description: "Care plan template has been created successfully." });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name: string; programType: string; description: string } }) => {
      const res = await adminFetch(`/api/clinical/templates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/templates'] });
      toast({ title: "Template updated", description: "Care plan template has been updated successfully." });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await adminFetch(`/api/clinical/templates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/templates'] });
      toast({ title: "Template deleted", description: "Care plan template has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ templateId, item }: { templateId: number; item: TemplateItem }) => {
      const res = await adminFetch(`/api/clinical/templates/${templateId}/items`, {
        method: "POST",
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/templates'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const res = await adminFetch(`/api/clinical/template-items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clinical/templates'] });
    },
  });

  function openCreateDialog() {
    setEditingTemplate(null);
    setFormName("");
    setFormProgramType("");
    setFormDescription("");
    setFormItems([]);
    setDialogOpen(true);
  }

  function openEditDialog(template: Template) {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormProgramType(template.programType);
    setFormDescription(template.description || "");
    setFormItems(template.items.map((i) => ({ itemType: i.itemType, description: i.description })));
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingTemplate(null);
    setFormName("");
    setFormProgramType("");
    setFormDescription("");
    setFormItems([]);
  }

  function addFormItem() {
    setFormItems([...formItems, { itemType: "goal", description: "" }]);
  }

  function updateFormItem(index: number, field: keyof TemplateItem, value: string) {
    const updated = [...formItems];
    updated[index] = { ...updated[index], [field]: value };
    setFormItems(updated);
  }

  function removeFormItem(index: number) {
    setFormItems(formItems.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!formName.trim()) {
      toast({ title: "Validation Error", description: "Template name is required.", variant: "destructive" });
      return;
    }
    if (!formProgramType) {
      toast({ title: "Validation Error", description: "Program type is required.", variant: "destructive" });
      return;
    }

    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate.id,
        data: { name: formName, programType: formProgramType, description: formDescription },
      });
    } else {
      createMutation.mutate({
        name: formName,
        programType: formProgramType,
        description: formDescription,
        items: formItems.filter((i) => i.description.trim()),
      });
    }
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate(id);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Care Plan Templates</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage reusable care plan templates for different programs
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_TYPES.map((type) => (
          <Button
            key={type}
            variant={filter === type ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type)}
            className={filter === type ? "" : "text-slate-600"}
          >
            {type}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-lg font-medium">No templates found</p>
          <p className="text-sm mt-1">
            {filter !== "All" ? "Try selecting a different program type" : "Create your first care plan template to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                    <Badge className={getProgramBadgeColor(template.programType)}>
                      {template.programType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-blue-600"
                      onClick={() => openEditDialog(template)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-red-600"
                      onClick={() => handleDelete(template.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {template.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {template.items?.length || 0} item{(template.items?.length || 0) !== 1 ? "s" : ""}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 gap-1 h-7 px-2"
                    onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                  >
                    {expandedId === template.id ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Hide Items
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        View Items
                      </>
                    )}
                  </Button>
                </div>

                {expandedId === template.id && (
                  <div className="border-t pt-3 space-y-2">
                    {template.items && template.items.length > 0 ? (
                      template.items.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-start gap-2 text-sm">
                          {getItemTypeIcon(item.itemType)}
                          <div className="flex-1 min-w-0">
                            <span className="font-medium capitalize text-slate-700">{item.itemType}:</span>{" "}
                            <span className="text-slate-600">{item.description}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">No items in this template</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name *</label>
              <Input
                placeholder="e.g., CCM Monthly Care Plan"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Program Type *</label>
              <Select value={formProgramType} onValueChange={setFormProgramType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea
                placeholder="Describe the purpose of this template..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Template Items</h3>
                <Button variant="outline" size="sm" onClick={addFormItem} className="gap-1">
                  <Plus className="w-3 h-3" />
                  Add Item
                </Button>
              </div>
              {formItems.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-4">
                  No items yet. Click "Add Item" to start building the template.
                </p>
              ) : (
                <div className="space-y-3">
                  {formItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                      <div className="w-36 shrink-0">
                        <Select
                          value={item.itemType}
                          onValueChange={(v) => updateFormItem(index, "itemType", v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ITEM_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                <span className="capitalize">{type}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        placeholder="Item description..."
                        value={item.description}
                        onChange={(e) => updateFormItem(index, "description", e.target.value)}
                        className="flex-1 h-9"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-red-600 shrink-0"
                        onClick={() => removeFormItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending
                  ? editingTemplate
                    ? "Updating..."
                    : "Creating..."
                  : editingTemplate
                    ? "Update Template"
                    : "Create Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
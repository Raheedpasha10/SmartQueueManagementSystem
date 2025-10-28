"use client";

import { useState } from "react";
import { DocumentUpload } from "@/components/documents/document-upload";
import { DocumentList } from "@/components/documents/document-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DocumentsClientProps {
  patient: any;
  insuranceProviders: any[];
  patientInsurance: any[];
}

export function DocumentsClient({
  patient,
  insuranceProviders: initialProviders,
  patientInsurance: initialInsurance,
}: DocumentsClientProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<any>(null);
  const [insuranceList, setInsuranceList] = useState(initialInsurance);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    insurance_provider_id: "",
    policy_number: "",
    policy_holder_name: "",
    policy_holder_relationship: "self",
    start_date: "",
    end_date: "",
    coverage_amount: "",
    is_primary: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmitInsurance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.insurance_provider_id || !formData.policy_number || !formData.policy_holder_name || !formData.start_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const insuranceData = {
        patient_id: patient.id,
        insurance_provider_id: formData.insurance_provider_id,
        policy_number: formData.policy_number,
        policy_holder_name: formData.policy_holder_name,
        policy_holder_relationship: formData.policy_holder_relationship,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        coverage_amount: formData.coverage_amount ? parseFloat(formData.coverage_amount) : null,
        is_primary: formData.is_primary,
      };

      let error;
      if (editingInsurance) {
        const result = await supabase
          .from("patient_insurance")
          .update(insuranceData)
          .eq("id", editingInsurance.id);
        error = result.error;
      } else {
        const result = await supabase.from("patient_insurance").insert(insuranceData);
        error = result.error;
      }

      if (error) throw error;

      toast.success(editingInsurance ? "Insurance updated successfully" : "Insurance added successfully");

      // Refresh insurance list
      const { data: updatedInsurance } = await supabase
        .from("patient_insurance")
        .select(
          `
          *,
          insurance_providers (name, logo_url)
        `
        )
        .eq("patient_id", patient.id)
        .order("is_primary", { ascending: false });

      setInsuranceList(updatedInsurance || []);
      setShowInsuranceForm(false);
      setEditingInsurance(null);
      setFormData({
        insurance_provider_id: "",
        policy_number: "",
        policy_holder_name: "",
        policy_holder_relationship: "self",
        start_date: "",
        end_date: "",
        coverage_amount: "",
        is_primary: false,
      });
    } catch (error: any) {
      console.error("Error saving insurance:", error);
      toast.error(error.message || "Failed to save insurance");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInsurance = (insurance: any) => {
    setEditingInsurance(insurance);
    setFormData({
      insurance_provider_id: insurance.insurance_provider_id || "",
      policy_number: insurance.policy_number || "",
      policy_holder_name: insurance.policy_holder_name || "",
      policy_holder_relationship: insurance.policy_holder_relationship || "self",
      start_date: insurance.start_date || "",
      end_date: insurance.end_date || "",
      coverage_amount: insurance.coverage_amount?.toString() || "",
      is_primary: insurance.is_primary || false,
    });
    setShowInsuranceForm(true);
  };

  const handleDeleteInsurance = async (insuranceId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this insurance? This action cannot be undone."
    );
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from("patient_insurance")
        .delete()
        .eq("id", insuranceId);

      if (error) throw error;

      toast.success("Insurance deleted successfully");

      // Refresh insurance list
      const { data: updatedInsurance } = await supabase
        .from("patient_insurance")
        .select(
          `
          *,
          insurance_providers (name, logo_url)
        `
        )
        .eq("patient_id", patient.id)
        .order("is_primary", { ascending: false });

      setInsuranceList(updatedInsurance || []);
    } catch (error: any) {
      console.error("Error deleting insurance:", error);
      toast.error("Failed to delete insurance");
    }
  };

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Documents & Insurance</h1>
        <p className="text-gray-600">Manage your medical documents and insurance information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Documents */}
        <div className="space-y-6">
          <DocumentUpload patientId={patient.id} onUploadComplete={handleUploadComplete} />
          <DocumentList patientId={patient.id} refreshTrigger={refreshTrigger} />
        </div>

        {/* Right Column - Insurance */}
        <div className="space-y-6">
          {/* Add Insurance Button */}
          {!showInsuranceForm && (
            <Button
              onClick={() => setShowInsuranceForm(true)}
              className="w-full gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Add Insurance Information
            </Button>
          )}

          {/* Insurance Form */}
          {showInsuranceForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {editingInsurance ? "Edit Insurance" : "Add Insurance"}
                    </CardTitle>
                    <CardDescription>
                      Enter your health insurance details
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowInsuranceForm(false);
                      setEditingInsurance(null);
                      setFormData({
                        insurance_provider_id: "",
                        policy_number: "",
                        policy_holder_name: "",
                        policy_holder_relationship: "self",
                        start_date: "",
                        end_date: "",
                        coverage_amount: "",
                        is_primary: false,
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitInsurance} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Insurance Provider *</Label>
                    <select
                      name="insurance_provider_id"
                      value={formData.insurance_provider_id}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    >
                      <option value="">Select Provider</option>
                      {initialProviders.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Policy Number *</Label>
                    <Input
                      name="policy_number"
                      value={formData.policy_number}
                      onChange={handleInputChange}
                      placeholder="Enter policy number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Policy Holder Name *</Label>
                    <Input
                      name="policy_holder_name"
                      value={formData.policy_holder_name}
                      onChange={handleInputChange}
                      placeholder="Enter policy holder name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Relationship to Policy Holder</Label>
                    <select
                      name="policy_holder_relationship"
                      value={formData.policy_holder_relationship}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="self">Self</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Coverage Amount (₹)</Label>
                    <Input
                      type="number"
                      name="coverage_amount"
                      value={formData.coverage_amount}
                      onChange={handleInputChange}
                      placeholder="Enter coverage amount"
                      min="0"
                      step="1000"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_primary"
                      name="is_primary"
                      checked={formData.is_primary}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_primary" className="cursor-pointer">
                      Set as primary insurance
                    </Label>
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingInsurance ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      <>{editingInsurance ? "Update Insurance" : "Add Insurance"}</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Insurance List */}
          {insuranceList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  My Insurance ({insuranceList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insuranceList.map((insurance) => (
                    <div
                      key={insurance.id}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {insurance.insurance_providers?.name || "Unknown Provider"}
                            </h3>
                            {insurance.is_primary && (
                              <Badge variant="default">Primary</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Policy: {insurance.policy_number}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditInsurance(insurance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInsurance(insurance.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>Holder: {insurance.policy_holder_name}</span>
                          <Badge variant="secondary">{insurance.policy_holder_relationship}</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Valid: {new Date(insurance.start_date).toLocaleDateString()} -{" "}
                            {insurance.end_date
                              ? new Date(insurance.end_date).toLocaleDateString()
                              : "Ongoing"}
                          </span>
                        </div>

                        {insurance.coverage_amount && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>Coverage: {formatCurrency(insurance.coverage_amount)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {insuranceList.length === 0 && !showInsuranceForm && (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No insurance information added</p>
                <p className="mt-1 text-sm text-gray-500">
                  Add your health insurance details for easier billing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


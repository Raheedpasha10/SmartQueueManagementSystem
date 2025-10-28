"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Pill,
  Activity,
  AlertCircle,
  Save,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface MedicalHistoryProps {
  patientId: string;
}

interface MedicalRecord {
  id: string;
  condition: string;
  diagnosed_date: string;
  notes: string;
  is_chronic: boolean;
  is_active: boolean;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: string;
  reaction: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  is_current: boolean;
}

export function MedicalHistory({ patientId }: MedicalHistoryProps) {
  const [conditions, setConditions] = useState<MedicalRecord[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAllergy, setEditingAllergy] = useState(false);
  const [newAllergy, setNewAllergy] = useState({
    allergen: "",
    severity: "mild",
    reaction: "",
  });
  const supabase = createClient();

  useEffect(() => {
    if (patientId) {
      fetchMedicalHistory();
    } else {
      setLoading(false);
    }
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    try {
      // Fetch all patient medical history data from appointments
      const { data: appointments } = await supabase
        .from("appointments")
        .select(`
          *,
          emergency_triage (*)
        `)
        .eq("patient_id", patientId)
        .eq("status", "completed")
        .order("scheduled_time", { ascending: false })
        .limit(10);

      // For demonstration, create sample data structure
      // In a real app, you'd have dedicated tables for this
      setConditions([]);
      setAllergies([]);
      setMedications([]);
    } catch (error) {
      console.error("Error fetching medical history:", error);
      toast.error("Failed to load medical history");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllergy = async () => {
    if (!newAllergy.allergen.trim()) {
      toast.error("Please enter allergen name");
      return;
    }

    try {
      // In a real app, save to allergies table
      const newAllergyRecord: Allergy = {
        id: Date.now().toString(),
        ...newAllergy,
      };

      setAllergies([...allergies, newAllergyRecord]);
      setNewAllergy({ allergen: "", severity: "mild", reaction: "" });
      setEditingAllergy(false);
      toast.success("Allergy added successfully");
    } catch (error: any) {
      console.error("Error adding allergy:", error);
      toast.error(error.message || "Failed to add allergy");
    }
  };

  const handleDeleteAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id));
    toast.success("Allergy removed");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Medical Conditions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Conditions
            </CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Condition
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {conditions.length > 0 ? (
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div
                  key={condition.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{condition.condition}</h4>
                      {condition.is_chronic && (
                        <Badge variant="secondary">Chronic</Badge>
                      )}
                      {condition.is_active && (
                        <Badge className="bg-orange-500">Active</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Diagnosed: {new Date(condition.diagnosed_date).toLocaleDateString()}
                    </p>
                    {condition.notes && (
                      <p className="mt-2 text-sm text-gray-700">{condition.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              No medical conditions recorded
            </p>
          )}
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Allergies
            </CardTitle>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setEditingAllergy(true)}
            >
              <Plus className="h-4 w-4" />
              Add Allergy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editingAllergy && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-4 font-semibold">Add New Allergy</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="allergen">Allergen</Label>
                    <Input
                      id="allergen"
                      placeholder="e.g., Penicillin, Peanuts"
                      value={newAllergy.allergen}
                      onChange={(e) =>
                        setNewAllergy({ ...newAllergy, allergen: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <select
                      id="severity"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newAllergy.severity}
                      onChange={(e) =>
                        setNewAllergy({ ...newAllergy, severity: e.target.value })
                      }
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                      <option value="life-threatening">Life-threatening</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="reaction">Reaction</Label>
                    <Input
                      id="reaction"
                      placeholder="e.g., Rash, Difficulty breathing"
                      value={newAllergy.reaction}
                      onChange={(e) =>
                        setNewAllergy({ ...newAllergy, reaction: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAllergy} className="flex-1 gap-2">
                      <Save className="h-4 w-4" />
                      Save Allergy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingAllergy(false);
                        setNewAllergy({ allergen: "", severity: "mild", reaction: "" });
                      }}
                      className="flex-1 gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {allergies.length > 0 ? (
              <div className="space-y-3">
                {allergies.map((allergy) => (
                  <div
                    key={allergy.id}
                    className="flex items-start justify-between rounded-lg border-l-4 border-red-500 bg-red-50 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-red-900">{allergy.allergen}</h4>
                        <Badge
                          className={
                            allergy.severity === "life-threatening"
                              ? "bg-red-600"
                              : allergy.severity === "severe"
                              ? "bg-orange-600"
                              : "bg-yellow-600"
                          }
                        >
                          {allergy.severity}
                        </Badge>
                      </div>
                      {allergy.reaction && (
                        <p className="mt-1 text-sm text-red-700">
                          Reaction: {allergy.reaction}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeleteAllergy(allergy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              !editingAllergy && (
                <p className="py-8 text-center text-gray-500">No allergies recorded</p>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Current Medications
            </CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length > 0 ? (
            <div className="space-y-3">
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{medication.name}</h4>
                      {medication.is_current && (
                        <Badge className="bg-green-500">Current</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {medication.dosage} - {medication.frequency}
                    </p>
                    <p className="text-xs text-gray-500">
                      Started: {new Date(medication.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              No current medications recorded
            </p>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            View your past appointments and consultations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


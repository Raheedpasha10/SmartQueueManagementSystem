"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Heart,
  Activity,
  Thermometer,
  Loader2,
  CheckCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import Link from "next/link";

type TriageLevel = "1" | "2" | "3" | "4" | "5";
type ConsciousnessLevel = "alert" | "verbal" | "pain" | "unresponsive";
type BreathingStatus = "normal" | "difficulty" | "severe";

export default function EmergencyPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [emergencyToken, setEmergencyToken] = useState<string | null>(null);
  const [nearestHospital, setNearestHospital] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    symptoms: [] as string[],
    painLevel: 0,
    consciousness: "alert" as ConsciousnessLevel,
    breathing: "normal" as BreathingStatus,
    heartRate: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    temperature: "",
    oxygenSaturation: "",
  });

  const commonSymptoms = [
    "Chest Pain",
    "Difficulty Breathing",
    "Severe Bleeding",
    "Unconsciousness",
    "Severe Pain",
    "Head Injury",
    "Stroke Symptoms",
    "Allergic Reaction",
    "Seizure",
    "Poisoning",
    "Burns",
    "Fracture",
  ];

  const toggleSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const calculateTriageLevel = (): TriageLevel => {
    let score = 5; // Start with lowest priority

    // Critical symptoms
    const criticalSymptoms = [
      "Chest Pain",
      "Difficulty Breathing",
      "Unconsciousness",
      "Severe Bleeding",
      "Stroke Symptoms",
    ];
    
    if (formData.symptoms.some((s) => criticalSymptoms.includes(s))) {
      score = Math.min(score, 2);
    }

    // Consciousness level
    if (formData.consciousness === "unresponsive") score = 1;
    if (formData.consciousness === "pain") score = Math.min(score, 2);

    // Breathing
    if (formData.breathing === "severe") score = 1;
    if (formData.breathing === "difficulty") score = Math.min(score, 2);

    // Pain level
    if (formData.painLevel >= 8) score = Math.min(score, 2);
    if (formData.painLevel >= 6) score = Math.min(score, 3);

    // Vital signs
    const heartRate = parseInt(formData.heartRate);
    if (heartRate > 120 || heartRate < 50) score = Math.min(score, 2);

    const systolic = parseInt(formData.bloodPressureSystolic);
    if (systolic > 180 || systolic < 90) score = Math.min(score, 2);

    const temp = parseFloat(formData.temperature);
    if (temp > 39.5 || temp < 35) score = Math.min(score, 2);

    const o2 = parseInt(formData.oxygenSaturation);
    if (o2 < 90) score = Math.min(score, 1);
    if (o2 < 94) score = Math.min(score, 2);

    return score.toString() as TriageLevel;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.chiefComplaint || formData.symptoms.length === 0) {
      toast.error("Please provide your chief complaint and symptoms");
      return;
    }

    setSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirectedFrom=/emergency");
        return;
      }

      // Get patient record
      const { data: patient } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!patient) {
        toast.error("Patient record not found");
        return;
      }

      // Calculate triage level
      const triageLevel = calculateTriageLevel();

      // Find nearest hospital with emergency capacity
      const { data: hospitals } = await supabase
        .from("hospitals")
        .select("*, addresses(*)")
        .eq("is_active", true)
        .gt("emergency_capacity", 0)
        .order("rating", { ascending: false })
        .limit(1);

      if (!hospitals || hospitals.length === 0) {
        toast.error("No emergency hospitals available");
        return;
      }

      const hospital = hospitals[0];
      setNearestHospital(hospital);

      // Get an available emergency doctor
      const { data: doctorData } = await supabase
        .from("doctor_hospitals")
        .select(`
          doctors!inner (
            id,
            is_available_for_emergency
          )
        `)
        .eq("hospital_id", hospital.id)
        .eq("is_active", true)
        .limit(1);

      const doctorId = (doctorData as any)?.[0]?.doctors?.id;

      if (!doctorId) {
        toast.error("No emergency doctors available");
        return;
      }

      // Create emergency appointment
      const scheduledTime = new Date();
      
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: patient.id,
          doctor_id: doctorId,
          hospital_id: hospital.id,
          scheduled_time: scheduledTime.toISOString(),
          appointment_type: "emergency",
          triage_level: triageLevel,
          status: "scheduled",
          token_number: `EMR-${nanoid(8)}`,
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create triage record
      const { error: triageError } = await supabase
        .from("emergency_triage")
        .insert({
          appointment_id: appointment.id,
          patient_id: patient.id,
          symptoms: formData.symptoms,
          chief_complaint: formData.chiefComplaint,
          pain_level: formData.painLevel,
          consciousness: formData.consciousness,
          breathing: formData.breathing,
          heart_rate: formData.heartRate ? parseInt(formData.heartRate) : null,
          blood_pressure_systolic: formData.bloodPressureSystolic
            ? parseInt(formData.bloodPressureSystolic)
            : null,
          blood_pressure_diastolic: formData.bloodPressureDiastolic
            ? parseInt(formData.bloodPressureDiastolic)
            : null,
          temperature: formData.temperature ? parseFloat(formData.temperature) : null,
          oxygen_saturation: formData.oxygenSaturation
            ? parseInt(formData.oxygenSaturation)
            : null,
          triage_level: triageLevel,
          auto_assigned_level: triageLevel,
          manual_override: false,
        });

      if (triageError) console.error("Triage error:", triageError);

      // Create high-priority queue entry
      const { error: queueError } = await supabase
        .from("queue_entries")
        .insert({
          appointment_id: appointment.id,
          hospital_id: hospital.id,
          queue_position: parseInt(triageLevel), // Emergency cases get priority positions
          is_active: true,
        });

      if (queueError) console.error("Queue error:", queueError);

      // Update hospital emergency occupancy
      await supabase
        .from("hospitals")
        .update({
          current_emergency_occupancy: hospital.current_emergency_occupancy + 1,
        })
        .eq("id", hospital.id);

      setEmergencyToken(appointment.token_number);
      setStep(2);

      toast.success("Emergency booking created!", {
        description: `Priority Level ${triageLevel} - Please proceed to hospital immediately`,
      });
    } catch (error: any) {
      console.error("Emergency booking error:", error);
      toast.error("Failed to create emergency booking", {
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2 && emergencyToken && nearestHospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white p-3">
                  <CheckCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Emergency Booking Confirmed</CardTitle>
                  <CardDescription className="text-red-50">
                    Please proceed to the hospital immediately
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Token */}
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm font-medium text-red-600">EMERGENCY TOKEN</p>
                <p className="mt-2 text-4xl font-bold text-red-600">{emergencyToken}</p>
                <Badge variant="destructive" className="mt-4">
                  Priority Level {calculateTriageLevel()}
                </Badge>
              </div>

              {/* Hospital Info */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Hospital Details</h3>
                <div className="rounded-lg border bg-white p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Hospital Name</p>
                    <p className="font-semibold text-lg">{nearestHospital.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm">
                      {nearestHospital.addresses.street_address}
                      <br />
                      {nearestHospital.addresses.city}, {nearestHospital.addresses.state} -{" "}
                      {nearestHospital.addresses.postal_code}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Emergency Contact</p>
                    <a
                      href={`tel:${nearestHospital.phone_number}`}
                      className="flex items-center gap-2 font-semibold text-red-600 hover:text-red-700"
                    >
                      <Phone className="h-4 w-4" />
                      {nearestHospital.phone_number}
                    </a>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <a href={`tel:${nearestHospital.phone_number}`} className="block">
                  <Button variant="destructive" size="lg" className="w-full gap-2">
                    <Phone className="h-5 w-5" />
                    Call Hospital Emergency
                  </Button>
                </a>
                
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/appointments">
                    View My Appointments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Important Notice */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-900">
                  ⚠️ <strong>IMPORTANT:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm text-amber-800">
                  <li>• Bring this token number with you</li>
                  <li>• Have your ID and insurance card ready</li>
                  <li>• Inform family members about your visit</li>
                  <li>• If condition worsens, call emergency services (112)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700">
            <AlertCircle className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">EMERGENCY BOOKING</span>
          </div>
          <h1 className="text-3xl font-bold">Emergency Triage Assessment</h1>
          <p className="mt-2 text-gray-600">
            Complete this assessment for priority emergency care
          </p>
        </div>

        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle>Emergency Details</CardTitle>
            <CardDescription>
              Provide accurate information for proper triage assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chief Complaint */}
              <div className="space-y-2">
                <Label htmlFor="complaint">Chief Complaint *</Label>
                <Input
                  id="complaint"
                  placeholder="Describe your primary concern (e.g., chest pain, difficulty breathing)"
                  value={formData.chiefComplaint}
                  onChange={(e) =>
                    setFormData({ ...formData, chiefComplaint: e.target.value })
                  }
                  required
                  className="text-base"
                />
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label>Select Symptoms *</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`rounded-lg border p-3 text-sm transition-all ${
                        formData.symptoms.includes(symptom)
                          ? "border-red-500 bg-red-50 text-red-700 font-medium"
                          : "hover:border-gray-400"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Level */}
              <div className="space-y-2">
                <Label>Pain Level (0-10) *</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.painLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, painLevel: parseInt(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <Badge
                    variant={formData.painLevel >= 7 ? "destructive" : "secondary"}
                    className="text-lg font-bold w-12 justify-center"
                  >
                    {formData.painLevel}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>No Pain</span>
                  <span>Worst Pain</span>
                </div>
              </div>

              {/* Consciousness */}
              <div className="space-y-2">
                <Label>Consciousness Level *</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["alert", "verbal", "pain", "unresponsive"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, consciousness: level })}
                      className={`rounded-lg border p-3 text-sm capitalize transition-all ${
                        formData.consciousness === level
                          ? "border-primary bg-blue-50 font-medium"
                          : "hover:border-gray-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breathing */}
              <div className="space-y-2">
                <Label>Breathing Status *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "difficulty", "severe"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, breathing: status })}
                      className={`rounded-lg border p-3 text-sm capitalize transition-all ${
                        formData.breathing === status
                          ? "border-primary bg-blue-50 font-medium"
                          : "hover:border-gray-400"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-3">
                <Label>Vital Signs (if known)</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Heart Rate (bpm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g., 75"
                      value={formData.heartRate}
                      onChange={(e) =>
                        setFormData({ ...formData, heartRate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Blood Pressure
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Systolic"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) =>
                          setFormData({ ...formData, bloodPressureSystolic: e.target.value })
                        }
                      />
                      <span>/</span>
                      <Input
                        type="number"
                        placeholder="Diastolic"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bloodPressureDiastolic: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature (°C)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 37.5"
                      value={formData.temperature}
                      onChange={(e) =>
                        setFormData({ ...formData, temperature: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Oxygen Saturation (%)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 98"
                      value={formData.oxygenSaturation}
                      onChange={(e) =>
                        setFormData({ ...formData, oxygenSaturation: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Emergency Disclaimer:</strong> If you are experiencing a
                  life-threatening emergency, please call emergency services (112) or visit the
                  nearest emergency room immediately.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                variant="destructive"
                className="w-full gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Emergency...
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    Submit Emergency Assessment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


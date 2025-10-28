"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MedicalHistory } from "@/components/profile/medical-history";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Heart,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { createPatientRecord, updateUserProfile, updatePatientProfile } from "./actions";
import { createClient } from "@/lib/supabase/client";

interface ProfileClientProps {
  patient: any;
  isNew?: boolean;
}

export function ProfileClient({ patient: initialPatient, isNew = false }: ProfileClientProps) {
  const [patient, setPatient] = useState(initialPatient);
  const [isEditing, setIsEditing] = useState(isNew); // Auto-enable editing for new profiles
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "medical">("profile");
  const [userEmail, setUserEmail] = useState<string | null>(initialPatient?.users?.email || null);
  const [formData, setFormData] = useState({
    first_name: initialPatient?.users?.first_name || "",
    last_name: initialPatient?.users?.last_name || "",
    phone_number: initialPatient?.users?.phone_number || "",
    date_of_birth: initialPatient?.users?.date_of_birth || "",
    blood_group: initialPatient?.blood_group || "",
    emergency_contact_name: initialPatient?.emergency_contact_name || "",
    emergency_contact_phone: initialPatient?.emergency_contact_phone || "",
  });

  // Get user email from auth session if not in patient object
  useEffect(() => {
    const getEmail = async () => {
      if (!userEmail) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
          // Update patient object with email
          setPatient((prev: any) => ({
            ...prev,
            users: {
              ...prev.users,
              email: user.email,
            }
          }));
        }
      }
    };
    getEmail();
  }, [userEmail]);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validation
      if (!patient?.users?.id) {
        throw new Error("User ID not found. Please refresh and try again.");
      }
      if (!formData.first_name?.trim()) {
        throw new Error("First name is required");
      }
      if (!formData.last_name?.trim()) {
        throw new Error("Last name is required");
      }
      if (!formData.phone_number?.trim()) {
        throw new Error("Phone number cannot be empty");
      }

      // Check if patient needs to be created (temporary ID or no ID)
      const isTemporary = !patient?.id || patient.id.toString().startsWith('temp-') || (patient as any)._isTemporary;
      let currentPatientId = patient.id;

      if (isTemporary) {
        const emailToUse = patient.users?.email || userEmail;
        
        if (!emailToUse) {
          throw new Error("User email is required. Please refresh the page and try again.");
        }
        
        try {
          const result = await createPatientRecord(patient.users.id, {
            email: emailToUse,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
          });
          
          if (!result.success) {
            throw new Error(result.error || "Failed to create patient record");
          }
          
          currentPatientId = result.data.id;
        } catch (createError: any) {
          throw createError;
        }
      }

      // Update user profile using server action
      const userData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number?.trim() || null,
        date_of_birth: formData.date_of_birth || null,
      };
      
      try {
        const userResult = await updateUserProfile(patient.users.id, userData);

        if (!userResult.success) {
          throw new Error(userResult.error || "Failed to update user profile");
        }
      } catch (userError: any) {
        throw userError;
      }

      // Update patient profile using server action (only if not just created)
      if (!isTemporary) {
        const patientData = {
          blood_group: formData.blood_group?.trim() || null,
          emergency_contact_name: formData.emergency_contact_name?.trim() || null,
          emergency_contact_phone: formData.emergency_contact_phone?.trim() || null,
        };
        
        try {
          const patientResult = await updatePatientProfile(currentPatientId, patientData);

          if (!patientResult.success) {
            throw new Error(patientResult.error || "Failed to update patient profile");
          }
        } catch (patientError: any) {
          throw patientError;
        }
      }

      // Update local state
      setPatient({
        ...patient,
        id: currentPatientId,
        users: {
          ...patient.users,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          phone_number: formData.phone_number?.trim() || null,
          date_of_birth: formData.date_of_birth || null,
        },
        blood_group: formData.blood_group?.trim() || null,
        emergency_contact_name: formData.emergency_contact_name?.trim() || null,
        emergency_contact_phone: formData.emergency_contact_phone?.trim() || null,
        _isTemporary: false,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: patient.users.first_name || "",
      last_name: patient.users.last_name || "",
      phone_number: patient.users.phone_number || "",
      date_of_birth: patient.users.date_of_birth || "",
      blood_group: patient.blood_group || "",
      emergency_contact_name: patient.emergency_contact_name || "",
      emergency_contact_phone: patient.emergency_contact_phone || "",
    });
    setIsEditing(false);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Debug: Log current state
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal and health information</p>
        </div>
        {!isEditing && activeTab === "profile" ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <User className="h-4 w-4" />
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab("medical")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
            activeTab === "medical"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <Heart className="h-4 w-4" />
          Medical History
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      placeholder="Enter your first name"
                      required
                    />
                  ) : (
                    <p className="text-lg font-medium">{patient.users.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      placeholder="Enter your last name"
                      required
                    />
                  ) : (
                    <p className="text-lg font-medium">{patient.users.last_name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-lg">{patient.users.email}</p>
                </div>
                <p className="text-xs text-gray-600">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    placeholder="Enter your phone number"
                    required
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-lg">{patient.users.phone_number}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({ ...formData, date_of_birth: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-lg">
                      {patient.users.date_of_birth
                        ? new Date(patient.users.date_of_birth).toLocaleDateString()
                        : "Not set"}
                      {patient.users.date_of_birth && (
                        <span className="ml-2 text-sm text-gray-600">
                          ({calculateAge(patient.users.date_of_birth)} years)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  {isEditing ? (
                    <select
                      id="blood_group"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.blood_group}
                      onChange={(e) =>
                        setFormData({ ...formData, blood_group: e.target.value })
                      }
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium">
                      {patient.blood_group || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  {isEditing ? (
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-lg">
                      {patient.emergency_contact_name || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  {isEditing ? (
                    <Input
                      id="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact_phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-lg">
                      {patient.emergency_contact_phone || "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold">
                {patient.users.first_name} {patient.users.last_name}
              </h2>
              <p className="mt-1 text-gray-600">{patient.users.email}</p>
              <div className="mt-4 flex justify-center gap-2">
                {patient.blood_group && (
                  <Badge className="bg-red-500">{patient.blood_group}</Badge>
                )}
                {patient.users.date_of_birth && (
                  <Badge variant="outline">
                    {calculateAge(patient.users.date_of_birth)} years
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Health Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Health Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blood Group</span>
                <span className="font-semibold">
                  {patient.blood_group || "Not set"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      ) : patient?.id ? (
        <MedicalHistory patientId={patient.id} />
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
          <p className="text-yellow-800">
            Please complete your profile first to view medical history
          </p>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";
import { nanoid } from "nanoid";
import Link from "next/link";
import { MOCK_HOSPITALS } from "@/lib/data/mock-hospitals";
import { MEDICAL_CONDITIONS, MEDICAL_CATEGORIES } from "@/lib/data/medical-conditions";

interface Doctor {
  id: string;
  specialization: string;
  consultation_fee: number;
  years_of_experience: number;
  rating: number;
  users: {
    first_name: string;
    last_name: string;
  };
}

interface Department {
  id: string;
  name: string;
  description: string;
}

// Inline doctor generator as fallback
function generateDoctorsForHospital(_hospitalId: string) {
  const specialties = [
    { name: 'General Medicine', qualification: 'MBBS, MD (Medicine)', fee: 500, uuid: '550e8400-e29b-41d4-a716-446655440001' },
    { name: 'Cardiology', qualification: 'MD, DM (Cardiology)', fee: 1200, uuid: '550e8400-e29b-41d4-a716-446655440002' },
    { name: 'Orthopedics', qualification: 'MS (Orthopedics)', fee: 1000, uuid: '550e8400-e29b-41d4-a716-446655440003' },
    { name: 'Pediatrics', qualification: 'MD (Pediatrics)', fee: 800, uuid: '550e8400-e29b-41d4-a716-446655440004' },
    { name: 'Dermatology', qualification: 'MD (Dermatology)', fee: 900, uuid: '550e8400-e29b-41d4-a716-446655440005' }
  ];

  const firstNames = ['Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy'];

  return specialties.map((specialty, index) => ({
    id: specialty.uuid, // Use valid UUID
    specialization: specialty.name,
    consultation_fee: specialty.fee,
    years_of_experience: 8 + index * 2,
    rating: 4.3 + (index * 0.1),
    is_mock: true, // Flag to indicate this is mock data
    users: {
      first_name: firstNames[index],
      last_name: lastNames[index]
    }
  }));
}

export default function BookAppointmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hospital, setHospital] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [patient, setPatient] = useState<any>(null);
  
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("General Medicine");

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('🔍 User:', user);
      
      if (!user) {
        console.log('⚠️ No user logged in, redirecting to login...');
        router.push("/login");
        return;
      }

      // Get patient record
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      // If no patient record, create one automatically
      if (!patientData || patientError) {
        console.log('Creating new patient record...');
        const { data: newPatient, error: createError } = await supabase
          .from("patients")
          .insert({
            user_id: user.id,
            blood_group: "Not specified",
            emergency_contact_name: "Not specified",
            emergency_contact_phone: "Not specified"
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating patient:', createError);
          // Create a temporary patient object so page can still load
          const tempPatient = {
            id: `temp-${user.id}`,
            user_id: user.id,
            blood_group: "Not specified",
            emergency_contact_name: "Not specified",
            emergency_contact_phone: "Not specified"
          };
          setPatient(tempPatient);
          toast.error("Failed to create patient record. You can still browse, but booking will require profile completion.");
        } else {
          setPatient(newPatient);
          console.log('Patient created successfully:', newPatient);
        }
      } else {
        setPatient(patientData);
      }

      // Get hospital
      const { data: hospitalData } = await supabase
        .from("hospitals")
        .select("*, addresses(*)")
        .eq("id", params.id)
        .single();
      
      // If no hospital in DB, use mock data
      if (!hospitalData) {
        const mockHospital = MOCK_HOSPITALS.find(h => h.id === params.id);
        if (mockHospital) {
          setHospital({
            id: mockHospital.id,
            name: mockHospital.name,
            phone_number: mockHospital.phone,
            addresses: {
              street_address: mockHospital.address,
              city: mockHospital.city,
              state: mockHospital.state,
            }
          });
        }
      } else {
        setHospital(hospitalData);
      }

      // Get departments (skip if using mock data)
      const { data: departmentsData } = await supabase
        .from("departments")
        .select("*")
        .eq("hospital_id", params.id)
        .eq("is_active", true);
      
      setDepartments(departmentsData || []);

      // Get doctors
      const { data: doctorsData } = await supabase
        .from("doctor_hospitals")
        .select(`
          doctors (
            id,
            specialization,
            consultation_fee,
            years_of_experience,
            rating,
            users (first_name, last_name)
          )
        `)
        .eq("hospital_id", params.id)
        .eq("is_available_for_emergency", true);
      
      let doctorsList = doctorsData?.map((item: any) => item.doctors).filter(Boolean) || [];
      
      // If no doctors in DB, generate mock doctors
      if (doctorsList.length === 0) {
        console.log('📍 No doctors in database, generating mock doctors...');
        console.log('Hospital ID:', params.id);
        
        // Use inline generator to ensure it always works
        doctorsList = generateDoctorsForHospital(params.id);
        console.log('✅ Generated doctors:', doctorsList.length, 'doctors');
        console.log('Doctors:', doctorsList);
      }
      
      console.log('Final doctors array length:', doctorsList.length);
      setDoctors(doctorsList);

      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      
      // EMERGENCY FALLBACK: If anything fails, still generate doctors!
      console.log('🚨 Error occurred, generating fallback doctors...');
      const fallbackDoctors = generateDoctorsForHospital(params.id);
      setDoctors(fallbackDoctors);
      
      toast.error("Some data failed to load, but you can still view doctors and book.");
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedCondition && !customReason) {
      toast.error("Please select a condition or describe your symptoms");
      return;
    }

    if (!patient || !patient.id) {
      toast.error("Patient information not found. Please refresh and try again.");
      return;
    }

    setSubmitting(true);

    try {
      // Create appointment
      const scheduledTime = new Date(`${selectedDate}T${selectedTime}:00`);
      
      // Combine reason and custom notes
      const reasonForVisit = selectedCondition 
        ? `${selectedCondition}${customReason ? ` - ${customReason}` : ''}`
        : customReason;
      
      // Check if selected doctor is a mock doctor
      const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
      const isMockDoctor = (selectedDoctorData as any)?.is_mock === true;
      
      // For mock doctors, we need to handle booking differently
      if (isMockDoctor) {
        // Create a simulated appointment (store in localStorage for demo)
        const mockAppointment = {
          id: `mock-${nanoid(10)}`,
          patient_id: patient.id,
          doctor: selectedDoctorData,
          hospital_id: params.id,
          scheduled_time: scheduledTime.toISOString(),
          appointment_type: "routine",
          status: "scheduled",
          token_number: `TOKEN-${nanoid(8).toUpperCase()}`,
          notes: reasonForVisit,
          created_at: new Date().toISOString()
        };
        
        // Store in localStorage for demo purposes
        const existingAppointments = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
        existingAppointments.push(mockAppointment);
        localStorage.setItem('mock_appointments', JSON.stringify(existingAppointments));
        
        toast.success("Appointment booked successfully!", {
          description: `Your token number is ${mockAppointment.token_number}. This is a demo booking.`,
        });
        
        router.push("/appointments");
        return;
      }
      
      // For real doctors, proceed with database insertion
      const { data: appointment, error: appointmentError} = await supabase
        .from("appointments")
        .insert({
          patient_id: patient.id,
          doctor_id: selectedDoctor,
          hospital_id: params.id,
          department_id: selectedDepartment || null,
          scheduled_time: scheduledTime.toISOString(),
          appointment_type: "routine",
          status: "scheduled",
          token_number: `TMP-${nanoid(8)}`, // Temporary, will be replaced by trigger
          notes: reasonForVisit, // Add reason for visit
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create queue entry
      const { error: queueError } = await supabase
        .from("queue_entries")
        .insert({
          appointment_id: appointment.id,
          hospital_id: params.id,
          department_id: selectedDepartment || null,
          queue_position: 999, // Will be updated by trigger
          is_active: false, // Becomes active on check-in
        });

      if (queueError) console.error("Queue entry error:", queueError);

      // Send confirmation email (don't wait for it)
      fetch("/api/send-email/confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: appointment.id }),
      }).catch((error) => console.error("Error sending confirmation email:", error));

      toast.success("Appointment booked successfully!", {
        description: `Your token number is ${appointment.token_number}. Check your email for confirmation.`,
      });

      // Redirect to appointments page
      router.push("/appointments");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("Failed to book appointment", {
        description: error.message || "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);
  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href={`/hospitals/${params.id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hospital
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
                <CardDescription>
                  Schedule your visit to {hospital?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Department Selection */}
                  {departments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Department (Optional)</Label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {departments.map((dept) => (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => setSelectedDepartment(dept.id)}
                            className={`rounded-lg border p-4 text-left transition-all ${
                              selectedDepartment === dept.id
                                ? "border-primary bg-blue-50 ring-2 ring-primary"
                                : "hover:border-gray-400"
                            }`}
                          >
                            <p className="font-medium">{dept.name}</p>
                            {dept.description && (
                              <p className="mt-1 text-sm text-gray-600">{dept.description}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor Selection */}
                  <div className="space-y-2">
                    <Label>Select Doctor *</Label>
                    {doctors.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                        <p className="text-gray-600">No doctors available at this hospital.</p>
                        <p className="mt-2 text-sm text-gray-500">Please try another hospital or contact support.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {doctors.map((doctor) => (
                        <button
                          key={doctor.id}
                          type="button"
                          onClick={() => setSelectedDoctor(doctor.id)}
                          className={`w-full rounded-lg border p-4 text-left transition-all ${
                            selectedDoctor === doctor.id
                              ? "border-primary bg-blue-50 ring-2 ring-primary"
                              : "hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">
                                Dr. {doctor?.users?.first_name || (doctor as any)?.first_name || "Unknown"} {doctor?.users?.last_name || (doctor as any)?.last_name || "Doctor"}
                              </p>
                              <p className="text-sm text-gray-600">{doctor?.specialization || "General Physician"}</p>
                              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                <span>{doctor?.years_of_experience || 0} years exp.</span>
                                <span>⭐ {doctor?.rating?.toFixed(1) || "4.5"}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-primary">
                                {formatCurrency(doctor?.consultation_fee || 500)}
                              </p>
                            </div>
                          </div>
                        </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Select Date *</Label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      max={
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="space-y-2">
                      <Label>Select Time *</Label>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                              selectedTime === time
                                ? "border-primary bg-primary text-white"
                                : "hover:border-gray-400"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reason for Visit */}
                  <div className="space-y-2">
                    <Label>Reason for Visit / Symptoms *</Label>
                    
                    {/* Category Selection */}
                    <div className="mb-3">
                      <Label className="text-xs text-gray-600">Select Category</Label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSelectedCondition("");
                        }}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {MEDICAL_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Condition Selection */}
                    <div className="mb-3">
                      <Label className="text-xs text-gray-600">Select Condition</Label>
                      <select
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Choose a condition...</option>
                        {MEDICAL_CONDITIONS.filter(c => c.category === selectedCategory).map((condition) => (
                          <option key={condition.id} value={condition.name}>
                            {condition.name} {condition.urgency === 'emergency' ? '🚨' : condition.urgency === 'urgent' ? '⚠️' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom Reason */}
                    <div>
                      <Label className="text-xs text-gray-600">Or describe your symptoms (Optional)</Label>
                      <textarea
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Describe your symptoms or reason for visit..."
                        className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        rows={3}
                      />
                    </div>

                    {selectedCondition && (
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
                        <p className="font-medium text-blue-900">
                          {MEDICAL_CONDITIONS.find(c => c.name === selectedCondition)?.name}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Common symptoms: {MEDICAL_CONDITIONS.find(c => c.name === selectedCondition)?.commonSymptoms.slice(0, 3).join(", ")}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Recommended: {MEDICAL_CONDITIONS.find(c => c.name === selectedCondition)?.recommendedSpecialty}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hospital */}
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-medium">{hospital?.name}</p>
                  <p className="text-xs text-gray-500">
                    {hospital?.addresses?.city}, {hospital?.addresses?.state}
                  </p>
                </div>

                {/* Doctor */}
                {selectedDoctorData && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">
                      Dr. {selectedDoctorData?.users?.first_name || (selectedDoctorData as any)?.first_name || "Unknown"}{" "}
                      {selectedDoctorData?.users?.last_name || (selectedDoctorData as any)?.last_name || "Doctor"}
                    </p>
                    <p className="text-xs text-gray-500">{selectedDoctorData?.specialization || "General Physician"}</p>
                  </div>
                )}

                {/* Date & Time */}
                {selectedDate && selectedTime && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Appointment</p>
                    <div className="mt-1 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">{formatDate(selectedDate)}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">{selectedTime}</p>
                    </div>
                  </div>
                )}

                {/* Consultation Fee */}
                {selectedDoctorData && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(selectedDoctorData?.consultation_fee || 500)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> Please arrive 15 minutes before your appointment time.
                    Bring your ID and insurance card if applicable.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


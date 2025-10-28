import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QueueTracker } from "@/components/queue/queue-tracker";
import { AppointmentQR } from "@/components/appointments/appointment-qr";
import { AppointmentActions } from "@/components/appointments/appointment-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Building2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
  formatCurrency,
} from "@/lib/utils";

export default async function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get patient record
  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!patient) {
    return <div>Patient record not found</div>;
  }

  // Fetch appointment details
  const { data: appointment, error } = await supabase
    .from("appointments")
    .select(`
      *,
      hospitals (
        name,
        phone_number,
        email,
        addresses (
          street_address,
          city,
          state,
          postal_code
        )
      ),
      doctors (
        specialization,
        consultation_fee,
        qualification,
        experience_years,
        users (first_name, last_name, email, phone_number)
      ),
      departments (name, floor_number),
      emergency_triage (
        triage_level,
        chief_complaint,
        symptoms,
        vital_signs,
        severity_score
      )
    `)
    .eq("id", params.id)
    .eq("patient_id", patient.id)
    .single();

  if (error || !appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-medium">Appointment not found</h3>
          <p className="mt-2 text-sm text-gray-600">
            This appointment doesn't exist or you don't have access to it.
          </p>
          <Link href="/appointments">
            <Button className="mt-4">Back to Appointments</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const showQueueTracker =
    appointment.status === "confirmed" ||
    appointment.status === "checked_in" ||
    appointment.status === "in_consultation";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/appointments">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Appointments
        </Button>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Queue Tracker */}
        {showQueueTracker && (
          <div className="lg:col-span-2">
            <QueueTracker appointmentId={appointment.id} />
          </div>
        )}

        {/* Right Column / Full Width - Appointment Details */}
        <div className={showQueueTracker ? "lg:col-span-1" : "lg:col-span-3"}>
          <div className="space-y-6">
            {/* QR Code - Only show for confirmed/checked_in appointments */}
            {(appointment.status === "confirmed" || appointment.status === "checked_in") && (
              <AppointmentQR
                appointmentId={appointment.id}
                tokenNumber={appointment.token_number}
                patientName={`${patient.users.first_name} ${patient.users.last_name}`}
                hospitalName={appointment.hospitals.name}
                appointmentDate={formatDate(appointment.scheduled_time)}
                appointmentTime={formatTime(appointment.scheduled_time)}
              />
            )}

            {/* Appointment Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>Appointment Details</CardTitle>
                  <Badge className={getAppointmentStatusColor(appointment.status)}>
                    {getAppointmentStatusLabel(appointment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Token Number */}
                <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-center">
                  <p className="text-sm text-gray-600">Token Number</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {appointment.token_number}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(appointment.scheduled_time)} at{" "}
                      {formatTime(appointment.scheduled_time)}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Appointment Type</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {appointment.appointment_type}
                      {appointment.is_followup && " (Follow-up)"}
                    </p>
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Consultation Fee</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(appointment.doctors.consultation_fee)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hospital Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{appointment.hospitals.name}</p>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p>{appointment.hospitals.addresses.street_address}</p>
                    <p>
                      {appointment.hospitals.addresses.city},{" "}
                      {appointment.hospitals.addresses.state}{" "}
                      {appointment.hospitals.addresses.postal_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p>{appointment.hospitals.phone_number}</p>
                </div>

                {appointment.departments && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm">
                    <p className="font-medium">{appointment.departments.name}</p>
                    <p className="text-xs text-gray-600">
                      Floor {appointment.departments.floor_number}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Doctor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">
                    Dr. {appointment.doctors.users.first_name}{" "}
                    {appointment.doctors.users.last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointment.doctors.specialization}
                  </p>
                </div>

                <div className="text-sm">
                  <p className="text-gray-600">Qualification</p>
                  <p className="font-medium">{appointment.doctors.qualification}</p>
                </div>

                <div className="text-sm">
                  <p className="text-gray-600">Experience</p>
                  <p className="font-medium">{appointment.doctors.experience_years} years</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p>{appointment.doctors.users.phone_number}</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Triage Info */}
            {appointment.emergency_triage && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">Emergency Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-red-900">Chief Complaint</p>
                    <p className="text-sm text-red-700">
                      {appointment.emergency_triage.chief_complaint}
                    </p>
                  </div>

                  {appointment.emergency_triage.symptoms && (
                    <div>
                      <p className="text-sm font-medium text-red-900">Symptoms</p>
                      <p className="text-sm text-red-700">
                        {Array.isArray(appointment.emergency_triage.symptoms)
                          ? appointment.emergency_triage.symptoms.join(", ")
                          : appointment.emergency_triage.symptoms}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-lg bg-white p-3">
                    <span className="text-sm font-medium text-red-900">Triage Level</span>
                    <Badge variant="destructive">
                      Level {appointment.emergency_triage.triage_level}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white p-3">
                    <span className="text-sm font-medium text-red-900">
                      Severity Score
                    </span>
                    <span className="font-bold text-red-600">
                      {appointment.emergency_triage.severity_score}/10
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {appointment.status === "confirmed" && (
              <Card>
                <CardContent className="p-4">
                  <AppointmentActions appointment={appointment} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


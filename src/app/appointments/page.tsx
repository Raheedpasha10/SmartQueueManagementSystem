import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  Hospital,
  UserPlus,
} from "lucide-react";
import { AppointmentsList } from "@/components/appointments/appointments-list";

export default async function AppointmentsPage() {
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
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={UserPlus}
          title="Complete Your Profile"
          description="To book appointments and manage your healthcare, please complete your patient profile first."
          actionLabel="Complete Profile"
          actionHref="/profile"
        />
      </div>
    );
  }

  // Fetch all appointments
  const { data: dbAppointments } = await supabase
    .from("appointments")
    .select(`
      *,
      hospitals (name, phone_number, addresses (city, state)),
      doctors (
        specialization,
        consultation_fee,
        users (first_name, last_name)
      ),
      departments (name),
      emergency_triage (triage_level, chief_complaint)
    `)
    .eq("patient_id", patient.id)
    .order("scheduled_time", { ascending: false});

  const appointments = dbAppointments || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <p className="text-gray-600">Manage your hospital appointments</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">
                  {appointments.filter((a: any) => new Date(a.scheduled_time) >= new Date()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Hospital className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {appointments.filter((a: any) => a.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency</p>
                <p className="text-2xl font-bold">
                  {appointments.filter((a: any) => a.appointment_type === "emergency").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <AppointmentsList dbAppointments={appointments} patientId={patient.id} />
    </div>
  );
}


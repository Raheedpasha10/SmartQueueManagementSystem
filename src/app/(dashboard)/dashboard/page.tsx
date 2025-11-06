import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Hospital,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  CheckCircle,
} from "lucide-react";
import { DashboardAppointments } from "@/components/dashboard/dashboard-appointments";
import { VerificationMessage } from "@/components/dashboard/verification-message";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user's patient record with user details
  const { data: patient } = await supabase
    .from("patients")
    .select(`
      *,
      users (
        first_name,
        last_name,
        email
      )
    `)
    .eq("user_id", user.id)
    .single();

  // Fetch upcoming appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      hospitals (name, phone_number),
      doctors (
        *,
        users (first_name, last_name)
      )
    `)
    .eq("patient_id", patient?.id)
    .gte("scheduled_time", new Date().toISOString())
    .order("scheduled_time", { ascending: true })
    .limit(5);

  // Calculate stats
  const totalAppointments = patient?.total_appointments || 0;
  const upcomingCount = appointments?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <VerificationMessage />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="text-gray-600">
          Manage your appointments and health records
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/hospitals">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-l-4 border-l-blue-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Hospital className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Book</p>
                <p className="text-xl font-bold">Appointment</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/emergency">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-l-4 border-l-red-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency</p>
                <p className="text-xl font-bold">Booking</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold">{totalAppointments}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-purple-100 p-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-xl font-bold">{upcomingCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Appointments - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
                  <CardDescription className="text-sm">
                    Your scheduled appointments
                  </CardDescription>
                </div>
                <Link href="/appointments">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {(appointments && appointments.length > 0) || patient?.id ? (
                <DashboardAppointments 
                  dbAppointments={appointments || []} 
                  patientId={patient?.id || null}
                />
              ) : (
                <EmptyState
                  icon={Stethoscope}
                  title="No Upcoming Appointments"
                  description="Start your healthcare journey by booking your first appointment with one of our partner hospitals."
                  actionLabel="Browse Hospitals"
                  actionHref="/hospitals"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Info Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {patient?.users?.first_name || 'User'} {patient?.users?.last_name || ''}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 p-3 rounded-lg bg-blue-50">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Book appointments in advance for better availability
                </p>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Keep your profile updated with current information
                </p>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-purple-50">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Use emergency booking for urgent medical needs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


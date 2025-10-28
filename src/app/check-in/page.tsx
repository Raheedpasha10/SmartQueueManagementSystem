"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  Search,
  User,
  Calendar,
  Clock,
  Building2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatDate, formatTime } from "@/lib/utils";

export default function CheckInPage() {
  const [scanning, setScanning] = useState(false);
  const [tokenNumber, setTokenNumber] = useState("");
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const supabase = createClient();

  const handleTokenSearch = async () => {
    if (!tokenNumber.trim()) {
      toast.error("Please enter a token number");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (
            users (first_name, last_name, phone_number)
          ),
          doctors (
            users (first_name, last_name)
          ),
          hospitals (name),
          departments (name)
        `)
        .eq("token_number", tokenNumber.toUpperCase())
        .single();

      if (error || !data) {
        toast.error("Appointment not found");
        setAppointment(null);
        return;
      }

      setAppointment(data);
      
      if (data.status === "checked_in") {
        setCheckedIn(true);
        toast.info("Patient already checked in");
      } else if (data.status === "completed") {
        toast.info("Appointment already completed");
      } else if (data.status === "cancelled") {
        toast.error("Appointment was cancelled");
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Failed to fetch appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!appointment) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "checked_in",
          actual_checkin_time: new Date().toISOString(),
        })
        .eq("id", appointment.id);

      if (error) throw error;

      toast.success("Patient checked in successfully!");
      setCheckedIn(true);
      setAppointment({
        ...appointment,
        status: "checked_in",
      });
    } catch (error: any) {
      console.error("Error checking in:", error);
      toast.error(error.message || "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTokenNumber("");
    setAppointment(null);
    setCheckedIn(false);
    setScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-white p-6 shadow-lg">
              <QrCode className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">MediQueue Check-In</h1>
          <p className="text-lg text-gray-600">Scan QR code or enter token number</p>
        </div>

        {/* Search Card */}
        <Card className="mb-6 shadow-xl">
          <CardHeader>
            <CardTitle>Patient Check-In</CardTitle>
            <CardDescription>
              Enter the patient's token number to check them in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter token number (e.g., APT-001)"
                  value={tokenNumber}
                  onChange={(e) => setTokenNumber(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleTokenSearch()}
                  className="text-lg"
                />
                <Button
                  onClick={handleTokenSearch}
                  disabled={loading}
                  className="gap-2"
                  size="lg"
                >
                  <Search className="h-5 w-5" />
                  Search
                </Button>
              </div>

              {/* QR Scanner Placeholder */}
              <div className="relative">
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
                  <div className="text-center">
                    <Camera className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      QR Code Scanner (Camera integration)
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setScanning(!scanning)}
                    >
                      {scanning ? "Stop Scanner" : "Start Scanner"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        {appointment && (
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Appointment Details</CardTitle>
                  <CardDescription>Token #{appointment.token_number}</CardDescription>
                </div>
                <Badge
                  className={
                    checkedIn || appointment.status === "checked_in"
                      ? "bg-green-500"
                      : appointment.status === "completed"
                      ? "bg-gray-500"
                      : appointment.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }
                >
                  {checkedIn || appointment.status === "checked_in"
                    ? "Checked In"
                    : appointment.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Patient Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">
                          {appointment.patients.users.first_name}{" "}
                          {appointment.patients.users.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">
                          {appointment.patients.users.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Appointment Information</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Hospital</p>
                        <p className="font-semibold">{appointment.hospitals.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Doctor</p>
                        <p className="font-semibold">
                          Dr. {appointment.doctors.users.first_name}{" "}
                          {appointment.doctors.users.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">
                          {formatDate(appointment.scheduled_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-semibold">
                          {formatTime(appointment.scheduled_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!checkedIn && appointment.status === "confirmed" && (
                    <Button
                      onClick={handleCheckIn}
                      disabled={loading}
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {loading ? "Checking In..." : "Check In Patient"}
                    </Button>
                  )}
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    <XCircle className="h-5 w-5" />
                    New Check-In
                  </Button>
                </div>

                {checkedIn && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">
                          Patient Successfully Checked In
                        </p>
                        <p className="text-sm text-green-700">
                          Please direct the patient to the waiting area
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


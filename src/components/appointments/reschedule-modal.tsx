"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, X, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatDate, formatTime } from "@/lib/utils";

interface RescheduleModalProps {
  appointment: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function RescheduleModal({ appointment, onClose, onSuccess }: RescheduleModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [sameDoctorPreference, setSameDoctorPreference] = useState(true);
  const [alternativeDoctors, setAlternativeDoctors] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, sameDoctorPreference]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      // Get doctor's schedule for selected date
      const doctorId = sameDoctorPreference ? appointment.doctor_id : null;
      
      // In a real app, fetch from doctor_schedules table
      // For now, generate sample slots
      const slots = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          slots.push({
            time: timeSlot,
            available: Math.random() > 0.3, // 70% chance of being available
          });
        }
      }
      
      setAvailableSlots(slots);

      // Fetch alternative doctors if needed
      if (!sameDoctorPreference) {
        const { data: doctors } = await supabase
          .from("doctors")
          .select(`
            *,
            users (first_name, last_name),
            departments (name)
          `)
          .eq("department_id", appointment.department_id)
          .eq("is_active", true)
          .neq("id", appointment.doctor_id)
          .limit(5);

        setAlternativeDoctors(doctors || []);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch available slots");
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }

    setLoading(true);
    try {
      const newDateTime = `${selectedDate}T${selectedSlot}:00`;

      // Update appointment
      const { error } = await supabase
        .from("appointments")
        .update({
          scheduled_time: newDateTime,
          appointment_date: selectedDate,
          appointment_time: selectedSlot,
          status: "confirmed",
        })
        .eq("id", appointment.id);

      if (error) throw error;

      // Create notification/audit log
      await supabase.from("appointment_logs").insert({
        appointment_id: appointment.id,
        action: "rescheduled",
        old_datetime: appointment.scheduled_time,
        new_datetime: newDateTime,
        user_id: appointment.patient_id,
      });

      toast.success("Appointment rescheduled successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error rescheduling:", error);
      toast.error(error.message || "Failed to reschedule appointment");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];
  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Reschedule Appointment</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Current: {formatDate(appointment.scheduled_time)} at{" "}
                {formatTime(appointment.scheduled_time)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Doctor Preference */}
          <div className="space-y-3">
            <Label>Doctor Preference</Label>
            <div className="flex gap-3">
              <Button
                variant={sameDoctorPreference ? "default" : "outline"}
                onClick={() => setSameDoctorPreference(true)}
                className="flex-1"
              >
                <User className="mr-2 h-4 w-4" />
                Same Doctor
              </Button>
              <Button
                variant={!sameDoctorPreference ? "default" : "outline"}
                onClick={() => setSameDoctorPreference(false)}
                className="flex-1"
              >
                Any Available Doctor
              </Button>
            </div>
            
            {sameDoctorPreference && (
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-sm font-medium text-blue-900">
                  Dr. {appointment.doctors?.users?.first_name}{" "}
                  {appointment.doctors?.users?.last_name}
                </p>
                <p className="text-xs text-blue-700">
                  {appointment.doctors?.specialization}
                </p>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="reschedule-date">Select New Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="reschedule-date"
                type="date"
                min={today}
                max={maxDateStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(""); // Reset slot when date changes
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="space-y-3">
              <Label>Select Time Slot</Label>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                        selectedSlot === slot.time
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : slot.available
                          ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400 line-through"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Alternative Doctors */}
          {!sameDoctorPreference && alternativeDoctors.length > 0 && (
            <div className="space-y-3">
              <Label>Available Doctors</Label>
              <div className="space-y-2">
                {alternativeDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        Dr. {doctor.users.first_name} {doctor.users.last_name}
                      </p>
                      <p className="text-xs text-gray-600">{doctor.specialization}</p>
                    </div>
                    <Badge variant="outline">Available</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedSlot && (
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">New Appointment Details</p>
                  <p className="text-sm text-green-700 mt-1">
                    Date: {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-green-700">Time: {selectedSlot}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              className="flex-1"
              disabled={loading || !selectedDate || !selectedSlot}
            >
              {loading ? "Rescheduling..." : "Confirm Reschedule"}
            </Button>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <p>
              • Rescheduling is free up to 24 hours before the appointment
            </p>
            <p>• You will receive a confirmation SMS and email</p>
            <p>• Your original token will be updated</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


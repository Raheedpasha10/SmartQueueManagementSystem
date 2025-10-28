"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { formatTime, getAppointmentStatusColor, getAppointmentStatusLabel } from "@/lib/utils";
import { Clock, User } from "lucide-react";

interface Appointment {
  id: string;
  token_number: string;
  status: string;
  scheduled_time: string;
  patients: {
    users: {
      first_name: string;
      last_name: string;
    };
  };
  doctors: {
    users: {
      first_name: string;
      last_name: string;
    };
  };
}

export function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAppointments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("admin-appointments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          token_number,
          status,
          scheduled_time,
          patients (
            users (first_name, last_name)
          ),
          doctors (
            users (first_name, last_name)
          )
        `)
        .eq("appointment_date", today)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      setAppointments(data as any || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No appointments today
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <p className="font-medium">
                {(appointment.patients as any).users.first_name}{" "}
                {(appointment.patients as any).users.last_name}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Dr. {(appointment.doctors as any).users.first_name}{" "}
              {(appointment.doctors as any).users.last_name}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">#{appointment.token_number}</Badge>
              <Badge className={getAppointmentStatusColor(appointment.status)}>
                {getAppointmentStatusLabel(appointment.status)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {formatTime(appointment.scheduled_time)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


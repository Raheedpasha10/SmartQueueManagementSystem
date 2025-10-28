"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatDate, formatTime, getAppointmentStatusColor, getAppointmentStatusLabel } from "@/lib/utils";

interface DashboardAppointmentsProps {
  dbAppointments: any[];
  patientId: string | null;
}

export function DashboardAppointments({ dbAppointments, patientId }: DashboardAppointmentsProps) {
  const [allAppointments, setAllAppointments] = useState<any[]>(dbAppointments);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    // Load mock appointments from localStorage
    const mockAppointments = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
    const userMockAppointments = mockAppointments
      .filter((apt: any) => apt.patient_id === patientId)
      .filter((apt: any) => new Date(apt.scheduled_time) >= new Date());
    
    // Transform mock appointments to match database format
    const transformedMockAppointments = userMockAppointments.map((apt: any) => ({
      ...apt,
      hospitals: {
        name: apt.hospital?.name || "Demo Hospital"
      },
      doctors: {
        specialization: apt.doctor?.specialization || "General",
        users: apt.doctor?.users || { first_name: "Doctor", last_name: "" }
      }
    }));

    // Combine and sort by date
    const combined = [...dbAppointments, ...transformedMockAppointments]
      .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
      .slice(0, 5);

    setAllAppointments(combined);
    setIsLoading(false);
  }, [dbAppointments, patientId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (allAppointments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No upcoming appointments</p>
        <p className="text-sm mt-2">Book your first appointment to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allAppointments.map((appointment: any) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">
                Dr. {appointment.doctors?.users?.first_name || 'Doctor'}{" "}
                {appointment.doctors?.users?.last_name || ''}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.doctors?.specialization || 'General'}
              </p>
              <p className="text-sm text-gray-500">
                {appointment.hospitals?.name || 'Hospital'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatDate(appointment.scheduled_time)}</p>
            <p className="text-sm text-gray-600">{formatTime(appointment.scheduled_time)}</p>
            <Badge className={`mt-1 ${getAppointmentStatusColor(appointment.status)}`}>
              {getAppointmentStatusLabel(appointment.status)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, MapPin, Calendar, Eye } from "lucide-react";
import { formatDate, formatTime, getAppointmentStatusColor, getAppointmentStatusLabel, formatCurrency } from "@/lib/utils";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";

export function AppointmentsList({ dbAppointments, patientId }: { dbAppointments: any[], patientId: string }) {
  const [allAppointments, setAllAppointments] = useState<any[]>(dbAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    // Load mock appointments from localStorage
    const mockAppointments = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
    const userMockAppointments = mockAppointments.filter((apt: any) => apt.patient_id === patientId);
    
    // Transform mock appointments to match database format
    const transformedMockAppointments = userMockAppointments.map((apt: any) => ({
      ...apt,
      hospitals: {
        name: "Demo Hospital",
        addresses: {
          city: "Demo City",
          state: "Demo State"
        }
      },
      doctors: {
        specialization: apt.doctor.specialization,
        consultation_fee: apt.doctor.consultation_fee,
        users: apt.doctor.users
      }
    }));

    // Combine database and mock appointments
    setAllAppointments([...dbAppointments, ...transformedMockAppointments]);
  }, [dbAppointments, patientId]);

  const now = new Date();
  const upcoming = allAppointments.filter(
    (apt: any) => new Date(apt.scheduled_time) >= now && apt.status !== "cancelled"
  );
  const past = allAppointments.filter(
    (apt: any) =>
      new Date(apt.scheduled_time) < now || apt.status === "cancelled" || apt.status === "completed"
  );

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No appointments found</p>
        <Link href="/hospitals">
          <Button className="mt-4">Browse Hospitals</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((appointment: any) => (
              <Card 
                key={appointment.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewDetails(appointment)}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Date Section */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white sm:w-40">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {new Date(appointment.scheduled_time).getDate()}
                      </p>
                      <p className="text-sm uppercase">
                        {new Date(appointment.scheduled_time).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {formatTime(appointment.scheduled_time)}
                      </p>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Hospital */}
                        <h3 className="text-lg font-semibold">{appointment.hospitals?.name || 'Hospital'}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {appointment.hospitals?.addresses?.city || 'City'},{" "}
                          {appointment.hospitals?.addresses?.state || 'State'}
                        </div>

                        {/* Doctor */}
                        <div className="mt-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            Dr. {appointment.doctors?.users?.first_name || 'Doctor'}{" "}
                            {appointment.doctors?.users?.last_name || ''}
                          </span>
                          <span className="text-sm text-gray-600">
                            ({appointment.doctors?.specialization || 'General'})
                          </span>
                        </div>

                        {/* Token */}
                        <div className="mt-3 flex items-center gap-3">
                          <Badge variant="outline">Token: {appointment.token_number}</Badge>
                          <Badge className={getAppointmentStatusColor(appointment.status)}>
                            {getAppointmentStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Consultation Fee</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(appointment.doctors?.consultation_fee || 0)}
                        </p>
                        <Button 
                          size="sm" 
                          className="mt-3 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(appointment);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming appointments</p>
        )}
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Past Appointments</h2>
        {past.length > 0 ? (
          <div className="space-y-4">
            {past.slice(0, 10).map((appointment: any) => (
              <Card 
                key={appointment.id} 
                className="opacity-75 hover:opacity-100 transition-opacity cursor-pointer hover:shadow-md"
                onClick={() => handleViewDetails(appointment)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">{appointment.hospitals?.name || 'Hospital'}</p>
                          <p className="text-sm text-gray-600">
                            Dr. {appointment.doctors?.users?.first_name || 'Doctor'}{" "}
                            {appointment.doctors?.users?.last_name || ''} -{" "}
                            {appointment.doctors?.specialization || 'General'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-sm text-gray-600">
                        {formatDate(appointment.scheduled_time)}
                      </p>
                      <p className="text-sm text-gray-600">{formatTime(appointment.scheduled_time)}</p>
                      <Badge className={`mt-1 ${getAppointmentStatusColor(appointment.status)}`}>
                        {getAppointmentStatusLabel(appointment.status)}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-2 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(appointment);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No past appointments</p>
        )}
      </div>

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}


"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Hospital,
  MapPin,
  Phone,
  FileText,
  IndianRupee,
  Ticket,
} from "lucide-react";
import { formatDate, formatTime, getAppointmentStatusColor, getAppointmentStatusLabel, formatCurrency } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  appointment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Token */}
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center gap-3">
              <Ticket className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Token Number</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointment.token_number}
                </p>
              </div>
            </div>
            <Badge className={getAppointmentStatusColor(appointment.status)}>
              {getAppointmentStatusLabel(appointment.status)}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Calendar className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">
                  {formatDate(appointment.scheduled_time)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Clock className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">
                  {formatTime(appointment.scheduled_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Hospital className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Hospital Details</h3>
            </div>
            <div className="space-y-2 pl-7">
              <p className="text-lg font-medium">
                {appointment.hospitals?.name || 'Hospital Name'}
              </p>
              {appointment.hospitals?.addresses && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">
                    {appointment.hospitals.addresses.city},{" "}
                    {appointment.hospitals.addresses.state}
                  </span>
                </div>
              )}
              {appointment.hospitals?.phone_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">
                    {appointment.hospitals.phone_number}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Information */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Doctor Details</h3>
            </div>
            <div className="space-y-2 pl-7">
              <p className="text-lg font-medium">
                Dr. {appointment.doctors?.users?.first_name || ''}{" "}
                {appointment.doctors?.users?.last_name || 'Doctor Name'}
              </p>
              <p className="text-sm text-gray-600">
                {appointment.doctors?.specialization || 'Specialization'}
              </p>
              <div className="flex items-center gap-2 text-gray-900 mt-2">
                <IndianRupee className="h-4 w-4" />
                <span className="font-semibold">
                  Consultation Fee: {formatCurrency(appointment.doctors?.consultation_fee || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes/Reason */}
          {appointment.notes && (
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Reason for Visit</h3>
              </div>
              <p className="pl-7 text-gray-700">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {appointment.status === 'scheduled' && (
              <Button>Reschedule</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


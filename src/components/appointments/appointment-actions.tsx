"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RescheduleModal } from "./reschedule-modal";
import { Calendar, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AppointmentActionsProps {
  appointment: any;
}

export function AppointmentActions({ appointment }: AppointmentActionsProps) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCancel = async () => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this appointment? This action cannot be undone."
    );

    if (!confirm) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", appointment.id);

      if (error) throw error;

      // Send cancellation email (don't wait for it)
      fetch("/api/send-email/cancellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          appointmentId: appointment.id,
          cancellationReason: "Patient requested cancellation"
        }),
      }).catch((error) => console.error("Error sending cancellation email:", error));

      toast.success("Appointment cancelled successfully. Check your email for confirmation.");
      router.refresh();
    } catch (error: any) {
      console.error("Error cancelling appointment:", error);
      toast.error(error.message || "Failed to cancel appointment");
    } finally {
      setLoading(false);
    }
  };

  // Only show actions for confirmed and scheduled appointments
  if (!["confirmed", "scheduled"].includes(appointment.status)) {
    return null;
  }

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => setShowReschedule(true)}
          disabled={loading}
        >
          <Calendar className="h-4 w-4" />
          Reschedule
        </Button>
        <Button
          variant="destructive"
          className="flex-1 gap-2"
          onClick={handleCancel}
          disabled={loading}
        >
          <XCircle className="h-4 w-4" />
          Cancel Appointment
        </Button>
      </div>

      {showReschedule && (
        <RescheduleModal
          appointment={appointment}
          onClose={() => setShowReschedule(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}


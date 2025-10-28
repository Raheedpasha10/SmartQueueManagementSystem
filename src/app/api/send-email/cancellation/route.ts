import { NextRequest, NextResponse } from "next/server";
import EmailService from "@/lib/email/email-service-simple";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, cancellationReason } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Fetch appointment details
    const supabase = await createClient();
    const { data: appointment, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patients (
          id,
          users (email, first_name, last_name)
        ),
        hospitals (name),
        doctors (
          users (first_name, last_name)
        )
      `
      )
      .eq("id", appointmentId)
      .single();

    if (error || !appointment) {
      console.error("Error fetching appointment:", error);
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const patient = appointment.patients;
    const email = patient?.users?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Patient email not found" },
        { status: 400 }
      );
    }

    // Check notification preferences
    const { data: patientData } = await supabase
      .from("patients")
      .select("notification_preferences")
      .eq("id", patient.id)
      .single();

    const preferences = patientData?.notification_preferences || {};
    const emailEnabled = preferences?.email?.enabled !== false;
    const cancellationsEnabled = preferences?.email?.cancellations !== false;

    if (!emailEnabled || !cancellationsEnabled) {
      console.log("Cancellation email notifications disabled for patient:", patient.id);
      return NextResponse.json(
        { success: true, message: "Email notifications disabled for patient" },
        { status: 200 }
      );
    }

    // Send cancellation email
    const appointmentDate = new Date(appointment.scheduled_time);
    const result = await EmailService.sendAppointmentCancellation({
      to: email,
      patientName: `${patient.users.first_name} ${patient.users.last_name}`,
      hospitalName: appointment.hospitals.name,
      doctorName: `${appointment.doctors.users.first_name} ${appointment.doctors.users.last_name}`,
      appointmentDate: appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      appointmentTime: appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cancellationReason: cancellationReason || undefined,
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: "Cancellation email sent successfully",
        },
        { status: 200 }
      );
    } else {
      console.error("Error sending email:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send cancellation email",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in cancellation email API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}


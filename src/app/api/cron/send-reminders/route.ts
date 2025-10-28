import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import EmailService from "@/lib/email/email-service-simple";
import { formatDate, formatTime } from "@/lib/utils";

// This route must be dynamic for cron jobs
export const dynamic = 'force-dynamic';

/**
 * Automated Appointment Reminder Cron Job
 * 
 * This endpoint should be called by a cron service (Vercel Cron, GitHub Actions, etc.)
 * to send automated reminders at specific intervals before appointments.
 * 
 * Intervals: 24 hours, 2 hours, 15 minutes
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const now = new Date();

    // Calculate reminder time windows
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

    // Reminder windows (with 5-minute tolerance)
    const reminderWindows = [
      {
        name: "24-hour",
        start: new Date(twentyFourHoursFromNow.getTime() - 5 * 60 * 1000),
        end: new Date(twentyFourHoursFromNow.getTime() + 5 * 60 * 1000),
        hours: 24,
      },
      {
        name: "2-hour",
        start: new Date(twoHoursFromNow.getTime() - 5 * 60 * 1000),
        end: new Date(twoHoursFromNow.getTime() + 5 * 60 * 1000),
        hours: 2,
      },
      {
        name: "15-minute",
        start: new Date(fifteenMinutesFromNow.getTime() - 2 * 60 * 1000),
        end: new Date(fifteenMinutesFromNow.getTime() + 2 * 60 * 1000),
        hours: 0.25,
      },
    ];

    const results = {
      sent: 0,
      failed: 0,
      details: [] as any[],
    };

    // Process each reminder window
    for (const window of reminderWindows) {
      // Fetch appointments that need reminders
      const { data: appointments, error } = await supabase
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
        .eq("status", "confirmed")
        .gte("scheduled_time", window.start.toISOString())
        .lte("scheduled_time", window.end.toISOString());

      if (error) {
        console.error(`Error fetching appointments for ${window.name} window:`, error);
        continue;
      }

      if (!appointments || appointments.length === 0) {
        console.log(`No appointments found for ${window.name} reminder window`);
        continue;
      }

      console.log(`Found ${appointments.length} appointments for ${window.name} reminder`);

      // Check if reminder was already sent (prevent duplicates)
      const appointmentIds = appointments.map((a) => a.id);
      const { data: existingReminders } = await supabase
        .from("appointment_reminders")
        .select("appointment_id")
        .in("appointment_id", appointmentIds)
        .eq("reminder_type", window.name);

      const sentReminderIds = new Set(
        existingReminders?.map((r: any) => r.appointment_id) || []
      );

      // Send emails for appointments that haven't received this reminder
      for (const appointment of appointments) {
        // Skip if reminder already sent
        if (sentReminderIds.has(appointment.id)) {
          console.log(
            `Skipping ${window.name} reminder for appointment ${appointment.id} (already sent)`
          );
          continue;
        }

        const patient = appointment.patients;
        const email = patient?.users?.email;

        if (!email) {
          console.warn(`No email found for appointment ${appointment.id}`);
          results.failed++;
          continue;
        }

        try {
          // Send reminder email
          const result = await EmailService.sendAppointmentReminder({
            to: email,
            patientName: `${patient.users.first_name} ${patient.users.last_name}`,
            hospitalName: appointment.hospitals.name,
            doctorName: `${appointment.doctors.users.first_name} ${appointment.doctors.users.last_name}`,
            appointmentDate: formatDate(appointment.scheduled_time),
            appointmentTime: formatTime(appointment.scheduled_time),
            tokenNumber: appointment.token_number,
            hoursUntilAppointment: window.hours,
          });

          if (result.success) {
            // Record that reminder was sent
            await supabase.from("appointment_reminders").insert({
              appointment_id: appointment.id,
              reminder_type: window.name,
              sent_at: new Date().toISOString(),
              sent_via: "email",
            });

            results.sent++;
            results.details.push({
              appointmentId: appointment.id,
              patientEmail: email,
              reminderType: window.name,
              status: "sent",
            });
          } else {
            results.failed++;
            results.details.push({
              appointmentId: appointment.id,
              patientEmail: email,
              reminderType: window.name,
              status: "failed",
              error: result.error,
            });
          }
        } catch (error) {
          console.error(
            `Error sending ${window.name} reminder for appointment ${appointment.id}:`,
            error
          );
          results.failed++;
          results.details.push({
            appointmentId: appointment.id,
            patientEmail: email,
            reminderType: window.name,
            status: "error",
            error: String(error),
          });
        }
      }
    }

    console.log(`Reminder job complete: ${results.sent} sent, ${results.failed} failed`);

    return NextResponse.json({
      success: true,
      message: `Reminders processed: ${results.sent} sent, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Error in reminder cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}


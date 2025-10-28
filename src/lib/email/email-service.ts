import "server-only";
import { renderToString } from "react-dom/server";
import resend, { EMAIL_CONFIG } from "./resend";
import {
  AppointmentConfirmationEmail,
  AppointmentReminderEmail,
  QueueUpdateEmail,
  AppointmentCancellationEmail,
  WelcomeEmail,
} from "./templates";

// Type definitions for email data
interface SendAppointmentConfirmationData {
  to: string;
  patientName: string;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: string;
  queuePosition: number;
}

interface SendAppointmentReminderData {
  to: string;
  patientName: string;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: string;
  hoursUntilAppointment: number;
}

interface SendQueueUpdateData {
  to: string;
  patientName: string;
  tokenNumber: string;
  currentPosition: number;
  estimatedWaitTime: number;
}

interface SendAppointmentCancellationData {
  to: string;
  patientName: string;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  cancellationReason?: string;
}

interface SendWelcomeEmailData {
  to: string;
  name: string;
}

// Email service class
export class EmailService {
  /**
   * Send appointment confirmation email
   */
  static async sendAppointmentConfirmation(data: SendAppointmentConfirmationData) {
    try {
      const html = renderToString(
        AppointmentConfirmationEmail({
          patientName: data.patientName,
          hospitalName: data.hospitalName,
          doctorName: data.doctorName,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          tokenNumber: data.tokenNumber,
          queuePosition: data.queuePosition,
        })
      );

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: data.to,
        subject: `Appointment Confirmed at ${data.hospitalName}`,
        html,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log("✅ Appointment confirmation email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Error sending appointment confirmation email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send appointment reminder email
   */
  static async sendAppointmentReminder(data: SendAppointmentReminderData) {
    try {
      const html = renderToString(
        AppointmentReminderEmail({
          patientName: data.patientName,
          hospitalName: data.hospitalName,
          doctorName: data.doctorName,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          tokenNumber: data.tokenNumber,
          hoursUntilAppointment: data.hoursUntilAppointment,
        })
      );

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: data.to,
        subject: `Reminder: Appointment in ${data.hoursUntilAppointment} hours`,
        html,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log("✅ Appointment reminder email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Error sending appointment reminder email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send queue update email
   */
  static async sendQueueUpdate(data: SendQueueUpdateData) {
    try {
      const html = renderToString(
        QueueUpdateEmail({
          patientName: data.patientName,
          tokenNumber: data.tokenNumber,
          currentPosition: data.currentPosition,
          estimatedWaitTime: data.estimatedWaitTime,
        })
      );

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: data.to,
        subject: `Your Turn is Coming! Queue Position: #${data.currentPosition}`,
        html,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log("✅ Queue update email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Error sending queue update email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send appointment cancellation email
   */
  static async sendAppointmentCancellation(data: SendAppointmentCancellationData) {
    try {
      const html = renderToString(
        AppointmentCancellationEmail({
          patientName: data.patientName,
          hospitalName: data.hospitalName,
          doctorName: data.doctorName,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          cancellationReason: data.cancellationReason,
        })
      );

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: data.to,
        subject: `Appointment Cancelled at ${data.hospitalName}`,
        html,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log("✅ Appointment cancellation email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Error sending appointment cancellation email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(data: SendWelcomeEmailData) {
    try {
      const html = renderToString(
        WelcomeEmail({
          name: data.name,
        })
      );

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: data.to,
        subject: "Welcome to MediQueue!",
        html,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log("✅ Welcome email sent:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
      return { success: false, error };
    }
  }

  /**
   * Send batch emails (for reminders, etc.)
   */
  static async sendBatchEmails(emails: Array<{ to: string; subject: string; html: string }>) {
    try {
      const results = await Promise.allSettled(
        emails.map((email) =>
          resend.emails.send({
            from: EMAIL_CONFIG.from,
            ...email,
            replyTo: EMAIL_CONFIG.replyTo,
          })
        )
      );

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      console.log(`✅ Batch email send complete: ${successful} succeeded, ${failed} failed`);
      return { success: true, successful, failed, results };
    } catch (error) {
      console.error("❌ Error sending batch emails:", error);
      return { success: false, error };
    }
  }
}

export default EmailService;


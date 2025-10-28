import resend, { EMAIL_CONFIG } from "./resend";

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

// HTML Email Templates
function getEmailLayout(content: string, previewText?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${previewText ? `<div style="display:none;max-height:0px;overflow:hidden;">${previewText}</div>` : ''}
</head>
<body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;margin:0;padding:0;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" style="background-color:#ffffff;border-radius:8px;max-width:600px;width:100%;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);padding:30px;text-align:center;border-top-left-radius:8px;border-top-right-radius:8px;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:bold;margin:0;">MediQueue</h1>
              <p style="color:#e0e7ff;font-size:14px;margin:5px 0 0 0;">Smart Queue Management for Healthcare</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">${content}</td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:30px;text-align:center;border-bottom-left-radius:8px;border-bottom-right-radius:8px;border-top:1px solid #e2e8f0;">
              <p style="color:#64748b;font-size:12px;margin:0 0 10px 0;">&copy; ${new Date().getFullYear()} MediQueue. All rights reserved.</p>
              <p style="color:#94a3b8;font-size:11px;margin:0;">This is an automated message. Please do not reply to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getConfirmationEmailHTML(data: SendAppointmentConfirmationData) {
  return getEmailLayout(
    `
    <h2 style="color:#1e293b;font-size:24px;margin:0 0 20px 0;">Appointment Confirmed! 🎉</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Dear ${data.patientName},</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 30px 0;">Your appointment has been successfully confirmed. Here are the details:</p>
    
    <table style="background-color:#f8fafc;border-radius:8px;padding:20px;width:100%;margin-bottom:30px;">
      <tr><td style="padding:10px 0;"><strong style="color:#334155;">Hospital:</strong><br><span style="color:#64748b;">${data.hospitalName}</span></td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#334155;">Doctor:</strong><br><span style="color:#64748b;">Dr. ${data.doctorName}</span></td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#334155;">Date & Time:</strong><br><span style="color:#64748b;">${data.appointmentDate} at ${data.appointmentTime}</span></td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#334155;">Token Number:</strong><br><span style="color:#3b82f6;font-size:20px;font-weight:bold;">${data.tokenNumber}</span></td></tr>
      <tr><td style="padding:10px 0;"><strong style="color:#334155;">Current Queue Position:</strong><br><span style="color:#64748b;">#${data.queuePosition}</span></td></tr>
    </table>
    
    <div style="background-color:#dbeafe;border-left:4px solid #3b82f6;padding:15px;border-radius:4px;margin-bottom:30px;">
      <p style="color:#1e40af;font-size:14px;margin:0;"><strong>💡 Pro Tip:</strong> Check in using your QR code when you arrive at the hospital to avoid delays.</p>
    </div>
    
    <div style="text-align:center;margin-top:30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments" style="background-color:#3b82f6;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">View My Appointments</a>
    </div>
    
    <p style="color:#64748b;font-size:14px;margin-top:30px;text-align:center;">Need to reschedule or cancel? You can do so from your appointments page.</p>
  `,
    `Your appointment at ${data.hospitalName} is confirmed`
  );
}

function getReminderEmailHTML(data: SendAppointmentReminderData) {
  return getEmailLayout(
    `
    <h2 style="color:#1e293b;font-size:24px;margin:0 0 20px 0;">Upcoming Appointment Reminder ⏰</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Dear ${data.patientName},</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 30px 0;">This is a reminder that your appointment is scheduled in <strong>${data.hoursUntilAppointment} hours</strong>.</p>
    
    <table style="background-color:#fef3c7;border-radius:8px;padding:20px;width:100%;margin-bottom:30px;border:2px solid #fbbf24;">
      <tr><td><strong style="color:#92400e;">Hospital:</strong> ${data.hospitalName}<br>
      <strong style="color:#92400e;">Doctor:</strong> Dr. ${data.doctorName}<br>
      <strong style="color:#92400e;">Date & Time:</strong> ${data.appointmentDate} at ${data.appointmentTime}<br>
      <strong style="color:#92400e;">Token:</strong> ${data.tokenNumber}</td></tr>
    </table>
    
    <div style="background-color:#dbeafe;border-left:4px solid #3b82f6;padding:15px;border-radius:4px;margin-bottom:30px;">
      <p style="color:#1e40af;font-size:14px;margin:0;"><strong>📱 Check-in Tips:</strong></p>
      <ul style="color:#1e40af;font-size:14px;margin-top:10px;">
        <li>Arrive 15 minutes early</li>
        <li>Have your QR code ready</li>
        <li>Track your queue position in real-time</li>
      </ul>
    </div>
    
    <div style="text-align:center;margin-top:30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments" style="background-color:#3b82f6;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;margin-right:10px;">View Details</a>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/appointments" style="background-color:#64748b;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Reschedule</a>
    </div>
  `,
    `Reminder: Your appointment at ${data.hospitalName} is in ${data.hoursUntilAppointment} hours`
  );
}

function getCancellationEmailHTML(data: SendAppointmentCancellationData) {
  return getEmailLayout(
    `
    <h2 style="color:#1e293b;font-size:24px;margin:0 0 20px 0;">Appointment Cancelled</h2>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Dear ${data.patientName},</p>
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 30px 0;">Your appointment has been cancelled. Here are the details:</p>
    
    <table style="background-color:#fee2e2;border-radius:8px;padding:20px;width:100%;margin-bottom:30px;">
      <tr><td><strong style="color:#7f1d1d;">Hospital:</strong> ${data.hospitalName}<br>
      <strong style="color:#7f1d1d;">Doctor:</strong> Dr. ${data.doctorName}<br>
      <strong style="color:#7f1d1d;">Date & Time:</strong> ${data.appointmentDate} at ${data.appointmentTime}
      ${data.cancellationReason ? `<br><strong style="color:#7f1d1d;">Reason:</strong> ${data.cancellationReason}` : ''}
      </td></tr>
    </table>
    
    <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 30px 0;">If you still need medical attention, please book a new appointment at your convenience.</p>
    
    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/hospitals" style="background-color:#3b82f6;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Book New Appointment</a>
    </div>
  `,
    `Your appointment at ${data.hospitalName} has been cancelled`
  );
}

// Email service class
export class EmailService {
  static async sendAppointmentConfirmation(data: SendAppointmentConfirmationData) {
    try {
      const html = getConfirmationEmailHTML(data);

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

  static async sendAppointmentReminder(data: SendAppointmentReminderData) {
    try {
      const html = getReminderEmailHTML(data);

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

  static async sendAppointmentCancellation(data: SendAppointmentCancellationData) {
    try {
      const html = getCancellationEmailHTML(data);

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

  static async sendWelcomeEmail(data: SendWelcomeEmailData) {
    try {
      const html = getEmailLayout(
        `
        <h2 style="color:#1e293b;font-size:24px;margin:0 0 20px 0;">Welcome to MediQueue! 🎉</h2>
        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 20px 0;">Dear ${data.name},</p>
        <p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 30px 0;">Thank you for joining MediQueue! We're excited to help you manage your healthcare appointments with ease.</p>
        
        <div style="background-color:#dbeafe;border-radius:8px;padding:20px;margin-bottom:30px;">
          <h3 style="color:#1e40af;font-size:18px;margin:0 0 15px 0;">What You Can Do:</h3>
          <ul style="color:#1e40af;font-size:14px;margin-left:20px;">
            <li style="margin-bottom:10px;">Book same-day appointments across 100+ hospitals</li>
            <li style="margin-bottom:10px;">Get emergency priority with our AI-powered triage system</li>
            <li style="margin-bottom:10px;">Track your queue position in real-time</li>
            <li style="margin-bottom:10px;">Receive reminders via email, SMS, and WhatsApp</li>
            <li style="margin-bottom:10px;">Manage your medical history in one place</li>
          </ul>
        </div>
        
        <div style="text-align:center;margin-top:30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/hospitals" style="background-color:#3b82f6;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:600;">Book Your First Appointment</a>
        </div>
        
        <p style="color:#64748b;font-size:14px;margin-top:30px;text-align:center;">Need help? Contact our support team at support@mediqueue.com</p>
      `,
        'Welcome to MediQueue - Your healthcare journey starts here'
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
}

export default EmailService;


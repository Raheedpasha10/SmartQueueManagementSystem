import React from "react";

// Base email layout component
interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const EmailLayout = ({ children, previewText }: EmailLayoutProps) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {previewText && (
        <div
          style={{
            display: "none",
            maxHeight: "0px",
            overflow: "hidden",
          }}
        >
          {previewText}
        </div>
      )}
    </head>
    <body
      style={{
        backgroundColor: "#f6f9fc",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      <table
        role="presentation"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tr>
          <td align="center" style={{ padding: "40px 0" }}>
            <table
              role="presentation"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "100%",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Header */}
              <tr>
                <td
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    padding: "30px",
                    textAlign: "center",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <h1
                    style={{
                      color: "#ffffff",
                      fontSize: "28px",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    MediQueue
                  </h1>
                  <p
                    style={{
                      color: "#e0e7ff",
                      fontSize: "14px",
                      margin: "5px 0 0 0",
                    }}
                  >
                    Smart Queue Management for Healthcare
                  </p>
                </td>
              </tr>
              {/* Content */}
              <tr>
                <td style={{ padding: "40px 30px" }}>{children}</td>
              </tr>
              {/* Footer */}
              <tr>
                <td
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "30px",
                    textAlign: "center",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      margin: "0 0 10px 0",
                    }}
                  >
                    © {new Date().getFullYear()} MediQueue. All rights reserved.
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "11px",
                      margin: "0",
                    }}
                  >
                    This is an automated message. Please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
);

// Appointment Confirmation Email
interface AppointmentConfirmationProps {
  patientName: string;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: string;
  queuePosition: number;
}

export const AppointmentConfirmationEmail = ({
  patientName,
  hospitalName,
  doctorName,
  appointmentDate,
  appointmentTime,
  tokenNumber,
  queuePosition,
}: AppointmentConfirmationProps) => (
  <EmailLayout previewText={`Your appointment at ${hospitalName} is confirmed`}>
    <h2 style={{ color: "#1e293b", fontSize: "24px", margin: "0 0 20px 0" }}>
      Appointment Confirmed! 🎉
    </h2>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
      Dear {patientName},
    </p>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
      Your appointment has been successfully confirmed. Here are the details:
    </p>

    <table
      style={{
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        padding: "20px",
        width: "100%",
        marginBottom: "30px",
      }}
    >
      <tr>
        <td style={{ padding: "10px 0" }}>
          <strong style={{ color: "#334155" }}>Hospital:</strong>
          <br />
          <span style={{ color: "#64748b" }}>{hospitalName}</span>
        </td>
      </tr>
      <tr>
        <td style={{ padding: "10px 0" }}>
          <strong style={{ color: "#334155" }}>Doctor:</strong>
          <br />
          <span style={{ color: "#64748b" }}>Dr. {doctorName}</span>
        </td>
      </tr>
      <tr>
        <td style={{ padding: "10px 0" }}>
          <strong style={{ color: "#334155" }}>Date & Time:</strong>
          <br />
          <span style={{ color: "#64748b" }}>
            {appointmentDate} at {appointmentTime}
          </span>
        </td>
      </tr>
      <tr>
        <td style={{ padding: "10px 0" }}>
          <strong style={{ color: "#334155" }}>Token Number:</strong>
          <br />
          <span
            style={{
              color: "#3b82f6",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {tokenNumber}
          </span>
        </td>
      </tr>
      <tr>
        <td style={{ padding: "10px 0" }}>
          <strong style={{ color: "#334155" }}>Current Queue Position:</strong>
          <br />
          <span style={{ color: "#64748b" }}>#{queuePosition}</span>
        </td>
      </tr>
    </table>

    <div
      style={{
        backgroundColor: "#dbeafe",
        borderLeft: "4px solid #3b82f6",
        padding: "15px",
        borderRadius: "4px",
        marginBottom: "30px",
      }}
    >
      <p style={{ color: "#1e40af", fontSize: "14px", margin: 0 }}>
        <strong>💡 Pro Tip:</strong> Check in using your QR code when you arrive at the hospital
        to avoid delays.
      </p>
    </div>

    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/appointments`}
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "14px 28px",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
        }}
      >
        View My Appointments
      </a>
    </div>

    <p
      style={{
        color: "#64748b",
        fontSize: "14px",
        marginTop: "30px",
        textAlign: "center",
      }}
    >
      Need to reschedule or cancel? You can do so from your appointments page.
    </p>
  </EmailLayout>
);

// Appointment Reminder Email
interface AppointmentReminderProps {
  patientName: string;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  tokenNumber: string;
  hoursUntilAppointment: number;
}

export const AppointmentReminderEmail = ({
  patientName,
  hospitalName,
  doctorName,
  appointmentDate,
  appointmentTime,
  tokenNumber,
  hoursUntilAppointment,
}: AppointmentReminderProps) => (
  <EmailLayout
    previewText={`Reminder: Your appointment at ${hospitalName} is in ${hoursUntilAppointment} hours`}
  >
    <h2 style={{ color: "#1e293b", fontSize: "24px", margin: "0 0 20px 0" }}>
      Upcoming Appointment Reminder ⏰
    </h2>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
      Dear {patientName},
    </p>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
      This is a reminder that your appointment is scheduled in{" "}
      <strong>{hoursUntilAppointment} hours</strong>.
    </p>

    <table
      style={{
        backgroundColor: "#fef3c7",
        borderRadius: "8px",
        padding: "20px",
        width: "100%",
        marginBottom: "30px",
        border: "2px solid #fbbf24",
      }}
    >
      <tr>
        <td>
          <strong style={{ color: "#92400e" }}>Hospital:</strong> {hospitalName}
          <br />
          <strong style={{ color: "#92400e" }}>Doctor:</strong> Dr. {doctorName}
          <br />
          <strong style={{ color: "#92400e" }}>Date & Time:</strong> {appointmentDate} at{" "}
          {appointmentTime}
          <br />
          <strong style={{ color: "#92400e" }}>Token:</strong> {tokenNumber}
        </td>
      </tr>
    </table>

    <div
      style={{
        backgroundColor: "#dbeafe",
        borderLeft: "4px solid #3b82f6",
        padding: "15px",
        borderRadius: "4px",
        marginBottom: "30px",
      }}
    >
      <p style={{ color: "#1e40af", fontSize: "14px", margin: 0 }}>
        <strong>📱 Check-in Tips:</strong>
      </p>
      <ul style={{ color: "#1e40af", fontSize: "14px", marginTop: "10px" }}>
        <li>Arrive 15 minutes early</li>
        <li>Have your QR code ready</li>
        <li>Track your queue position in real-time</li>
      </ul>
    </div>

    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/appointments`}
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "14px 28px",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
          marginRight: "10px",
        }}
      >
        View Details
      </a>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/appointments`}
        style={{
          backgroundColor: "#64748b",
          color: "#ffffff",
          padding: "14px 28px",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
        }}
      >
        Reschedule
      </a>
    </div>
  </EmailLayout>
);

// Queue Position Update Email
interface QueueUpdateProps {
  patientName: string;
  tokenNumber: string;
  currentPosition: number;
  estimatedWaitTime: number;
}

export const QueueUpdateEmail = ({
  patientName,
  tokenNumber,
  currentPosition,
  estimatedWaitTime,
}: QueueUpdateProps) => (
  <EmailLayout previewText={`Your turn is coming up! You're #${currentPosition} in queue`}>
    <h2 style={{ color: "#1e293b", fontSize: "24px", margin: "0 0 20px 0" }}>
      Queue Update 🔔
    </h2>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
      Dear {patientName},
    </p>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
      Your turn is approaching! Here's your current queue status:
    </p>

    <div
      style={{
        backgroundColor: "#dcfce7",
        borderRadius: "8px",
        padding: "30px",
        textAlign: "center",
        marginBottom: "30px",
      }}
    >
      <p style={{ color: "#166534", fontSize: "14px", margin: "0 0 10px 0" }}>
        <strong>Token Number</strong>
      </p>
      <p
        style={{
          color: "#15803d",
          fontSize: "32px",
          fontWeight: "bold",
          margin: "0 0 20px 0",
        }}
      >
        {tokenNumber}
      </p>
      <p style={{ color: "#166534", fontSize: "14px", margin: "0 0 10px 0" }}>
        <strong>Current Position</strong>
      </p>
      <p
        style={{
          color: "#15803d",
          fontSize: "48px",
          fontWeight: "bold",
          margin: "0 0 20px 0",
        }}
      >
        #{currentPosition}
      </p>
      <p style={{ color: "#166534", fontSize: "14px", margin: "0" }}>
        Estimated Wait: <strong>{estimatedWaitTime} minutes</strong>
      </p>
    </div>

    <div
      style={{
        backgroundColor: "#fef3c7",
        borderLeft: "4px solid #fbbf24",
        padding: "15px",
        borderRadius: "4px",
        marginBottom: "30px",
      }}
    >
      <p style={{ color: "#92400e", fontSize: "14px", margin: 0 }}>
        <strong>⚠️ Please be ready:</strong> Make sure you're at the hospital or nearby. Your
        turn could be called soon!
      </p>
    </div>

    <div style={{ textAlign: "center" }}>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/appointments`}
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "14px 28px",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
        }}
      >
        Track Live Queue
      </a>
    </div>
  </EmailLayout>
);

// Appointment Cancellation Email
interface AppointmentCancellationProps {
  patientName: string;
  hospitalName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  cancellationReason?: string;
}

export const AppointmentCancellationEmail = ({
  patientName,
  hospitalName,
  doctorName,
  appointmentDate,
  appointmentTime,
  cancellationReason,
}: AppointmentCancellationProps) => (
  <EmailLayout previewText={`Your appointment at ${hospitalName} has been cancelled`}>
    <h2 style={{ color: "#1e293b", fontSize: "24px", margin: "0 0 20px 0" }}>
      Appointment Cancelled
    </h2>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
      Dear {patientName},
    </p>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
      Your appointment has been cancelled. Here are the details:
    </p>

    <table
      style={{
        backgroundColor: "#fee2e2",
        borderRadius: "8px",
        padding: "20px",
        width: "100%",
        marginBottom: "30px",
      }}
    >
      <tr>
        <td>
          <strong style={{ color: "#7f1d1d" }}>Hospital:</strong> {hospitalName}
          <br />
          <strong style={{ color: "#7f1d1d" }}>Doctor:</strong> Dr. {doctorName}
          <br />
          <strong style={{ color: "#7f1d1d" }}>Date & Time:</strong> {appointmentDate} at{" "}
          {appointmentTime}
          {cancellationReason && (
            <>
              <br />
              <strong style={{ color: "#7f1d1d" }}>Reason:</strong> {cancellationReason}
            </>
          )}
        </td>
      </tr>
    </table>

    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
      If you still need medical attention, please book a new appointment at your convenience.
    </p>

    <div style={{ textAlign: "center" }}>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`}
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "14px 28px",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
        }}
      >
        Book New Appointment
      </a>
    </div>
  </EmailLayout>
);

// Welcome Email
interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <EmailLayout previewText="Welcome to MediQueue - Your healthcare journey starts here">
    <h2 style={{ color: "#1e293b", fontSize: "24px", margin: "0 0 20px 0" }}>
      Welcome to MediQueue! 🎉
    </h2>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px 0" }}>
      Dear {name},
    </p>
    <p style={{ color: "#475569", fontSize: "16px", lineHeight: "1.6", margin: "0 0 30px 0" }}>
      Thank you for joining MediQueue! We're excited to help you manage your healthcare
      appointments with ease.
    </p>

    <div
      style={{
        backgroundColor: "#dbeafe",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "30px",
      }}
    >
      <h3 style={{ color: "#1e40af", fontSize: "18px", margin: "0 0 15px 0" }}>
        What You Can Do:
      </h3>
      <ul style={{ color: "#1e40af", fontSize: "14px", marginLeft: "20px" }}>
        <li style={{ marginBottom: "10px" }}>Book same-day appointments across 100+ hospitals</li>
        <li style={{ marginBottom: "10px" }}>
          Get emergency priority with our AI-powered triage system
        </li>
        <li style={{ marginBottom: "10px" }}>Track your queue position in real-time</li>
        <li style={{ marginBottom: "10px" }}>
          Receive reminders via email, SMS, and WhatsApp
        </li>
        <li style={{ marginBottom: "10px" }}>Manage your medical history in one place</li>
      </ul>
    </div>

    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <a
        href={`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`}
        style={{
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          padding: "14px 28px",
          borderRadius: "6px",
          textDecoration: "none",
          display: "inline-block",
          fontWeight: "600",
        }}
      >
        Book Your First Appointment
      </a>
    </div>

    <p
      style={{
        color: "#64748b",
        fontSize: "14px",
        marginTop: "30px",
        textAlign: "center",
      }}
    >
      Need help? Contact our support team at support@mediqueue.com
    </p>
  </EmailLayout>
);


import { Resend } from "resend";

// Initialize Resend client (use placeholder during build if no key provided)
const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export default resend;

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "MediQueue <onboarding@resend.dev>",
  replyTo: process.env.EMAIL_REPLY_TO || "support@mediqueue.com",
};


# Email Notification System - Setup Guide

## Overview
The MediQueue app now has a comprehensive email notification system using **Resend** with automated appointment reminders, confirmations, and cancellation notifications.

## Features Implemented ✅

### 1. **Email Templates**
Professional HTML email templates for:
- ✉️ **Appointment Confirmation** - Sent immediately after booking
- ⏰ **Appointment Reminders** - Automated reminders (24hr, 2hr, 15min before)
- 🔔 **Queue Position Updates** - Real-time queue status notifications
- ❌ **Appointment Cancellations** - Sent when appointments are cancelled
- 👋 **Welcome Email** - Sent to new users upon registration

### 2. **Automated Reminder System**
- **Cron Job**: Runs every 5 minutes via Vercel Cron
- **Reminder Intervals**: 24 hours, 2 hours, 15 minutes before appointment
- **Duplicate Prevention**: Tracks sent reminders in database
- **Batch Processing**: Efficiently handles multiple appointments

### 3. **Notification Preferences**
- **User Control**: Patients can enable/disable different notification types
- **Channel-Specific**: Separate preferences for email, SMS, WhatsApp, push
- **Granular Control**: Control for confirmations, reminders, queue updates, cancellations

## Setup Instructions

### Step 1: Get Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Create a free account
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your API key

### Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=MediQueue <noreply@yourdomain.com>
EMAIL_REPLY_TO=support@mediqueue.com

# Cron Secret (generate a random string)
CRON_SECRET=your_random_secret_string_here
```

### Step 3: Update Database Schema

Run the SQL commands in `DATABASE_UPDATES.sql` in your Supabase SQL Editor:

```bash
# The file contains:
# 1. appointment_reminders table
# 2. Indexes for performance
# 3. RLS policies
# 4. notification_preferences column for patients
```

**Important Tables:**
- `appointment_reminders` - Tracks all sent reminders to prevent duplicates
- `patients.notification_preferences` - Stores user notification settings (JSONB)

### Step 4: Configure Domain (Production)

For production emails with your custom domain:

1. In Resend Dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `mediqueue.com`)
4. Add the provided DNS records to your domain provider
5. Wait for verification (usually 15 minutes)
6. Update `EMAIL_FROM` in `.env.local`:
   ```env
   EMAIL_FROM=MediQueue <noreply@mediqueue.com>
   ```

### Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Deploy to Vercel
3. Vercel will automatically configure the cron job from `vercel.json`
4. Add environment variables in Vercel project settings

### Step 6: Test the System

#### Test Confirmation Email
1. Book an appointment through the app
2. Check the email inbox for confirmation
3. Verify all details are correct

#### Test Reminder System
1. Create a test appointment 30 minutes in the future
2. Wait for the cron job to run (every 5 minutes)
3. Check for 15-minute reminder email

#### Test Cancellation Email
1. Cancel a confirmed appointment
2. Check email for cancellation confirmation

## Email Flow

### Appointment Booking Flow
```
1. User books appointment
   ↓
2. Appointment created in database
   ↓
3. API call to /api/send-email/confirmation
   ↓
4. Email sent via Resend
   ↓
5. User receives confirmation email
```

### Automated Reminder Flow
```
1. Vercel Cron triggers /api/cron/send-reminders (every 5 min)
   ↓
2. Query appointments in reminder windows (24hr, 2hr, 15min)
   ↓
3. Check if reminder already sent (appointment_reminders table)
   ↓
4. Check patient notification preferences
   ↓
5. Send reminder emails via Resend
   ↓
6. Record sent reminders in database
```

### Cancellation Flow
```
1. User cancels appointment
   ↓
2. Appointment status updated to 'cancelled'
   ↓
3. API call to /api/send-email/cancellation
   ↓
4. Email sent via Resend
   ↓
5. User receives cancellation confirmation
```

## API Endpoints

### `POST /api/send-email/confirmation`
Send appointment confirmation email.

**Request Body:**
```json
{
  "appointmentId": "uuid"
}
```

### `POST /api/send-email/cancellation`
Send appointment cancellation email.

**Request Body:**
```json
{
  "appointmentId": "uuid",
  "cancellationReason": "Patient requested cancellation"
}
```

### `GET /api/cron/send-reminders`
Automated cron job for sending reminders (protected by CRON_SECRET).

**Headers:**
```
Authorization: Bearer your_cron_secret
```

## Notification Preferences Structure

```json
{
  "email": {
    "enabled": true,
    "appointment_confirmation": true,
    "appointment_reminder": true,
    "queue_updates": true,
    "cancellations": true
  },
  "sms": {
    "enabled": false,
    "appointment_reminder": true,
    "queue_updates": true
  },
  "whatsapp": {
    "enabled": false,
    "appointment_reminder": true,
    "queue_updates": true
  },
  "push": {
    "enabled": false,
    "appointment_reminder": true,
    "queue_updates": true
  }
}
```

## Monitoring & Debugging

### Check Cron Job Logs (Vercel)
1. Go to Vercel Dashboard
2. Select your project
3. Navigate to **Logs**
4. Filter by `/api/cron/send-reminders`

### Check Sent Emails (Resend)
1. Go to Resend Dashboard
2. Navigate to **Emails**
3. View all sent emails, delivery status, and errors

### Database Queries

**View sent reminders:**
```sql
SELECT * FROM appointment_reminders 
ORDER BY sent_at DESC 
LIMIT 50;
```

**Check upcoming appointments needing reminders:**
```sql
SELECT 
  a.id,
  a.token_number,
  a.scheduled_time,
  EXTRACT(EPOCH FROM (a.scheduled_time - NOW())) / 3600 as hours_until
FROM appointments a
WHERE a.status = 'confirmed'
AND a.scheduled_time > NOW()
AND a.scheduled_time < NOW() + INTERVAL '25 hours'
ORDER BY a.scheduled_time;
```

**Check patient notification preferences:**
```sql
SELECT 
  u.email,
  p.notification_preferences
FROM patients p
JOIN users u ON p.user_id = u.id
LIMIT 10;
```

## Resend Free Tier Limits

- **100 emails/day** for free
- **3,000 emails/month** for free
- For production, consider upgrading to paid plan

## Troubleshooting

### Emails Not Sending?
1. ✅ Check `RESEND_API_KEY` is set correctly
2. ✅ Verify domain is verified (for production)
3. ✅ Check Resend dashboard for error messages
4. ✅ Ensure patient has email address in database
5. ✅ Check notification preferences are enabled

### Reminders Not Working?
1. ✅ Verify `vercel.json` is deployed
2. ✅ Check Vercel cron job is active
3. ✅ Verify `CRON_SECRET` is set
4. ✅ Check database has `appointment_reminders` table
5. ✅ Review cron job logs for errors

### Duplicate Reminders?
- The system prevents duplicates via `appointment_reminders` table
- Check the unique index: `idx_unique_reminder`

## Next Steps

### Add Welcome Email to Registration
1. Update `src/app/(auth)/register/page.tsx`
2. Call email service after successful registration
3. Send welcome email to new users

### Implement SMS Notifications (Twilio)
- Similar structure to email system
- Add Twilio integration
- Update notification preferences

### Add WhatsApp Notifications
- Use Twilio WhatsApp API
- Integrate with existing notification system

## File Structure

```
src/
├── lib/
│   └── email/
│       ├── resend.ts              # Resend client initialization
│       ├── templates.tsx          # Email HTML templates
│       └── email-service.ts       # Email sending functions
├── app/
│   └── api/
│       ├── cron/
│       │   └── send-reminders/
│       │       └── route.ts       # Automated reminder cron job
│       └── send-email/
│           ├── confirmation/
│           │   └── route.ts       # Confirmation email API
│           └── cancellation/
│               └── route.ts       # Cancellation email API
└── vercel.json                    # Cron job configuration
```

## Support

For issues or questions:
- Check Resend documentation: https://resend.com/docs
- Review Vercel Cron docs: https://vercel.com/docs/cron-jobs
- Email: support@mediqueue.com

---

**🎉 Email Notification System is Ready!**

The system is now fully integrated and will automatically send:
- ✅ Confirmation emails on booking
- ✅ Automated reminders (24hr, 2hr, 15min)
- ✅ Cancellation confirmations
- ✅ Queue position updates (when implemented)


-- =====================================================
-- DATABASE UPDATES FOR NOTIFICATION SYSTEM
-- Run these SQL commands in Supabase SQL Editor
-- =====================================================

-- Create appointment_reminders table to track sent reminders
CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('24-hour', '2-hour', '15-minute')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  sent_via VARCHAR(20) NOT NULL CHECK (sent_via IN ('email', 'sms', 'whatsapp', 'push')),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered', 'read')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_appointment_reminders_appointment_id ON appointment_reminders(appointment_id);
CREATE INDEX idx_appointment_reminders_reminder_type ON appointment_reminders(reminder_type);
CREATE INDEX idx_appointment_reminders_sent_at ON appointment_reminders(sent_at);

-- Add unique constraint to prevent duplicate reminders
CREATE UNIQUE INDEX idx_unique_reminder ON appointment_reminders(appointment_id, reminder_type, sent_via);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_appointment_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_appointment_reminders_updated_at
BEFORE UPDATE ON appointment_reminders
FOR EACH ROW
EXECUTE FUNCTION update_appointment_reminders_updated_at();

-- Enable RLS on appointment_reminders
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for appointment_reminders
CREATE POLICY "Users can view their own appointment reminders"
ON appointment_reminders
FOR SELECT
USING (
  appointment_id IN (
    SELECT id FROM appointments 
    WHERE patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Only service can insert reminders"
ON appointment_reminders
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add notification_preferences column to patients table if not exists
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
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
}'::JSONB;

-- Update existing patients to have default notification preferences
UPDATE patients
SET notification_preferences = '{
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
}'::JSONB
WHERE notification_preferences IS NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify appointment_reminders table
SELECT * FROM appointment_reminders LIMIT 5;

-- Check notification preferences
SELECT id, notification_preferences FROM patients LIMIT 5;

-- View upcoming appointments that need reminders
SELECT 
  a.id,
  a.token_number,
  a.scheduled_time,
  p.users->>'email' as patient_email,
  h.name as hospital_name,
  EXTRACT(EPOCH FROM (a.scheduled_time - NOW())) / 3600 as hours_until_appointment
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN hospitals h ON a.hospital_id = h.id
WHERE a.status = 'confirmed'
AND a.scheduled_time > NOW()
AND a.scheduled_time < NOW() + INTERVAL '25 hours'
ORDER BY a.scheduled_time;


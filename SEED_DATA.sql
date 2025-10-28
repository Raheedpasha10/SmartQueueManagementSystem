-- =====================================================
-- MEDIQUEUE - SAMPLE SEED DATA
-- Run this in Supabase SQL Editor to populate your database
-- =====================================================

-- Clear existing data (optional - uncomment if you want fresh start)
-- DELETE FROM queue_entries;
-- DELETE FROM emergency_triage;
-- DELETE FROM appointments;
-- DELETE FROM doctor_hospitals;
-- DELETE FROM doctor_schedules;
-- DELETE FROM doctors;
-- DELETE FROM departments;
-- DELETE FROM hospitals;
-- DELETE FROM patients;
-- DELETE FROM addresses;

-- =====================================================
-- ADDRESSES
-- =====================================================

INSERT INTO addresses (id, street_address, city, state, postal_code, country, latitude, longitude)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '123 Medical Plaza, MG Road', 'Bangalore', 'Karnataka', '560001', 'India', 12.9716, 77.5946),
  ('a2222222-2222-2222-2222-222222222222', '456 Health Avenue, Hitech City', 'Hyderabad', 'Telangana', '500081', 'India', 17.4485, 78.3908),
  ('a3333333-3333-3333-3333-333333333333', '789 Care Street, Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'India', 13.0827, 80.2707)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- HOSPITALS
-- =====================================================

INSERT INTO hospitals (
  id, name, address_id, phone_number, email, website_url,
  emergency_capacity, current_emergency_occupancy, total_beds, available_beds,
  is_active, operates_24x7, facilities, accreditations, rating, total_reviews
)
VALUES
  (
    'h1111111-1111-1111-1111-111111111111',
    'Apollo Medical Center',
    'a1111111-1111-1111-1111-111111111111',
    '+91 80 2345 6789',
    'contact@apollo-medical.com',
    'https://apollo-medical.com',
    25, 5, 250, 67,
    true, true,
    ARRAY['ICU', 'Emergency', 'Radiology', 'Laboratory', 'Pharmacy', 'Surgery', 'Maternity'],
    ARRAY['NABH', 'JCI', 'ISO 9001'],
    4.7, 1243
  ),
  (
    'h2222222-2222-2222-2222-222222222222',
    'Fortis Health Institute',
    'a2222222-2222-2222-2222-222222222222',
    '+91 40 4567 8901',
    'info@fortis-health.com',
    'https://fortis-health.com',
    20, 3, 200, 45,
    true, true,
    ARRAY['ICU', 'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pharmacy'],
    ARRAY['NABH', 'ISO 9001'],
    4.5, 987
  ),
  (
    'h3333333-3333-3333-3333-333333333333',
    'Max Super Specialty Hospital',
    'a3333333-3333-3333-3333-333333333333',
    '+91 44 6789 0123',
    'contact@max-hospital.com',
    'https://max-hospital.com',
    30, 8, 300, 89,
    true, true,
    ARRAY['ICU', 'Emergency', 'Cardiology', 'Oncology', 'Gastroenterology', 'Nephrology', 'Surgery'],
    ARRAY['NABH', 'JCI', 'ISO 9001', 'ISO 14001'],
    4.8, 1567
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DEPARTMENTS
-- =====================================================

INSERT INTO departments (hospital_id, name, description, floor_number, is_active)
VALUES
  -- Apollo Medical Center
  ('h1111111-1111-1111-1111-111111111111', 'Cardiology', 'Heart and cardiovascular care', 3, true),
  ('h1111111-1111-1111-1111-111111111111', 'Orthopedics', 'Bone and joint treatment', 2, true),
  ('h1111111-1111-1111-1111-111111111111', 'General Medicine', 'General health consultation', 1, true),
  ('h1111111-1111-1111-1111-111111111111', 'Pediatrics', 'Child healthcare', 4, true),
  ('h1111111-1111-1111-1111-111111111111', 'Emergency', '24/7 emergency care', 0, true),
  
  -- Fortis Health Institute
  ('h2222222-2222-2222-2222-222222222222', 'Cardiology', 'Advanced heart care', 2, true),
  ('h2222222-2222-2222-2222-222222222222', 'Neurology', 'Brain and nervous system', 3, true),
  ('h2222222-2222-2222-2222-222222222222', 'General Surgery', 'Surgical procedures', 1, true),
  ('h2222222-2222-2222-2222-222222222222', 'Emergency', 'Emergency and trauma care', 0, true),
  
  -- Max Super Specialty
  ('h3333333-3333-3333-3333-333333333333', 'Oncology', 'Cancer care and treatment', 5, true),
  ('h3333333-3333-3333-3333-333333333333', 'Gastroenterology', 'Digestive system care', 3, true),
  ('h3333333-3333-3333-3333-333333333333', 'Nephrology', 'Kidney and urinary care', 2, true),
  ('h3333333-3333-3333-3333-333333333333', 'Emergency', 'Comprehensive emergency care', 0, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- NOTE: For doctors, you need to:
-- 1. Create user accounts through the app registration
-- 2. Update their role to 'doctor' in the users table
-- 3. Then create doctor records
-- =====================================================

-- Example SQL to create a doctor (AFTER creating the user account):

/*
-- Step 1: Update user role
UPDATE users 
SET role = 'doctor'
WHERE email = 'dr.rajesh@hospital.com';

-- Step 2: Get the user ID
-- SELECT id FROM users WHERE email = 'dr.rajesh@hospital.com';

-- Step 3: Create doctor record (replace USER_ID with actual ID)
INSERT INTO doctors (
  user_id, specialization, qualifications, years_of_experience,
  registration_number, consultation_fee, is_available_for_emergency,
  languages, rating, bio
)
VALUES (
  'USER_ID',
  'Cardiologist',
  ARRAY['MBBS', 'MD', 'DM Cardiology'],
  15,
  'MED12345',
  1500,
  true,
  ARRAY['English', 'Hindi', 'Kannada'],
  4.8,
  'Experienced cardiologist with 15 years of practice specializing in interventional cardiology'
);

-- Step 4: Link doctor to hospital
-- Get doctor ID: SELECT id FROM doctors WHERE user_id = 'USER_ID';

INSERT INTO doctor_hospitals (doctor_id, hospital_id, is_primary, is_active)
VALUES ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', true, true);

-- Step 5: Create doctor schedule
INSERT INTO doctor_schedules (
  doctor_id, hospital_id, day_of_week, start_time, end_time,
  slot_duration, max_patients_per_slot, is_active
)
VALUES
  -- Monday to Friday, 9 AM to 5 PM
  ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', 1, '09:00', '17:00', 30, 1, true),
  ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', 2, '09:00', '17:00', 30, 1, true),
  ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', 3, '09:00', '17:00', 30, 1, true),
  ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', 4, '09:00', '17:00', 30, 1, true),
  ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', 5, '09:00', '17:00', 30, 1, true),
  -- Saturday, 9 AM to 1 PM
  ('DOCTOR_ID', 'h1111111-1111-1111-1111-111111111111', 6, '09:00', '13:00', 30, 1, true);
*/

-- =====================================================
-- SYSTEM SETTINGS (already in schema, but adding values)
-- =====================================================

INSERT INTO system_settings (key, value, description)
VALUES
  ('appointment_slot_duration', '"15"', 'Default appointment duration in minutes'),
  ('emergency_capacity_threshold', '"80"', 'Alert threshold for emergency capacity (%)'),
  ('reminder_times', '["24", "2", "0.25"]', 'Reminder times in hours before appointment'),
  ('cancellation_grace_period', '"2"', 'Hours before appointment when cancellation is not allowed'),
  ('max_cancellations_per_year', '"3"', 'Maximum cancellations before policy enforcement'),
  ('queue_update_interval', '"30"', 'Queue position update interval in seconds')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check what was inserted:
SELECT 'Addresses' as table_name, COUNT(*) as count FROM addresses
UNION ALL
SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL
SELECT 'Departments', COUNT(*) FROM departments
UNION ALL
SELECT 'Doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'Patients', COUNT(*) FROM patients;

-- View hospitals with addresses:
SELECT 
  h.name as hospital_name,
  h.phone_number,
  a.city,
  a.state,
  h.total_beds,
  h.available_beds,
  h.rating
FROM hospitals h
JOIN addresses a ON h.address_id = a.id
WHERE h.is_active = true;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Sample data loaded successfully!';
  RAISE NOTICE '📊 Created:';
  RAISE NOTICE '   - 3 Hospitals (Apollo, Fortis, Max)';
  RAISE NOTICE '   - 13 Departments';
  RAISE NOTICE '   - System settings configured';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  To complete the setup:';
  RAISE NOTICE '   1. Register doctor accounts via the app';
  RAISE NOTICE '   2. Update user role to ''doctor''';
  RAISE NOTICE '   3. Create doctor records using the template above';
  RAISE NOTICE '   4. Link doctors to hospitals';
  RAISE NOTICE '   5. Create doctor schedules';
END $$;


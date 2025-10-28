-- =====================================================
-- DOCUMENTS & INSURANCE MANAGEMENT SCHEMA
-- Run these SQL commands in Supabase SQL Editor
-- =====================================================

-- Create document types enum
CREATE TYPE document_type AS ENUM (
  'insurance_card',
  'id_proof',
  'medical_report',
  'lab_report',
  'prescription',
  'discharge_summary',
  'vaccination_record',
  'other'
);

-- Create patient_documents table
CREATE TABLE IF NOT EXISTS patient_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- in bytes
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insurance_providers table
CREATE TABLE IF NOT EXISTS insurance_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(50) UNIQUE,
  contact_number VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  coverage_info JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_insurance table
CREATE TABLE IF NOT EXISTS patient_insurance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  insurance_provider_id UUID REFERENCES insurance_providers(id),
  policy_number VARCHAR(100) NOT NULL,
  policy_holder_name VARCHAR(255) NOT NULL,
  policy_holder_relationship VARCHAR(50), -- self, spouse, parent, child, other
  start_date DATE NOT NULL,
  end_date DATE,
  coverage_amount DECIMAL(12, 2),
  coverage_details JSONB DEFAULT '{}'::JSONB,
  card_front_document_id UUID REFERENCES patient_documents(id),
  card_back_document_id UUID REFERENCES patient_documents(id),
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_patient_documents_patient_id ON patient_documents(patient_id);
CREATE INDEX idx_patient_documents_type ON patient_documents(document_type);
CREATE INDEX idx_patient_documents_uploaded_at ON patient_documents(uploaded_at);

CREATE INDEX idx_insurance_providers_name ON insurance_providers(name);
CREATE INDEX idx_insurance_providers_code ON insurance_providers(code);

CREATE INDEX idx_patient_insurance_patient_id ON patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_provider_id ON patient_insurance(insurance_provider_id);
CREATE INDEX idx_patient_insurance_policy_number ON patient_insurance(policy_number);

-- Create unique constraint for primary insurance
CREATE UNIQUE INDEX idx_patient_primary_insurance ON patient_insurance(patient_id, is_primary) WHERE is_primary = TRUE;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_patient_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_patient_documents_updated_at
BEFORE UPDATE ON patient_documents
FOR EACH ROW
EXECUTE FUNCTION update_patient_documents_updated_at();

CREATE TRIGGER trigger_update_insurance_providers_updated_at
BEFORE UPDATE ON insurance_providers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_patient_insurance_updated_at
BEFORE UPDATE ON patient_insurance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_documents
CREATE POLICY "Users can view their own documents"
ON patient_documents
FOR SELECT
USING (
  patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload their own documents"
ON patient_documents
FOR INSERT
WITH CHECK (
  patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own documents"
ON patient_documents
FOR UPDATE
USING (
  patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own documents"
ON patient_documents
FOR DELETE
USING (
  patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Doctors can view patient documents"
ON patient_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM doctors d
    WHERE d.user_id = auth.uid()
  )
);

-- RLS Policies for insurance_providers
CREATE POLICY "Everyone can view active insurance providers"
ON insurance_providers
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Only admins can manage insurance providers"
ON insurance_providers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'hospital_admin'
  )
);

-- RLS Policies for patient_insurance
CREATE POLICY "Users can view their own insurance"
ON patient_insurance
FOR SELECT
USING (
  patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own insurance"
ON patient_insurance
FOR ALL
USING (
  patient_id IN (
    SELECT id FROM patients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Doctors can view patient insurance"
ON patient_insurance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM doctors d
    WHERE d.user_id = auth.uid()
  )
);

-- Insert sample insurance providers
INSERT INTO insurance_providers (name, code, contact_number, email, website) VALUES
  ('Star Health Insurance', 'STAR001', '1800-425-2255', 'support@starhealth.in', 'https://www.starhealth.in'),
  ('HDFC ERGO Health Insurance', 'HDFC001', '1800-266-0700', 'support@hdfcergo.com', 'https://www.hdfcergo.com'),
  ('ICICI Lombard Health Insurance', 'ICICI001', '1800-266-7780', 'support@icicilombard.com', 'https://www.icicilombard.com'),
  ('Max Bupa Health Insurance', 'MAX001', '1800-102-0330', 'support@maxbupa.com', 'https://www.maxbupa.com'),
  ('Care Health Insurance', 'CARE001', '1800-102-4488', 'support@careinsurance.com', 'https://www.careinsurance.com'),
  ('Bajaj Allianz Health Insurance', 'BAJAJ001', '1800-209-5858', 'support@bajajallianz.com', 'https://www.bajajallianz.com'),
  ('Reliance Health Insurance', 'RELI001', '1800-300-08181', 'support@reliancegeneral.co.in', 'https://www.reliancegeneral.co.in'),
  ('Apollo Munich Health Insurance', 'APOLLO001', '1800-102-4477', 'support@apollomunichinsurance.com', 'https://www.apollomunichinsurance.com'),
  ('Cigna TTK Health Insurance', 'CIGNA001', '1800-266-5844', 'support@cignattkinsurance.com', 'https://www.cignattkinsurance.com'),
  ('Manipal Cigna Health Insurance', 'MCIG001', '1800-102-6655', 'support@manipalcigna.com', 'https://www.manipalcigna.com')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- =====================================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named 'patient-documents'
-- 3. Set it to PRIVATE (not public)
-- 4. Configure RLS policies for the bucket

-- Storage RLS Policies (to be set in Supabase Dashboard):
-- Policy 1: Users can upload their own documents
--   Operation: INSERT
--   Policy: bucket_id = 'patient-documents' AND (storage.foldername(name))[1] = auth.uid()::text

-- Policy 2: Users can view their own documents
--   Operation: SELECT
--   Policy: bucket_id = 'patient-documents' AND (storage.foldername(name))[1] = auth.uid()::text

-- Policy 3: Users can update their own documents
--   Operation: UPDATE
--   Policy: bucket_id = 'patient-documents' AND (storage.foldername(name))[1] = auth.uid()::text

-- Policy 4: Users can delete their own documents
--   Operation: DELETE
--   Policy: bucket_id = 'patient-documents' AND (storage.foldername(name))[1] = auth.uid()::text

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- View insurance providers
SELECT * FROM insurance_providers ORDER BY name;

-- Check document types
SELECT unnest(enum_range(NULL::document_type)) as document_type;

-- View patient documents (when data exists)
SELECT 
  pd.*,
  p.users->>'first_name' as patient_name
FROM patient_documents pd
JOIN patients p ON pd.patient_id = p.id
LIMIT 10;

-- View patient insurance (when data exists)
SELECT 
  pi.*,
  ip.name as provider_name,
  p.users->>'first_name' as patient_name
FROM patient_insurance pi
LEFT JOIN insurance_providers ip ON pi.insurance_provider_id = ip.id
JOIN patients p ON pi.patient_id = p.id
LIMIT 10;


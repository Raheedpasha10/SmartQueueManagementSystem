// Supabase Database Types
// Auto-generated and manually maintained

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'patient' | 'receptionist' | 'doctor' | 'nurse' | 'hospital_admin' | 'super_admin';
export type GenderType = 'M' | 'F' | 'Other';
export type AppointmentType = 'routine' | 'emergency' | 'follow_up';
export type AppointmentStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type TriageLevel = '1' | '2' | '3' | '4' | '5';
export type ConsciousnessLevel = 'alert' | 'verbal' | 'pain' | 'unresponsive';
export type BreathingStatus = 'normal' | 'difficulty' | 'severe';
export type CancellationReasonType = 'personal' | 'emergency' | 'schedule_conflict' | 'feeling_better' | 'other';
export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'delivered';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          role: UserRole;
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
          date_of_birth: string | null;
          gender: GenderType | null;
          avatar_url: string | null;
          is_active: boolean;
          mfa_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          first_name: string;
          last_name: string;
          phone_number: string;
          email: string;
          date_of_birth?: string | null;
          gender?: GenderType | null;
          avatar_url?: string | null;
          is_active?: boolean;
          mfa_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          first_name?: string;
          last_name?: string;
          phone_number?: string;
          email?: string;
          date_of_birth?: string | null;
          gender?: GenderType | null;
          avatar_url?: string | null;
          is_active?: boolean;
          mfa_enabled?: boolean;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          street_address: string;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          street_address: string;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          street_address?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          address_id: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          emergency_contact_relationship: string | null;
          blood_group: string | null;
          allergies: string[] | null;
          chronic_conditions: string[] | null;
          current_medications: string[] | null;
          insurance_provider: string | null;
          insurance_policy_number: string | null;
          no_show_count: number;
          cancellation_count: number;
          total_appointments: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address_id?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          blood_group?: string | null;
          allergies?: string[] | null;
          chronic_conditions?: string[] | null;
          current_medications?: string[] | null;
          insurance_provider?: string | null;
          insurance_policy_number?: string | null;
          no_show_count?: number;
          cancellation_count?: number;
          total_appointments?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          address_id?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          emergency_contact_relationship?: string | null;
          blood_group?: string | null;
          allergies?: string[] | null;
          chronic_conditions?: string[] | null;
          current_medications?: string[] | null;
          insurance_provider?: string | null;
          insurance_policy_number?: string | null;
          no_show_count?: number;
          cancellation_count?: number;
          total_appointments?: number;
          updated_at?: string;
        };
      };
      hospitals: {
        Row: {
          id: string;
          name: string;
          address_id: string;
          phone_number: string;
          email: string;
          website_url: string | null;
          emergency_capacity: number;
          current_emergency_occupancy: number;
          total_beds: number;
          available_beds: number;
          is_active: boolean;
          operates_24x7: boolean;
          facilities: string[] | null;
          accreditations: string[] | null;
          rating: number;
          total_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address_id: string;
          phone_number: string;
          email: string;
          website_url?: string | null;
          emergency_capacity?: number;
          current_emergency_occupancy?: number;
          total_beds?: number;
          available_beds?: number;
          is_active?: boolean;
          operates_24x7?: boolean;
          facilities?: string[] | null;
          accreditations?: string[] | null;
          rating?: number;
          total_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          address_id?: string;
          phone_number?: string;
          email?: string;
          website_url?: string | null;
          emergency_capacity?: number;
          current_emergency_occupancy?: number;
          total_beds?: number;
          available_beds?: number;
          is_active?: boolean;
          operates_24x7?: boolean;
          facilities?: string[] | null;
          accreditations?: string[] | null;
          rating?: number;
          total_reviews?: number;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          hospital_id: string;
          name: string;
          description: string | null;
          floor_number: number | null;
          room_numbers: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hospital_id: string;
          name: string;
          description?: string | null;
          floor_number?: number | null;
          room_numbers?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          hospital_id?: string;
          name?: string;
          description?: string | null;
          floor_number?: number | null;
          room_numbers?: string[] | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      doctors: {
        Row: {
          id: string;
          user_id: string;
          specialization: string;
          qualifications: string[];
          years_of_experience: number;
          registration_number: string;
          consultation_fee: number;
          is_available_for_emergency: boolean;
          languages: string[];
          rating: number;
          total_consultations: number;
          total_reviews: number;
          bio: string | null;
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          specialization: string;
          qualifications: string[];
          years_of_experience?: number;
          registration_number: string;
          consultation_fee?: number;
          is_available_for_emergency?: boolean;
          languages?: string[];
          rating?: number;
          total_consultations?: number;
          total_reviews?: number;
          bio?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          specialization?: string;
          qualifications?: string[];
          years_of_experience?: number;
          registration_number?: string;
          consultation_fee?: number;
          is_available_for_emergency?: boolean;
          languages?: string[];
          rating?: number;
          total_consultations?: number;
          total_reviews?: number;
          bio?: string | null;
          profile_image_url?: string | null;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          token_number: string;
          patient_id: string;
          doctor_id: string;
          hospital_id: string;
          department_id: string | null;
          appointment_type: AppointmentType;
          triage_level: TriageLevel | null;
          scheduled_time: string;
          estimated_duration: number;
          status: AppointmentStatus;
          queue_position: number | null;
          estimated_wait_time: number | null;
          actual_wait_time: number | null;
          check_in_time: string | null;
          call_time: string | null;
          start_time: string | null;
          completion_time: string | null;
          cancellation_reason: CancellationReasonType | null;
          cancellation_notes: string | null;
          cancelled_at: string | null;
          cancelled_by: string | null;
          notes: string | null;
          prescription: string | null;
          follow_up_required: boolean;
          follow_up_date: string | null;
          qr_code_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          token_number: string;
          patient_id: string;
          doctor_id: string;
          hospital_id: string;
          department_id?: string | null;
          appointment_type?: AppointmentType;
          triage_level?: TriageLevel | null;
          scheduled_time: string;
          estimated_duration?: number;
          status?: AppointmentStatus;
          queue_position?: number | null;
          estimated_wait_time?: number | null;
          actual_wait_time?: number | null;
          check_in_time?: string | null;
          call_time?: string | null;
          start_time?: string | null;
          completion_time?: string | null;
          cancellation_reason?: CancellationReasonType | null;
          cancellation_notes?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          notes?: string | null;
          prescription?: string | null;
          follow_up_required?: boolean;
          follow_up_date?: string | null;
          qr_code_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: AppointmentStatus;
          queue_position?: number | null;
          estimated_wait_time?: number | null;
          actual_wait_time?: number | null;
          check_in_time?: string | null;
          call_time?: string | null;
          start_time?: string | null;
          completion_time?: string | null;
          cancellation_reason?: CancellationReasonType | null;
          cancellation_notes?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          notes?: string | null;
          prescription?: string | null;
          follow_up_required?: boolean;
          follow_up_date?: string | null;
          updated_at?: string;
        };
      };
      emergency_triage: {
        Row: {
          id: string;
          appointment_id: string;
          patient_id: string;
          symptoms: string[];
          chief_complaint: string;
          pain_level: number | null;
          consciousness: ConsciousnessLevel;
          breathing: BreathingStatus;
          heart_rate: number | null;
          blood_pressure_systolic: number | null;
          blood_pressure_diastolic: number | null;
          temperature: number | null;
          oxygen_saturation: number | null;
          triage_level: TriageLevel;
          auto_assigned_level: TriageLevel | null;
          manual_override: boolean;
          override_reason: string | null;
          triaged_by: string | null;
          triaged_at: string;
          reassessed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          patient_id: string;
          symptoms: string[];
          chief_complaint: string;
          pain_level?: number | null;
          consciousness?: ConsciousnessLevel;
          breathing?: BreathingStatus;
          heart_rate?: number | null;
          blood_pressure_systolic?: number | null;
          blood_pressure_diastolic?: number | null;
          temperature?: number | null;
          oxygen_saturation?: number | null;
          triage_level: TriageLevel;
          auto_assigned_level?: TriageLevel | null;
          manual_override?: boolean;
          override_reason?: string | null;
          triaged_by?: string | null;
          triaged_at?: string;
          reassessed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          symptoms?: string[];
          chief_complaint?: string;
          pain_level?: number | null;
          consciousness?: ConsciousnessLevel;
          breathing?: BreathingStatus;
          heart_rate?: number | null;
          blood_pressure_systolic?: number | null;
          blood_pressure_diastolic?: number | null;
          temperature?: number | null;
          oxygen_saturation?: number | null;
          triage_level?: TriageLevel;
          manual_override?: boolean;
          override_reason?: string | null;
          reassessed_at?: string | null;
          updated_at?: string;
        };
      };
      queue_entries: {
        Row: {
          id: string;
          appointment_id: string;
          hospital_id: string;
          department_id: string | null;
          queue_position: number;
          estimated_call_time: string | null;
          is_active: boolean;
          entered_queue_at: string;
          left_queue_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          hospital_id: string;
          department_id?: string | null;
          queue_position: number;
          estimated_call_time?: string | null;
          is_active?: boolean;
          entered_queue_at?: string;
          left_queue_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          queue_position?: number;
          estimated_call_time?: string | null;
          is_active?: boolean;
          left_queue_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      v_active_appointments: {
        Row: {
          id: string;
          token_number: string;
          scheduled_time: string;
          status: AppointmentStatus;
          triage_level: TriageLevel | null;
          queue_position: number | null;
          estimated_wait_time: number | null;
          patient_name: string;
          patient_phone: string;
          blood_group: string | null;
          doctor_name: string;
          specialization: string;
          hospital_name: string;
          department_name: string | null;
          emergency_level: TriageLevel | null;
          chief_complaint: string | null;
        };
      };
      v_hospital_capacity: {
        Row: {
          id: string;
          name: string;
          emergency_capacity: number;
          current_emergency_occupancy: number;
          total_beds: number;
          available_beds: number;
          emergency_occupancy_percent: number;
          bed_occupancy_percent: number;
          appointments_today: number;
          emergencies_today: number;
          is_active: boolean;
          rating: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      gender_type: GenderType;
      appointment_type: AppointmentType;
      appointment_status: AppointmentStatus;
      triage_level: TriageLevel;
      consciousness_level: ConsciousnessLevel;
      breathing_status: BreathingStatus;
      cancellation_reason_type: CancellationReasonType;
      notification_channel: NotificationChannel;
      notification_status: NotificationStatus;
    };
  };
}


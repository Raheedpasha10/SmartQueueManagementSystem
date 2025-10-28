import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get patient record with all details
  const { data: patient, error } = await supabase
    .from("patients")
    .select(`
      *,
      users (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        date_of_birth
      ),
      addresses (*)
    `)
    .eq("user_id", user.id)
    .single();

  // If no patient record, create one automatically
  if (!patient || error) {
    console.log('No patient record found, creating new one...');
    
    // Try creating patient with minimal required fields
    const { data: newPatient, error: createError } = await supabase
      .from("patients")
      .insert({
        user_id: user.id,
      })
      .select(`
        *,
        users (
          id,
          first_name,
          last_name,
          email,
          phone_number,
          date_of_birth
        ),
        addresses (*)
      `)
      .single();
    
    if (createError) {
      console.error('Error creating patient:', createError);
      
      // Last resort: return a temporary patient object with user ID
      // The ProfileClient will handle creating the patient on save
      const tempPatient = {
        id: `temp-${user.id}`, // Temporary ID to prevent null errors
        user_id: user.id,
        blood_group: null,
        emergency_contact_name: null,
        emergency_contact_phone: null,
        users: {
          id: user.id,
          first_name: null,
          last_name: null,
          email: user.email,
          phone_number: null,
          date_of_birth: null
        },
        addresses: null,
        _isTemporary: true // Flag to indicate this needs to be created
      };
      
      return <ProfileClient patient={tempPatient} isNew={true} />;
    }
    
    // If creation succeeded, use newPatient
    if (newPatient) {
      // Add fallback user data if users relation didn't load
      if (!newPatient.users) {
        newPatient.users = {
          id: user.id,
          first_name: null,
          last_name: null,
          email: user.email,
          phone_number: null,
          date_of_birth: null
        };
      }
      return <ProfileClient patient={newPatient} isNew={true} />;
    }
  }

  // Add fallback user data if users relation didn't load
  if (patient && !patient.users) {
    patient.users = {
      id: user.id,
      first_name: null,
      last_name: null,
      email: user.email,
      phone_number: null,
      date_of_birth: null
    };
  }

  return <ProfileClient patient={patient} />;
}


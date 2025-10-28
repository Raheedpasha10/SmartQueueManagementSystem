"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function createPatientRecord(userId: string, userData: {
  email: string;
  first_name?: string;
  last_name?: string;
}) {
  try {
    const supabase = createAdminClient();

    console.log("Server: Creating patient record for user:", userId);
    console.log("Server: User data:", userData);

    // First, ensure user record exists in users table
    console.log("Server: Checking if user exists in users table...");
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingUser) {
      console.log("Server: User not found in users table, creating...");
      const { error: userCreateError } = await supabase
        .from("users")
        .insert({
          id: userId,
          email: userData.email,
          first_name: userData.first_name || null,
          last_name: userData.last_name || null,
          phone_number: "", // Default empty string to satisfy NOT NULL constraint
          role: "patient",
        });

      if (userCreateError) {
        console.error("Server: Error creating user:", userCreateError);
        return { success: false, error: `Failed to create user: ${userCreateError.message}` };
      }
      console.log("Server: User created successfully in users table");
    } else {
      console.log("Server: User already exists in users table");
    }

    // Check if patient record already exists
    console.log("Server: Checking if patient record exists...");
    const { data: existingPatient } = await supabase
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
        )
      `)
      .eq("user_id", userId)
      .single();

    if (existingPatient) {
      console.log("Server: Patient record already exists:", existingPatient.id);
      return { success: true, data: existingPatient };
    }

    // Create patient record if it doesn't exist
    console.log("Server: Creating patient record...");
    const { data: newPatient, error: createError } = await supabase
      .from("patients")
      .insert({
        user_id: userId,
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
        )
      `)
      .single();

    if (createError) {
      console.error("Server: Error creating patient:", createError);
      return { success: false, error: createError.message };
    }

    console.log("Server: Patient created successfully:", newPatient.id);
    return { success: true, data: newPatient };
  } catch (error: any) {
    console.error("Server: Exception creating patient:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(userId: string, data: {
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  date_of_birth?: string | null;
}) {
  try {
    const supabase = createAdminClient();

    console.log("Server: Updating user profile:", userId);

    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      console.error("Server: Error updating user:", error);
      return { success: false, error: error.message };
    }

    console.log("Server: User updated successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Server: Exception updating user:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePatientProfile(patientId: string, data: {
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
}) {
  try {
    const supabase = createAdminClient();

    console.log("Server: Updating patient profile:", patientId);

    const { error } = await supabase
      .from("patients")
      .update(data)
      .eq("id", patientId);

    if (error) {
      console.error("Server: Error updating patient:", error);
      return { success: false, error: error.message };
    }

    console.log("Server: Patient updated successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Server: Exception updating patient:", error);
    return { success: false, error: error.message };
  }
}


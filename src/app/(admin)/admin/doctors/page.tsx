import { createClient } from "@/lib/supabase/server";
import { DoctorManagementClient } from "./doctors-client";

export default async function DoctorsManagementPage() {
  const supabase = await createClient();

  // Fetch doctors with their details
  const { data: doctors, error } = await supabase
    .from("doctors")
    .select(`
      *,
      users (
        id,
        first_name,
        last_name,
        email,
        phone_number
      ),
      departments (
        id,
        name
      ),
      hospitals (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <DoctorManagementClient
      doctors={doctors || []}
    />
  );
}


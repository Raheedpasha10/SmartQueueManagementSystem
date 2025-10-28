import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get patient record
  const { data: patient } = await supabase
    .from("patients")
    .select(`
      *,
      users (*)
    `)
    .eq("user_id", user.id)
    .single();

  if (!patient) {
    return <div>Patient record not found</div>;
  }

  return <SettingsClient patient={patient} />;
}


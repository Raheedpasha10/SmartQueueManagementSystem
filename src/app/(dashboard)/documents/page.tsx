import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DocumentsClient } from "./documents-client";

export const metadata = {
  title: "Documents & Insurance",
  description: "Manage your documents and insurance information",
};

export default async function DocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get patient data
  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!patient) {
    redirect("/dashboard");
  }

  // Get insurance providers
  const { data: insuranceProviders } = await supabase
    .from("insurance_providers")
    .select("*")
    .eq("is_active", true)
    .order("name");

  // Get patient insurance
  const { data: patientInsurance } = await supabase
    .from("patient_insurance")
    .select(
      `
      *,
      insurance_providers (name, logo_url)
    `
    )
    .eq("patient_id", patient.id)
    .order("is_primary", { ascending: false });

  return (
    <DocumentsClient
      patient={patient}
      insuranceProviders={insuranceProviders || []}
      patientInsurance={patientInsurance || []}
    />
  );
}


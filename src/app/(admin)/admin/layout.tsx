import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has admin role
  const { data: userRecord } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userRecord || !["hospital_admin", "super_admin"].includes(userRecord.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}


"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function VerificationMessage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully!", {
        description: "Your account has been verified. Welcome to MediQueue!",
      });
      // Clean up URL
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return null;
}


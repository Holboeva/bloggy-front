"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/api";

/**
 * Redirects to /login if no token. Use in client components for protected routes.
 */
export function useRequireAuth(): void {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);
}

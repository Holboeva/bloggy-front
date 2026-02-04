"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AppShell } from "./AppShell";

interface ConditionalAppShellProps {
  children: ReactNode;
}

export function ConditionalAppShell({ children }: ConditionalAppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}

"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AppShell } from "./AppShell";

interface ConditionalAppShellProps {
  children: ReactNode;
}

export function ConditionalAppShell({ children }: ConditionalAppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}

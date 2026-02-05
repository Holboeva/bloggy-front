"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCurrentUser } from "@/lib/api";
import { getAvatarInitials } from "@/lib/avatar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProfileByUsernamePage() {
  useRequireAuth();
  const params = useParams();
  const router = useRouter();
  const username = typeof params.username === "string" ? params.username : "";

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!username) {
      setIsChecking(false);
      return;
    }
    let isMounted = true;
    getCurrentUser()
      .then((me) => {
        if (!isMounted) return;
        if (me.username === username) {
          router.replace("/profile");
          return;
        }
        setIsChecking(false);
      })
      .catch(() => {
        if (isMounted) setIsChecking(false);
      });
    return () => {
      isMounted = false;
    };
  }, [username, router]);

  if (isChecking && username) {
    return (
      <section className="space-y-6">
        <PageHeader title="Profile" description="Loading..." />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </section>
    );
  }

  if (!username) {
    return (
      <section className="space-y-6">
        <PageHeader title="Profile" description="User not found." />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Invalid profile URL.
        </p>
      </section>
    );
  }

  const initials = getAvatarInitials(undefined, undefined, username);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Profile"
        description={`Public profile of ${username} on Bloggy.`}
      />

      <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-xl font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {username}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Member on Bloggy. Full profile details are only visible to the account owner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

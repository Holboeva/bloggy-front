"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCurrentUser, type UserProfile } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProfilePage() {
  useRequireAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getCurrentUser();
        if (isMounted) setUser(data);
      } catch (e) {
        if (isMounted) {
          setError("Could not load profile. You may need to sign in again.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Profile"
          description="Your public presence on Bloggy."
        />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading profile...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Profile"
          description="Your public presence on Bloggy."
        />
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Profile"
          description="Your public presence on Bloggy."
        />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No profile data available.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your public presence on Bloggy — bio, skills, links, and highlighted work."
      />

      <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Username
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {user.username}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Email
            </h2>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
              {user.email}
            </p>
          </div>
          {user.bio != null && user.bio !== "" && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Bio
              </h2>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                {user.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

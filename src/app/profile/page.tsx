"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  getCurrentUser,
  updateProfile,
  type UpdateProfilePayload,
  type UserProfile,
} from "@/lib/api";
import { getAvatarInitials } from "@/lib/avatar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ProfilePage() {
  useRequireAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<UpdateProfilePayload>({
    first_name: "",
    last_name: "",
    bio: "",
    skills: [],
  });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUser(data);
          setForm({
            first_name: data.first_name ?? "",
            last_name: data.last_name ?? "",
            bio: data.bio ?? "",
            skills: data.skills ?? [],
          });
        }
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

  const initials = getAvatarInitials(
    user.first_name,
    user.last_name,
    user.username,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError(null);
    try {
      setIsSaving(true);
      const cleaned: UpdateProfilePayload = {
        first_name: form.first_name?.trim() || "",
        last_name: form.last_name?.trim() || "",
        bio: form.bio ?? "",
        skills: (form.skills ?? []).map((s) => s.trim()).filter(Boolean),
      };
      const updated = await updateProfile(cleaned);
      setUser(updated);
      setIsEditing(false);
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e && typeof (e as any).message === "string"
          ? (e as any).message
          : "Could not save profile changes.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your public presence on Bloggy — bio, skills, links, and highlighted work."
      />

      <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-xl font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {user.first_name || user.last_name
                    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                    : user.username}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  @{user.username}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="inline-flex items-center rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                {isEditing ? "Cancel" : "Edit profile"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      First name
                    </label>
                    <input
                      type="text"
                      value={form.first_name ?? ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          first_name: e.target.value,
                        }))
                      }
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={form.last_name ?? ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          last_name: e.target.value,
                        }))
                      }
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={form.bio ?? ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Tell people what you do, what you're interested in, or what you're building."
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Skills
                    <span className="ml-1 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                      (comma separated, e.g. React, Django, Product)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={(form.skills ?? []).join(", ")}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        skills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                  />
                </div>

                {saveError ? (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    {saveError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Email
                  </h2>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                    {user.email}
                  </p>
                </div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Bio
                  </h2>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                    {user.bio ||
                      "Use the Edit button above to add a short bio for your profile."}
                  </p>
                </div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Skills
                  </h2>
                  {user.skills && user.skills.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

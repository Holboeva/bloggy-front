"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { apiGet, apiPost } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type Group = {
  id: number;
  name: string;
  description: string;
  owner: string;
  members_count: number;
  is_private: boolean;
};

type CreateGroupPayload = {
  name: string;
  description: string;
  is_private: boolean;
};

const demoGroups: Group[] = [
  {
    id: 0,
    name: "Indie Hackers · Tashkent",
    description: "Founders and makers building products from Tashkent.",
    owner: "demo_owner",
    members_count: 42,
    is_private: false,
  },
  {
    id: -1,
    name: "Django + React Builders",
    description: "Developers shipping SaaS using Django REST + React/Next.js.",
    owner: "demo_owner",
    members_count: 87,
    is_private: false,
  },
];

export default function GroupsPage() {
  useRequireAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateGroupPayload>({
    name: "",
    description: "",
    is_private: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiGet<Group[]>("/groups/");
        if (!isMounted) return;
        setGroups(data);
      } catch {
        if (!isMounted) return;
        // On error, fall back to demo data so the page still looks alive
        setError(
          "Could not load groups from the server. Showing demo groups instead.",
        );
        setGroups(demoGroups);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const description = form.description.trim();
    if (!name) return;
    try {
      setIsSubmitting(true);
      const created = await apiPost<Group, CreateGroupPayload>("/groups/", {
        name,
        description,
        is_private: form.is_private,
      });
      setGroups((prev) =>
        prev.some((g) => g.id === demoGroups[0]?.id)
          ? [created]
          : [created, ...prev],
      );
      setForm({ name: "", description: "", is_private: false });
      setError(null);
    } catch {
      setError("Could not create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <PageHeader
        title="Groups"
        description="Create and join communities around products, topics, and local ecosystems."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Create a group
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              This will use the live API at /api/groups/.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Uzbekistan Tech Founders"
              className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="What is this group for? Who should join?"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, is_private: e.target.checked }))
              }
              className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 outline-none focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
            Private group (members only)
          </label>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Fields marked with * are required.
          </p>
          <button
            type="submit"
            disabled={!form.name.trim() || isSubmitting}
            className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? "Creating..." : "Create group"}
          </button>
        </div>
        {error ? (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        ) : null}
      </form>

      <div className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Groups {isLoading ? "(loading…)" : ""}
          </p>
          {groups.length === 0 && !isLoading ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No groups yet. Be the first to create one.
            </p>
          ) : null}
        </div>
        {groups.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <li
                key={group.id}
                className="rounded-2xl border border-zinc-200 bg-white/95 p-4 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {group.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      {group.is_private ? "Private group" : "Public group"} ·{" "}
                      {group.members_count} members
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  {group.description || "No description yet."}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}


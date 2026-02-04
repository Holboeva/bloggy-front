 "use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

type Project = {
  id: string;
  title: string;
  description: string;
  link?: string;
  createdAt: string;
};

type ProjectFormState = {
  title: string;
  description: string;
  link: string;
};

const INITIAL_FORM_STATE: ProjectFormState = {
  title: "",
  description: "",
  link: "",
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const link = form.link.trim();

    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      link: link || undefined,
      createdAt: new Date().toLocaleDateString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    setForm(INITIAL_FORM_STATE);
    setError(null);
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  const isSubmitDisabled =
    !form.title.trim() || !form.description.trim() || form.title.length > 120;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Add and organize the projects you want to highlight on your Bloggy profile."
      />

      {/* Add Project Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm ring-1 ring-transparent transition focus-within:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/80 dark:focus-within:ring-zinc-700 sm:p-5"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Add project
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Share work you&apos;re proud of.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Bloggy — social-professional platform"
              className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:focus:ring-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              rows={3}
              placeholder="Briefly describe the project, your role, and the outcome."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:focus:ring-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="link"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Project link
              <span className="ml-1 text-[11px] font-normal text-zinc-400 dark:text-zinc-500">
                (optional)
              </span>
            </label>
            <input
              id="link"
              name="link"
              type="url"
              value={form.link}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, link: event.target.value }))
              }
              placeholder="https://"
              className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:focus:ring-zinc-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Fields marked with * are required.
          </p>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add project
          </button>
        </div>
        {error ? (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        ) : null}
      </form>

      {/* Project List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You haven&apos;t added any projects yet. Start by adding one above.
          </p>
        ) : (
          <ul className="grid gap-3 sm:gap-4">
            {projects.map((project) => (
              <li
                key={project.id}
                className="rounded-2xl border border-zinc-200 bg-white/95 p-4 text-sm text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-200 sm:p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      Added on {project.createdAt}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-2 sm:mt-0">
                    {project.link ? (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
                      >
                        Visit
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="inline-flex items-center rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {project.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}


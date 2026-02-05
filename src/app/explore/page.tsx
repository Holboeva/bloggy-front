import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

const demoProfiles = [
  {
    name: "Amina Rustamova",
    title: "Product designer · Fintech",
    bio: "Designing simple experiences for complex financial products.",
    tags: ["UX/UI", "Design Systems", "Figma"],
  },
  {
    name: "Javlon Karimov",
    title: "Full‑stack engineer · SaaS",
    bio: "Shipping React + Django apps for early‑stage startups.",
    tags: ["React", "Django", "PostgreSQL"],
  },
  {
    name: "Bloggy Community",
    title: "Early adopters",
    bio: "Founders, engineers, and designers building in public.",
    tags: ["Founders", "Builders", "Open to collab"],
  },
];

export default function ExplorePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Explore"
        description="Discover founders, designers, developers, and projects across the Bloggy network."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Featured people
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {demoProfiles.map((profile) => (
              <li
                key={profile.name}
                className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {profile.name}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {profile.title}
                </p>
                <p className="mt-1 line-clamp-3 text-[11px]">{profile.bio}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


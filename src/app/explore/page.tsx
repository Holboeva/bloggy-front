import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

export default function ExplorePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Explore"
        description="Discover founders, designers, developers, and projects across the Bloggy network."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="font-medium text-zinc-700 dark:text-zinc-200">
            Explore placeholder
          </p>
          <p className="mt-1">
            This area will show suggested profiles, trending projects, and tags
            to help users expand their professional network.
          </p>
        </div>
      </div>
    </section>
  );
}


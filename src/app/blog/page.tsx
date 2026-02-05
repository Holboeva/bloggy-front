import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

export default function BlogPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Blog"
        description="Long‑form blogging is coming soon to Bloggy."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            Coming soon
          </p>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
            In the next iterations, you&apos;ll be able to write blog posts,
            publish updates, and highlight long‑form content alongside your
            feed.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>Draft and publish posts with rich text.</li>
            <li>Tag posts by topics (e.g. Django, startups, UI).</li>
            <li>Showcase selected posts on your public profile.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}


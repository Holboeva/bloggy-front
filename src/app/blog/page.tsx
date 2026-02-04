import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

export default function BlogPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Blog"
        description="Write, publish, and manage long-form content to share your ideas with the Bloggy community."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="font-medium text-zinc-700 dark:text-zinc-200">
            Blog list placeholder
          </p>
          <p className="mt-1">
            Here you&apos;ll see your drafted and published posts with titles,
            tags, and stats like views and likes.
          </p>
        </div>
      </div>
    </section>
  );
}


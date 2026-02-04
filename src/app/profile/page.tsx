import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

export default function ProfilePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your public presence on Bloggy — bio, skills, links, and highlighted work."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="font-medium text-zinc-700 dark:text-zinc-200">
            Profile placeholder
          </p>
          <p className="mt-1">
            This view will combine your avatar, headline, bio, skills, social
            links, and shortcuts to your portfolio and blog posts.
          </p>
        </div>
      </div>
    </section>
  );
}


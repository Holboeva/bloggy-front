import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

export default function ChatPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Chat"
        description="Stay in touch with collaborators, clients, and your network through direct messages."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="grid gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <div className="space-y-2">
            <p className="font-medium text-zinc-700 dark:text-zinc-200">
              Conversations list placeholder
            </p>
            <p>
              This column will display recent chats with avatars, names, last
              messages, and online indicators.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-zinc-700 dark:text-zinc-200">
              Message thread placeholder
            </p>
            <p>
              The conversation view will show message bubbles, timestamps, and a
              composer at the bottom for sending new messages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-static";

const demoConversations = [
  {
    id: "1",
    name: "Bloggy Launch Squad",
    lastMessage: "Let’s ship the comments feature tonight 🚀",
    time: "2 min ago",
  },
  {
    id: "2",
    name: "Amina · Product Design",
    lastMessage: "Sent you the updated hero section mockups.",
    time: "1 hr ago",
  },
  {
    id: "3",
    name: "Javlon · Full‑stack",
    lastMessage: "DB migrations are live on Render.",
    time: "Yesterday",
  },
];

const demoThread = [
  {
    fromMe: false,
    text: "How does Bloggy look for tomorrow's demo?",
    time: "09:12",
  },
  {
    fromMe: true,
    text: "Feed + profile + groups are ready. Media uploads will be 'coming soon'.",
    time: "09:14",
  },
  {
    fromMe: false,
    text: "Perfect. Let’s focus on storytelling and the UX.",
    time: "09:15",
  },
];

export default function ChatPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Chat"
        description="Stay in touch with collaborators, clients, and your network through direct messages."
      />

      <div className="grid gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
          <div className="space-y-3 border-b border-zinc-100 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-3 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Demo conversations
            </p>
            <ul className="space-y-1.5">
              {demoConversations.map((c) => (
                <li
                  key={c.id}
                  className="flex cursor-default items-center justify-between rounded-xl px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/70"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {c.name}
                    </p>
                    <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {c.lastMessage}
                    </p>
                  </div>
                  <span className="ml-2 shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {c.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Demo message thread
            </p>
            <div className="space-y-2 rounded-xl bg-zinc-50/80 p-3 dark:bg-zinc-900/60">
              {demoThread.map((m, index) => (
                <div
                  key={index}
                  className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={[
                      "max-w-[80%] rounded-2xl px-3 py-1.5 text-xs",
                      m.fromMe
                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-50",
                    ].join(" ")}
                  >
                    <p>{m.text}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
              <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                This is static demo data to show how conversation threads will
                look.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


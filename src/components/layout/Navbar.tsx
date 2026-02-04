"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, MessageCircle, Search, X } from "lucide-react";
import { logout } from "@/lib/api";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.replace("/login");
  };

  return (
     <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
       <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-3 sm:h-16 sm:px-4 lg:px-6">
         {/* Left: Logo + mobile menu */}
         <div className="flex flex-1 items-center gap-2">
           <button
             type="button"
             onClick={onToggleSidebar}
             className="inline-flex items-center justify-center rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 lg:hidden"
             aria-label="Toggle navigation"
           >
             <Menu className="h-5 w-5" />
           </button>
           <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg">
             Bloggy
           </span>
         </div>

         {/* Center: Search */}
         <div className="hidden flex-[2] items-center justify-center px-2 sm:flex">
           <div className="relative w-full max-w-md">
             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
             <input
               type="search"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search people, posts, or tags"
               className="h-9 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:focus:ring-zinc-800"
             />
             {search && (
               <button
                 type="button"
                 onClick={() => setSearch("")}
                 className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                 aria-label="Clear search"
               >
                 <X className="h-3 w-3" />
               </button>
             )}
           </div>
         </div>

         {/* Right: icons */}
         <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
           <button
             type="button"
             className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
             aria-label="Notifications"
           >
             <Bell className="h-4 w-4" />
           </button>
           <button
             type="button"
             className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
             aria-label="Messages"
           >
             <MessageCircle className="h-4 w-4" />
           </button>
           <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-xs font-medium text-white shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-800"
              aria-label="Open profile menu"
            >
              BG
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
         </div>
       </div>
    </header>
  );
}


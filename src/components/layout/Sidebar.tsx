 "use client";

 import Link from "next/link";
 import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Briefcase,
  FileText,
  MessageCircle,
  Users,
  User,
} from "lucide-react";

 interface SidebarProps {
   isOpenMobile: boolean;
   onCloseMobile: () => void;
 }

const navItems = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
];

 export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
   const pathname = usePathname();

   const content = (
     <nav className="flex h-full flex-col gap-2 p-3">
       <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
         Navigation
       </p>
       <div className="space-y-1">
         {navItems.map((item) => {
           const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

           return (
             <Link
               key={item.href}
               href={item.href}
               onClick={onCloseMobile}
               className={[
                 "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                 "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
                 isActive
                   ? "bg-zinc-900 text-zinc-50 shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                   : "text-zinc-600 dark:text-zinc-400",
               ].join(" ")}
             >
               <Icon
                 className={`h-4 w-4 ${
                   isActive
                     ? "text-zinc-50 dark:text-zinc-900"
                     : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200"
                 }`}
               />
               <span>{item.label}</span>
             </Link>
           );
         })}
       </div>
     </nav>
   );

   return (
     <>
       {/* Desktop sidebar */}
       <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-zinc-200 bg-white/70 px-1 pt-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70 lg:block">
         {content}
       </aside>

       {/* Mobile sidebar overlay */}
       <div
         className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
           isOpenMobile ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
         }`}
         onClick={onCloseMobile}
       >
         <aside
           className={`absolute left-0 top-0 flex h-full w-64 max-w-[80%] transform flex-col border-r border-zinc-800 bg-zinc-950/95 shadow-xl transition-transform duration-200 ${
             isOpenMobile ? "translate-x-0" : "-translate-x-full"
           }`}
           onClick={(e) => e.stopPropagation()}
         >
           <div className="flex items-center justify-between px-4 py-3">
             <span className="text-sm font-semibold text-zinc-50">Bloggy</span>
             <button
               type="button"
               onClick={onCloseMobile}
               className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
               aria-label="Close navigation"
             >
               <span className="text-base leading-none">&times;</span>
             </button>
           </div>
           <div className="border-t border-zinc-800" />
           <div className="flex-1 overflow-y-auto">{content}</div>
         </aside>
       </div>
     </>
   );
 }


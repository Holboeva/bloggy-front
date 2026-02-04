 "use client";

 import { ReactNode, useState } from "react";
 import { Navbar } from "./Navbar";
 import { Sidebar } from "./Sidebar";

 interface AppShellProps {
   children: ReactNode;
 }

 /**
  * AppShell is the main layout wrapper for authenticated Bloggy pages.
  * It renders the sticky top navbar, responsive sidebar, and a centered content area.
  */
 export function AppShell({ children }: AppShellProps) {
   const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

   return (
     <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
       <Navbar
         onToggleSidebar={() => setIsSidebarOpenMobile((open) => !open)}
       />
       <div className="mx-auto flex w-full max-w-6xl flex-1 gap-0 px-3 pb-6 pt-3 sm:px-4 lg:px-6">
         <Sidebar
           isOpenMobile={isSidebarOpenMobile}
           onCloseMobile={() => setIsSidebarOpenMobile(false)}
         />

         <main className="flex-1">
           <div className="mx-auto max-w-3xl space-y-4 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-zinc-200 backdrop-blur-sm dark:bg-zinc-950/70 dark:ring-zinc-800 sm:p-6">
             {children}
           </div>
         </main>
       </div>
     </div>
   );
 }


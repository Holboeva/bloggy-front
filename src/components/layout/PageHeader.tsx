 import type { ReactNode } from "react";

 interface PageHeaderProps {
   title: string;
   description: string;
   actions?: ReactNode;
 }

 export function PageHeader({ title, description, actions }: PageHeaderProps) {
   return (
     <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
       <div>
         <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
           {title}
         </h1>
         <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
           {description}
         </p>
       </div>
       {actions ? (
         <div className="flex flex-wrap gap-2 pt-1 sm:pt-0">{actions}</div>
       ) : null}
     </header>
   );
 }


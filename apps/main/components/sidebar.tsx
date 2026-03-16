"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, Settings } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Spaces", href: "/spaces", icon: Grid2x2 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-[220px] flex-col border-r border-zinc-200 bg-[#fafafa] dark:border-zinc-800 dark:bg-[#09090b]">
            <div className="p-4">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-sans" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                    Gather
                </h1>
                <div className="mt-1 flex flex-col">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Arjun Singh</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Computer Science</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-zinc-100/80 text-zinc-900 dark:bg-zinc-800/50 dark:text-white"
                                    : "text-zinc-600 hover:bg-zinc-100/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-8 cursor-pointer rounded-full bg-zinc-200 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 flex items-center justify-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        AS
                    </div>
                    <button className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
                        <Settings className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

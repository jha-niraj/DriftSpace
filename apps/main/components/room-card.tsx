import { cn } from "@repo/ui/lib/utils";

interface RoomCardProps {
    id: string;
    name: string;
    isLive: boolean;
    peopleCount: number;
    onClick?: () => void;
}

export function RoomCard({ id, name, isLive, peopleCount, onClick }: RoomCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative flex h-[130px] cursor-pointer flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-150 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
            <div className="flex items-start justify-between">
                <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight line-clamp-2">
                    {name}
                </h3>
                <div
                    className={cn(
                        "flex flex-shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        isLive ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}
                >
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isLive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-zinc-400 dark:bg-zinc-500"
                    )} />
                    {isLive ? "Live" : "Empty"}
                </div>
            </div>

            <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                {peopleCount} {peopleCount === 1 ? "person" : "people"}
            </div>
        </div>
    );
}

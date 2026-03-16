"use client"

import { useState } from "react";
import { RoomCard } from "../../../components/room-card";
import { cn } from "@repo/ui/lib/utils";

const demoRooms = [
    { id: "1", name: "Library — Ground Floor", isLive: true, peopleCount: 7 },
    { id: "2", name: "Library — Top Floor", isLive: true, peopleCount: 3 },
    { id: "3", name: "CS Lab 204", isLive: false, peopleCount: 0 },
    { id: "4", name: "Cafeteria Hangout", isLive: true, peopleCount: 12 },
    { id: "5", name: "Seminar Hall B", isLive: false, peopleCount: 0 },
    { id: "6", name: "Reading Corner", isLive: false, peopleCount: 0 },
];

type Filter = "All" | "Live" | "Empty";

export default function SpacesPage() {
    const [activeFilter, setActiveFilter] = useState<Filter>("All");

    const filteredRooms = demoRooms.filter(room => {
        if (activeFilter === "Live") return room.isLive;
        if (activeFilter === "Empty") return !room.isLive;
        return true; // "All"
    });

    return (
        <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                    All Spaces
                </h1>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                    Every room, live or quiet.
                </p>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
                {(["All", "Live", "Empty"] as Filter[]).map((filter) => {
                    const isActive = activeFilter === filter;
                    return (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                                isActive
                                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            )}
                        >
                            {filter}
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map((room) => (
                    <RoomCard
                        key={room.id}
                        id={room.id}
                        name={room.name}
                        isLive={room.isLive}
                        peopleCount={room.peopleCount}
                    />
                ))}
            </div>
        </div>
    );
}

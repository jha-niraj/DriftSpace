"use client"

import { useState, useRef } from "react";
import Image from "next/image";
import { 
    Camera, Pencil 
} from "lucide-react";
import { RoomCard } from "../../../components/room-card";
import { Button } from "@repo/ui/components/ui/button";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@repo/ui/components/ui/sheet";

const demoRooms = [
    { id: "1", name: "Library — Ground Floor", isLive: true, peopleCount: 7 },
    { id: "2", name: "Library — Top Floor", isLive: true, peopleCount: 3 },
    { id: "3", name: "CS Lab 204", isLive: false, peopleCount: 0 },
];

const demoUser = {
    name: "Arjun Singh",
    college: "Delhi Technological University",
    semester: "Year 3",
    stream: "Computer Science",
    avatar: null
};

export default function HomePage() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
            // In real app, upload via Cloudinary action here
        }
    };

    return (
        <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
            {/* Top Bar Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                        Good morning, {demoUser.name.split(" ")[0]}
                    </h1>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        Ready to join a room?
                    </p>
                </div>

                <div className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 p-2 pr-4 rounded-full shadow-sm">
                    <div className="flex items-center gap-2 pl-2">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{demoUser.name}</span>
                        <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{demoUser.college}</span>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-semibold bg-white dark:bg-zinc-950 dark:hover:bg-zinc-800">
                                Edit Profile
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md border-l border-zinc-200 dark:border-zinc-800 bg-[#fafafa] dark:bg-[#09090b]">
                            <SheetHeader className="mb-8">
                                <SheetTitle className="text-xl font-bold font-sans tracking-tight">Your Profile</SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-8">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center">
                                    <div
                                        onClick={handleImageClick}
                                        className="group relative flex h-[120px] w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
                                    >
                                        {avatarPreview ? (
                                            <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-zinc-500">
                                                <Camera className="h-6 w-6 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Pencil className="h-5 w-5 text-white" />
                                            <span className="mt-1 text-xs font-medium text-white">Upload</span>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {/* Read Only Fields */}
                                <div className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</span>
                                        <span className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{demoUser.name}</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800/50" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">College</span>
                                        <span className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{demoUser.college}</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-zinc-100 dark:bg-zinc-800/50" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Stream & Semester</span>
                                        <span className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{demoUser.stream} • {demoUser.semester}</span>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Current Rooms Section */}
            <div>
                <div className="mb-4 flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                        Live right now
                    </h2>
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {demoRooms.map((room) => (
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
        </div>
    );
}

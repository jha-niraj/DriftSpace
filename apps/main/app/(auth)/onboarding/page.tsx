"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@repo/ui/components/ui/sonner";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@repo/ui/components/ui/select";
import { completeOnboarding } from "@/actions/onboarding.action";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        college: "",
        semester: "",
        stream: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.college || !formData.semester || !formData.stream) {
            toast.error("Please fill all fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await completeOnboarding(formData);
            if (res.success) {
                router.push("/home");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#09090b]">
            <div className="absolute inset-x-0 top-0 p-6">
                <div
                    className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
                    style={{ fontFeatureSettings: '"ss01", "cv01"' }}
                >
                    Gather
                </div>
            </div>
            <main className="flex min-h-screen flex-col items-center justify-center p-6">
                <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50" style={{ fontFeatureSettings: '"ss01", "cv01"' }}>
                            Set up your profile
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            This takes 10 seconds.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider">Name</Label>
                            <Input
                                id="name"
                                placeholder="What should we call you?"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                                className="h-11 rounded-lg border-zinc-200 bg-transparent transition-colors focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:focus-visible:ring-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="college" className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider">College / University</Label>
                            <Input
                                id="college"
                                placeholder="e.g. Delhi University"
                                value={formData.college}
                                onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                                required
                                className="h-11 rounded-lg border-zinc-200 bg-transparent transition-colors focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:focus-visible:ring-zinc-700"
                            />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="semester" className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider">Semester / Year</Label>
                                <Select onValueChange={(val) => setFormData(prev => ({ ...prev, semester: val }))} required>
                                    <SelectTrigger className="h-11 rounded-lg border-zinc-200 bg-transparent dark:border-zinc-800">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                        {
                                            ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8"].map(yr => (
                                                <SelectItem key={yr} value={yr} className="focus:bg-zinc-100 dark:focus:bg-zinc-800">
                                                    {yr}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stream" className="text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider">Stream / Department</Label>
                                <Input
                                    id="stream"
                                    placeholder="e.g. Computer Science"
                                    value={formData.stream}
                                    onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                                    required
                                    className="h-11 rounded-lg border-zinc-200 bg-transparent transition-colors focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:focus-visible:ring-zinc-700"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="mt-4 h-11 w-full rounded-lg bg-zinc-900 font-medium text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 hover:shadow-md active:scale-[0.98]"
                        >
                            {loading ? "Saving..." : "Enter Gather →"}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
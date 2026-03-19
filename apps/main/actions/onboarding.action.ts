"use server"

import { getServerSession, authOptions } from "@repo/auth";
import prisma from "@repo/prisma";
import { revalidatePath } from "next/cache";

interface CompleteOnboardingInput {
    name: string;
    college: string;
    semester: string;
    stream: string;
}

interface CompleteOnboardingResult {
    success: boolean;
    message?: string;
    onboardingCompleted?: boolean;
}

function normalizeField(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

export async function completeOnboarding(data: CompleteOnboardingInput): Promise<CompleteOnboardingResult> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return {
            success: false,
            message: "You must be logged in to complete onboarding.",
        };
    }

    const payload = {
        name: normalizeField(data.name),
        college: normalizeField(data.college),
        semester: normalizeField(data.semester),
        stream: normalizeField(data.stream),
    };

    if (!payload.name || !payload.college || !payload.semester || !payload.stream) {
        return {
            success: false,
            message: "All onboarding fields are required.",
        };
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: payload,
        });

        revalidatePath("/home");
        revalidatePath("/onboarding");

        return {
            success: true,
            onboardingCompleted: true,
        };
    } catch (error) {
        console.error("completeOnboarding error:", error);
        return {
            success: false,
            message: "Unable to complete onboarding. Please try again.",
        };
    }
}
"use server"

export async function completeOnboarding(data: { name: string, college: string, semester: string, stream: string }) {
    // Stub implementation
    console.log("Onboarding data:", data);
    return { success: true };
}
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@repo/prisma";
import bcrypt from "bcryptjs";

function hasCompletedOnboarding(user: {
    name?: string | null;
    college?: string | null;
    semester?: string | null;
    stream?: string | null;
}): boolean {
    return Boolean(
        user.name?.trim() &&
        user.college?.trim() &&
        user.semester?.trim() &&
        user.stream?.trim()
    );
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_SECRET_ID || "",
            httpOptions: {
                timeout: 10000,
            },
        }),

        // Basic Credentials Provider - extend in your app
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Apps should override this with their own authentication logic
                // This is just a minimal example
                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string
                        }
                    });

                    if (!user) {
                        throw new Error("USER_NOT_FOUND");
                    }

                    if (!user.hashedPassword) {
                        throw new Error("OAUTH_ACCOUNT");
                    }

                    // For special case where password is "verified" (after OTP verification)
                    if (credentials.password === "verified") {
                        const freshUser = await prisma.user.findUnique({
                            where: {
                                email: credentials.email as string
                            }
                        });

                        if (freshUser && freshUser.emailVerified) {
                            return {
                                id: freshUser.id,
                                email: freshUser.email!,
                                name: freshUser.name || freshUser.email || "User",
                                image: freshUser.image || null,
                                role: freshUser.role,
                                emailVerified: freshUser.emailVerified ? new Date() : null,
                                onboardingCompleted: hasCompletedOnboarding(freshUser),
                            };
                        } else {
                            throw new Error("EMAIL_NOT_VERIFIED");
                        }
                    }

                    if (!user.emailVerified) {
                        throw new Error("EMAIL_NOT_VERIFIED");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password as string, user.hashedPassword);
                    console.log("Password Valid: " + isPasswordValid);

                    if (!isPasswordValid) {
                        throw new Error("INVALID_CREDENTIALS");
                    }

                    return {
                        id: user.id,
                        email: user.email!,
                        name: user.name || user.email || "User",
                        image: user.image || null,
                        role: user.role,
                        emailVerified: user.emailVerified ? new Date() : null,
                        onboardingCompleted: hasCompletedOnboarding(user),
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw error;
                }
            },
        }),
    ],

    callbacks: {
        // JWT callback - apps can extend to add custom claims
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.role = user.role;
                token.onboardingCompleted = Boolean(user.onboardingCompleted);
            }

            // Support session updates
            if (trigger === "update" && session?.user) {
                if (session.user.name !== undefined) {
                    token.name = session.user.name;
                }
                if (session.user.image !== undefined) {
                    token.image = session.user.image;
                }
                if (session.user.onboardingCompleted !== undefined) {
                    token.onboardingCompleted = Boolean(session.user.onboardingCompleted);
                }
            }

            return token;
        },

        // Session callback - apps can extend to add custom session data
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.image;
                session.user.role = token.role;
                session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
            }
            return session;
        },

        // Sign in callback - apps can add custom logic
        async signIn({ user, account, profile }) {
            // Allow all sign ins by default
            // Apps can add restrictions or custom logic here
            return true;
        },

        // Redirect callback - apps can customize redirect behavior
        async redirect({ url, baseUrl }) {
            // Handle relative URLs
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }

            // Allow same-origin redirects
            if (new URL(url).origin === baseUrl) {
                return url;
            }

            // Default redirect
            return baseUrl;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/error",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Helper function for server-side auth check
export async function auth() {
    const { getServerSession } = await import("next-auth/next");
    return await getServerSession(authOptions);
}

// Export getServerSession for direct use
export { getServerSession } from "next-auth/next";
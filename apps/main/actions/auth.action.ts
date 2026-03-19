"use server"

import { Resend } from "resend";
import prisma from "@repo/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

const OTP_EXPIRY_MINUTES = 10;

function generateOtp(length = 6): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

function hashOtp(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

export interface RegisterResult {
    success: boolean;
    message: string;
    requiresOtp?: boolean;
    canSignIn?: boolean;
    expiresInMinutes?: number;
    devOtp?: string;
}

export async function handleRegisterAction(email: string, password: string): Promise<RegisterResult> {
    try {
        if (!email || !email.includes("@") || !password) {
            return { success: false, message: "Please enter a valid email address." };
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: { 
                email: normalizedEmail 
            },
        });

        if (existingUser?.emailVerified) {
            if (!existingUser.hashedPassword) {
                return {
                    success: false,
                    message: "This account uses social login. Please use Google sign in."
                };
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.hashedPassword);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid email or password."
                };
            }

            return {
                success: true,
                message: "Welcome back!",
                canSignIn: true,
                requiresOtp: false,
            };
        }

        if (existingUser?.hashedPassword) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.hashedPassword);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid email or password."
                };
            }
        }

        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingUser) {
            await prisma.user.update({
                where: {
                    email: normalizedEmail,
                },
                data: {
                    hashedPassword,
                    emailVerified: null,
                    verifyOTP: hashedOtp,
                    verifyOTPExpiry: expiresAt,
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    hashedPassword,
                    emailVerified: null,
                    verifyOTP: hashedOtp,
                    verifyOTPExpiry: expiresAt,
                }
            });
        }

        // Send OTP email using Resend SDK
        try {
            await resend.emails.send({
                from: "Vani <noreply@coderzai.xyz>",
                to: normalizedEmail,
                subject: "Your login code for AfterClass",
                html: `<p>Your verification code is: <strong>${otp}</strong></p><br/><p>This code will expire in 10 minutes.</p>`
            });
        } catch (emailError) {
            console.error("Email sending failed, falling back to dev mode:", emailError);
            // In dev mode, log the OTP even if email fails
            if (process.env.NODE_ENV !== "production") {
                console.log(`[DEV OTP] ${normalizedEmail} -> ${otp}`);
            }
        }

        return {
            success: true,
            message: "OTP sent to your email.",
            requiresOtp: true,
            canSignIn: false,
            expiresInMinutes: OTP_EXPIRY_MINUTES,
            ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
        };
    } catch (error) {
        console.error("OTP send error:", error);
        return { 
            success: false, 
            message: "Unable to send OTP. Please try again." 
        };
    }
}

type OTPVerifyResult = RegisterResult;
export async function verifyOtp(email: string, otp: string): Promise<OTPVerifyResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if(!normalizedOtp || normalizedOtp.length === 0) {
        return {
            success: false,
            message: "Please provide the otp!!!"
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
            select: {
                id: true,
                verifyOTP: true,
                verifyOTPExpiry: true,
            },
        });

        if(!user || !user.verifyOTP || !user.verifyOTPExpiry) {
            return {
                success: false,
                message: "OTP doesn't match"
            }
        }

        if (user.verifyOTPExpiry.getTime() < Date.now()) {
            return {
                success: false,
                message: "OTP has expired. Please request a new code.",
            };
        }

        const isOtpValid = hashOtp(normalizedOtp) === user.verifyOTP;
        if (!isOtpValid) {
            return {
                success: false,
                message: "OTP doesn't match"
            };
        }

        await prisma.user.update({
            where: {
                email: normalizedEmail
            },
            data: {
                emailVerified: new Date(),
                verifyOTP: null,
                verifyOTPExpiry: null,
            }
        });

        return {
            success: true,
            message: "Email verified successfully.",
            canSignIn: true,
        };
    } catch(error) {
        console.error("OTP send error:", error);
        return { 
            success: false, 
            message: "Unable to send OTP. Please try again." 
        };
    }
}
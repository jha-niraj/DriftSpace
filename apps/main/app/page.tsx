"use client"

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@repo/ui/components/themetoggle";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/sonner";
import { Input } from "@repo/ui/components/ui/input";
import {
	InputOTP, InputOTPGroup, InputOTPSlot
} from "@repo/ui/components/ui/input-otp";
import { signIn } from "@repo/auth/client";
import { sendOtpAction } from "@/actions/auth.action";

export default function LandingPage() {
	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setLoading(true);
		try {
			await sendOtpAction(email);
			setStep(2);
		} catch {
			toast.error("Failed to send code. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!email.trim() || !otp.trim()) return toast.error("Enter your email and OTP.");

		setLoading(true);
		try {
			const result = await signIn("credentials", {
				email: email.trim(),
				otp: otp.trim(),
				redirect: false,
			});

			if (result?.ok) {
				toast.success("Welcome to Space.");
				router.replace("/onboarding");
				return;
			}
			toast.error("Invalid or expired OTP.");
		} catch (error) {
			toast.error("Unable to verify OTP.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen bg-[#fafafa] dark:bg-[#09090b] selection:bg-zinc-200 dark:selection:bg-zinc-800">
			<div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block" style={{
				backgroundImage: "radial-gradient(circle at center, rgba(30,27,75,0.15) 0%, rgba(9,9,11,1) 50%, rgba(9,9,11,1) 100%)"
			}} />

			<div className="absolute inset-x-0 top-0 flex flex-row items-center justify-between p-6">
				<div
					className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
					style={{ fontFeatureSettings: '"ss01", "cv01"' }}
				>
					Gather
				</div>
				<ThemeToggle />
			</div>
			<main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
				<div className="flex animate-in fade-in slide-in-from-bottom-4 duration-700 flex-col items-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-400">
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
							<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
						</span>
						Live now · 12 rooms active
					</div>
					<h1
						className="max-w-xl font-sans text-5xl font-extrabold tracking-tighter text-zinc-900 hover:tracking-tight transition-all duration-300 sm:text-6xl dark:text-white"
						style={{ fontFeatureSettings: '"ss01", "cv01"' }}
					>
						Your campus, <br className="hidden sm:block" />
						always open.
					</h1>
					<p className="mt-4 max-w-sm text-base text-zinc-600 dark:text-zinc-400">
						Join live study rooms, hang out, and find your people.
					</p>
					<div className="mt-10 w-full max-w-sm rounded-[1rem] border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
						{
							step === 1 ? (
								<form onSubmit={handleSendOTP} className="flex gap-2 animate-in fade-in">
									<Input
										type="email"
										placeholder="yourmail@gmail.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-zinc-400 font-medium"
									/>
									<Button
										type="submit"
										disabled={loading || !email}
										className="rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
									>
										{loading ? "Sending..." : "Continue"}
									</Button>
								</form>
							) : (
								<form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 p-2 animate-in fade-in slide-in-from-right-4">
									<div className="text-left">
										<p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
											Enter verification code
										</p>
										<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
											We sent a code to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{email}</span>.{" "}
											<button
												type="button"
												onClick={() => setStep(1)}
												className="cursor-pointer underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-200"
											>
												Change
											</button>
										</p>
									</div>
									<div className="flex justify-center py-2">
										<InputOTP
											maxLength={6}
											value={otp}
											onChange={(value) => setOtp(value)}
										>
											<InputOTPGroup className="gap-2">
												<InputOTPSlot index={0} className="rounded-md border-zinc-200 dark:border-zinc-800 !w-10 !h-12 text-lg font-mono dark:bg-zinc-950" />
												<InputOTPSlot index={1} className="rounded-md border-zinc-200 dark:border-zinc-800 !w-10 !h-12 text-lg font-mono dark:bg-zinc-950" />
												<InputOTPSlot index={2} className="rounded-md border-zinc-200 dark:border-zinc-800 !w-10 !h-12 text-lg font-mono dark:bg-zinc-950" />
												<InputOTPSlot index={3} className="rounded-md border-zinc-200 dark:border-zinc-800 !w-10 !h-12 text-lg font-mono dark:bg-zinc-950" />
												<InputOTPSlot index={4} className="rounded-md border-zinc-200 dark:border-zinc-800 !w-10 !h-12 text-lg font-mono dark:bg-zinc-950" />
												<InputOTPSlot index={5} className="rounded-md border-zinc-200 dark:border-zinc-800 !w-10 !h-12 text-lg font-mono dark:bg-zinc-950" />
											</InputOTPGroup>
										</InputOTP>
									</div>
									<Button
										type="submit"
										disabled={loading || otp.length !== 6}
										className="w-full rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
									>
										{loading ? "Verifying..." : "Verify"}
									</Button>
									<button
										type="button"
										onClick={handleSendOTP}
										className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
									>
										Resend code
									</button>
								</form>
							)
						}
					</div>
				</div>
			</main>
		</div>
	);
}
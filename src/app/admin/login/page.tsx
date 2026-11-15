"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { signInAdmin, type AuthActionState } from "@/actions/auth";

const initialAuthState: AuthActionState = {};

function mapQueryError(queryError: string | null): string {
    if (queryError === "unauthorized") {
        return "Access denied. Your account does not have active administrator permissions.";
    }
    if (queryError === "configuration") {
        return "Authentication service is not configured. Please contact the system administrator.";
    }
    return "";
}

function AdminLoginCard() {
    const searchParams = useSearchParams();
    const [state, formAction, isPending] = useActionState(
        signInAdmin,
        initialAuthState
    );

    const displayError =
        state.error || mapQueryError(searchParams.get("error"));

    return (
        <div className="max-w-md w-full bg-[#11131A]/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-[#D4AF37]/25 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/35 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)] mb-5">
                    <ShieldCheck className="h-8 w-8 text-[#E5C158]" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37] mb-2">
                    JCMCSIIT Executive CMS
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">
                    Administrator Sign In
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                    Authorized institutional staff and administrators only.
                </p>
            </div>

            {displayError && (
                <div
                    role="alert"
                    className="bg-red-950/50 text-red-200 p-4 rounded-xl mb-6 text-xs sm:text-sm font-medium border border-red-500/30"
                >
                    {displayError}
                </div>
            )}

            <form action={formAction} className="space-y-5">
                <div>
                    <label
                        htmlFor="admin-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2"
                    >
                        Official Email Address
                    </label>
                    <input
                        id="admin-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        defaultValue={state.email ?? ""}
                        disabled={isPending}
                        className="w-full h-12 px-4 rounded-xl bg-[#0B0D12] border border-white/10 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm font-medium text-zinc-100 placeholder:text-zinc-600 outline-none disabled:opacity-60"
                        placeholder="admin@jcmcsiit.ac.in"
                    />
                </div>
                <div>
                    <label
                        htmlFor="admin-password"
                        className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2"
                    >
                        Password
                    </label>
                    <input
                        id="admin-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        disabled={isPending}
                        className="w-full h-12 px-4 rounded-xl bg-[#0B0D12] border border-white/10 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm font-medium text-zinc-100 placeholder:text-zinc-600 outline-none disabled:opacity-60"
                        placeholder="••••••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 mt-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C59B27] text-[#090A0D] font-bold text-sm rounded-xl hover:brightness-105 transition-all shadow-[0_10px_25px_-8px_rgba(212,175,55,0.5)] disabled:opacity-60 cursor-pointer"
                >
                    {isPending ? "Verifying Credentials..." : "Sign In to CMS"}
                </button>
            </form>

            <div className="mt-7 pt-5 border-t border-white/[0.07] flex items-center justify-between text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#D4AF37]/80" />
                    SSR Cookie-Protected Session
                </span>
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-[#E5C158] transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Public Site
                </Link>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#090A0D] px-4 py-12 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <Suspense
                fallback={
                    <div className="max-w-md w-full bg-[#11131A] p-10 rounded-3xl border border-[#D4AF37]/20 relative z-10 h-[490px]" />
                }
            >
                <AdminLoginCard />
            </Suspense>
        </div>
    );
}

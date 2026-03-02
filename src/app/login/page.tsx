"use client";

import Link from 'next/link';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-pilot-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 hover:scale-105 transition-transform">
                <Compass className="w-8 h-8 text-pilot-500" />
                <span className="text-2xl font-bold tracking-tight">WayFinder</span>
            </Link>

            <div className="glass-panel w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground mt-2">Log in to resume your career journey.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Object</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-black/5 dark:bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pilot-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-black/5 dark:bg-white/5 border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pilot-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex justify-end">
                            <a href="#" className="text-xs text-pilot-600 hover:text-pilot-700 font-medium">Forgot password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-pilot-600 hover:bg-pilot-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-pilot-500/25"
                    >
                        Log In <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-pilot-600 hover:text-pilot-700 font-semibold transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

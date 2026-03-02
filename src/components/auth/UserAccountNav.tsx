"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Settings, Bell } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export function UserAccountNav({ user }: { user: User }) {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh(); // Crucial to update the Server Component layout states
    };

    const userInitials = user.user_metadata?.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || "WF";

    return (
        <div className="flex items-center gap-4">
            {/* Scholarship Alert Badge */}
            <button
                onClick={() => router.push('/dashboard')}
                className="relative p-2 text-muted-foreground hover:text-yellow-500 transition-colors"
                title="Scholarships Available"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </button>

            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-pilot-500 rounded-full transition-shadow">
                    <Avatar className="w-10 h-10 border-2 border-pilot-500/20 hover:border-pilot-500/50 transition-colors">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-pilot-500/10 text-pilot-600 dark:text-pilot-400 font-medium">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-panel border-white/10 mt-2">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "WayFinder Student"}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/5" onClick={() => router.push('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Roadmaps</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-600 focus:bg-red-500/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

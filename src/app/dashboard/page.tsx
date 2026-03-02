import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { DeadlineTracker } from '@/components/dashboard/DeadlineTracker';
import { DocumentVault } from '@/components/dashboard/DocumentVault';
import { ProfileSettings } from '@/components/dashboard/ProfileSettings';
import { ScholarshipMatch } from '@/components/dashboard/ScholarshipMatch';
import { CollegePredictor } from '@/components/dashboard/CollegePredictor';
import type { CareerRoadmap } from '@/types/roadmap';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const roadmapsRefs = profile?.saved_roadmaps || [];

    // Fetch actual roadmap structures from 'careers' table
    let populatedRoadmaps: any[] = [];
    if (roadmapsRefs.length > 0) {
        // Handle mapped data array (backward compatibility check)
        const slugs = roadmapsRefs.map((r: any) => typeof r === 'string' ? r : r.slug);
        const { data: careersData } = await supabase
            .from('careers')
            .select('slug, name, roadmap_data')
            .in('slug', slugs);

        if (careersData) {
            populatedRoadmaps = careersData.map(c => {
                const savedInfo = roadmapsRefs.find((r: any) => (typeof r === 'string' ? r : r.slug) === c.slug);
                const isObj = typeof savedInfo !== 'string';

                // Calculate Progress
                const roadmap: CareerRoadmap = c.roadmap_data;
                const totalActions = roadmap.nodes.reduce((acc, node) => acc + node.actionItems.length, 0);
                const completedCount = isObj && savedInfo.completed_actions ? savedInfo.completed_actions.length : 0;
                const progressPercentage = totalActions === 0 ? 0 : (completedCount / totalActions) * 100;

                return {
                    slug: c.slug,
                    name: c.name,
                    careerData: roadmap,
                    savedInfo: isObj ? savedInfo : { slug: c.slug, completed_actions: [] },
                    progress: progressPercentage,
                    totalActions,
                    completedCount
                };
            });
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pilot-400/10 dark:bg-pilot-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/5 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                <header className="mb-12">
                    <h1 className="text-4xl tracking-tight font-extrabold mb-4">
                        Welcome back, <span className="text-pilot-600 dark:text-pilot-400">{profile?.full_name?.split(' ')[0] || "Student"}</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Manage your target pathways and upload your verification documents securely.</p>
                </header>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full md:w-[600px] grid-cols-4 bg-black/5 dark:bg-white/5 p-1 rounded-xl mb-8 border border-border/50 shadow-inner">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-[10px] md:text-sm">Roadmap</TabsTrigger>
                        <TabsTrigger value="scholarships" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-[10px] md:text-sm">Scholarships</TabsTrigger>
                        <TabsTrigger value="vault" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-[10px] md:text-sm">Vault</TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-[10px] md:text-sm">Profile</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Deadlines Section */}
                        <DeadlineTracker roadmapsData={populatedRoadmaps} />

                        {/* College Predictor Section */}
                        <CollegePredictor profile={profile} />

                        {/* Tracks Grid */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-6 w-1 bg-pilot-500 rounded-full" />
                                <h2 className="text-2xl font-bold">Active Tracks</h2>
                            </div>

                            {populatedRoadmaps.length === 0 ? (
                                <div className="glass-panel text-center py-16 px-4">
                                    <MapPin className="w-12 h-12 text-pilot-300 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-bold mb-2">No roadmaps saved</h3>
                                    <p className="text-muted-foreground mb-6">Explore the diagnostic to find your path and save it here.</p>
                                    <Link href="/selection" className="inline-flex items-center gap-2 bg-pilot-600 hover:bg-pilot-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                                        Find a Path <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {populatedRoadmaps.map((r, i) => (
                                        <div key={i} className="glass-card p-6 flex items-center justify-between group hover:border-pilot-500/50 transition-all cursor-pointer" >
                                            <div className="flex-1">
                                                <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pilot-500/10 text-pilot-600 dark:text-pilot-400 border border-pilot-500/20 mb-3">
                                                    {r.careerData.targetState}
                                                </div>
                                                <h3 className="text-xl font-bold mb-1 group-hover:text-pilot-500 transition-colors">{r.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {r.completedCount} of {r.totalActions} specific actions resolved
                                                </p>
                                                <Link href={`/roadmap/${r.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-pilot-600 mt-4 group-hover:translate-x-1 transition-transform">
                                                    Continue Execution <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                            <div className="flex-shrink-0 ml-6 flex flex-col items-center">
                                                <ProgressRing percentage={r.progress} size={80} strokeWidth={8} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="scholarships" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <ScholarshipMatch userId={user.id} />
                    </TabsContent>

                    <TabsContent value="vault" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="max-w-2xl">
                            <DocumentVault />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="max-w-2xl">
                            <ProfileSettings initialProfile={profile} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

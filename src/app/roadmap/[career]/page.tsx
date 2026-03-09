import { supabase } from '@/lib/supabase';
import { CareerRoadmap } from '@/types/roadmap';
import SubwayRoadmap from '@/components/subway-roadmap';
import { BudgetMeter, DayInTheLife } from '@/components/dash-widgets';
import { MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import SaveRoadmapButton from '@/components/save-roadmap-button';
import { RoadmapActions } from '@/components/roadmap-actions';
import StudyMaterialsSidebar from '@/components/study-materials-sidebar';
import PrintOnlyRoadmap from '@/components/print-only-roadmap';

export default async function RoadmapPage({ params }: { params: Promise<{ career: string }> }) {
    const { career } = await params;

    const supabase = await createClient();

    const { data: routeData, error } = await supabase
        .from('careers')
        .select('roadmap_data')
        .eq('slug', career)
        .single();

    if (error || !routeData) {
        // Return 404 page if career slug does not exist in DB
        notFound();
    }

    const roadmap: CareerRoadmap = routeData.roadmap_data;

    const { data: { user } } = await supabase.auth.getUser();
    let isSavedInitial = false;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('saved_roadmaps')
            .eq('id', user.id)
            .single();

        const saved = profile?.saved_roadmaps || [];
        isSavedInitial = saved.some((r: any) => typeof r === 'string' ? r === career : r.slug === career);
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden print:overflow-visible print:min-h-0 print:bg-white print:block">
            {/* Background decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pilot-400/10 dark:bg-pilot-600/20 rounded-full blur-[120px] pointer-events-none print:hidden" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none print:hidden" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                {/* Header Dashboard */}
                <header className="mb-16 print:mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 print:mb-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pilot-50 text-pilot-700 dark:bg-pilot-900/30 dark:text-pilot-300 border border-pilot-200 dark:border-pilot-800 text-sm font-medium mb-3">
                                <MapPin className="w-4 h-4" />
                                <span>{roadmap.targetState}, India</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pilot-400 to-pilot-600 print:text-pilot-600 print:bg-none">{roadmap.targetCareer}</span> Roadmap
                            </h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl text-lg mb-6">
                                Personalized GPS from {roadmap.startingClass} to industry standard, accounting for {roadmap.targetState} state dynamics.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 print:hidden">
                                <SaveRoadmapButton careerSlug={career} isSavedInitial={isSavedInitial} isLoggedIn={!!user} />
                                <RoadmapActions />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DayInTheLife snippet={roadmap.dayInTheLifeSnippet} career={roadmap.targetCareer} />
                        <BudgetMeter estimatedCost={roadmap.estimatedEducationCost} futureSalary={roadmap.estimatedFutureSalary} />
                    </div>
                </header>

                {/* The Subway Map */}
                <section>
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-8 w-1 bg-pilot-500 rounded-full" />
                        <h2 className="text-2xl font-bold">Execution Timeline</h2>
                    </div>

                    <SubwayRoadmap roadmap={roadmap} careerSlug={career} />
                </section>
            </main>

            <StudyMaterialsSidebar roadmap={roadmap} />
        </div>
    );
}

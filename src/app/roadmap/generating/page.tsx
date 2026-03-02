"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeneratingRoadmap() {
    const router = useRouter();
    const [progressText, setProgressText] = useState("Analyzing your zone of genius...");

    useEffect(() => {
        const generate = async () => {
            try {
                const ikigaiData = localStorage.getItem('wayfinder_ikigai');
                const demoData = localStorage.getItem('wayfinder_demographics');

                if (!ikigaiData || !demoData) {
                    router.push('/');
                    return;
                }

                const ikigai = JSON.parse(ikigaiData);
                const demo = JSON.parse(demoData);

                const career = ikigai.paidFor;
                const state = demo.state;
                const currentClass = demo.currentClass;

                setTimeout(() => setProgressText(`Activating Universal Research Engine for ${career}...`), 1000);
                setTimeout(() => setProgressText(`Scraping 2026/27 real-time dates & quotas for ${state}...`), 3000);
                setTimeout(() => setProgressText("Structuring dynamic learning timeline..."), 6000);

                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ career, state, currentClass })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || "Failed to generate");
                }

                const data = await response.json();

                if (data.slug) {
                    router.push(`/roadmap/${data.slug}`);
                } else {
                    router.push('/');
                }

            } catch (error: any) {
                console.error("AI Generation Error:", error);
                alert("Generation Failed: " + error.message + "\n\n(If you hit the free-tier rate limit, wait 1 minute and try again.)");
                router.push('/selection');
            }
        };

        generate();
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pilot-500/20 dark:bg-pilot-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="glass-panel p-12 text-center max-w-md w-full relative z-10 flex flex-col items-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-pilot-500/20 rounded-full blur-xl animate-pulse" />
                    <Compass className="w-16 h-16 text-pilot-500 relative z-10 animate-spin-slow" style={{ animationDuration: '4s' }} />
                </div>

                <h1 className="text-2xl font-bold mb-4">WayFinder AI</h1>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={progressText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-muted-foreground font-medium h-8"
                    >
                        {progressText}
                    </motion.p>
                </AnimatePresence>

                <Loader2 className="w-6 h-6 text-pilot-500 animate-spin mt-6" />
            </div>
        </div>
    );
}

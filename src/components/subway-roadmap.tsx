"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, BookOpen, ExternalLink, PlayCircle } from 'lucide-react';
import type { CareerRoadmap, RoadmapNode } from '@/types/roadmap';
import { createClient } from '@/utils/supabase/client';

export default function SubwayRoadmap({ roadmap, careerSlug }: { roadmap: CareerRoadmap, careerSlug: string }) {
    const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
    const supabase = createClient();

    useEffect(() => {
        const fetchProgress = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase.from('profiles').select('saved_roadmaps').eq('id', user.id).single();
            const roadmaps = profile?.saved_roadmaps || [];

            const currentRoute = roadmaps.find((r: any) => typeof r !== 'string' && r.slug === careerSlug);
            if (currentRoute && currentRoute.completed_actions) {
                setCompletedActions(new Set(currentRoute.completed_actions));
            }
        };
        fetchProgress();
    }, [careerSlug, supabase]);

    const toggleAction = async (actionId: string) => {
        const newSet = new Set(completedActions);
        if (newSet.has(actionId)) {
            newSet.delete(actionId);
        } else {
            newSet.add(actionId);
        }
        setCompletedActions(newSet);

        // Sync to DB
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Ignore save for non-logged in

        const { data: profile } = await supabase.from('profiles').select('saved_roadmaps').eq('id', user.id).single();
        let roadmaps = profile?.saved_roadmaps || [];

        // Convert strings to objects if necessary
        roadmaps = roadmaps.map((r: any) => typeof r === 'string' ? { slug: r, completed_actions: [] } : r);

        const routeIndex = roadmaps.findIndex((r: any) => r.slug === careerSlug);
        if (routeIndex >= 0) {
            roadmaps[routeIndex].completed_actions = Array.from(newSet);
        } else {
            roadmaps.push({ slug: careerSlug, completed_actions: Array.from(newSet) });
        }

        await supabase.from('profiles').update({ saved_roadmaps: roadmaps }).eq('id', user.id);
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'youtube': return <PlayCircle className="w-4 h-4 text-red-500" />;
            case 'book': return <BookOpen className="w-4 h-4 text-blue-500" />;
            default: return <ExternalLink className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="relative max-w-4xl mx-auto py-12 px-6">
            {/* Central Subway Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1.5 bg-pilot-200 dark:bg-pilot-900 rounded-full" />

            <div className="space-y-12">
                {roadmap.nodes.map((node: RoadmapNode, index: number) => {
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative flex items-center justify-between md:justify-normal print:opacity-100 print:translate-y-0 print:block print:w-full print:mb-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Node Marker (The "Station") */}
                            <div className="absolute left-[-1.1rem] md:left-1/2 md:-ml-[1.1rem] w-10 h-10 rounded-full bg-white dark:bg-background border-4 border-pilot-500 flex items-center justify-center z-10 shadow-lg shadow-pilot-500/20">
                                <div className="w-3 h-3 bg-pilot-500 rounded-full" />
                            </div>

                            {/* Content Card */}
                            <div className={`w-full ml-12 md:ml-0 md:w-5/12 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                                <div className="glass-panel p-6 border-l-4 border-l-pilot-500 hover:scale-[1.02] transition-transform">

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-pilot-500 mb-1 block">
                                                {node.phase}
                                            </span>
                                            <h3 className="text-xl font-bold">{node.title}</h3>
                                            {node.examDate && (
                                                <p className="text-sm text-muted-foreground mt-1 bg-pilot-500/10 inline-block px-2 py-1 rounded-md">
                                                    🗓 {node.examDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions Checklists */}
                                    <div className="space-y-3 mb-6">
                                        <h4 className="text-sm font-semibold text-foreground/80">Action Items</h4>
                                        {node.actionItems.map(action => {
                                            const isChecked = completedActions.has(action.id) || action.isCompleted;
                                            return (
                                                <div key={action.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => toggleAction(action.id)}>
                                                    <button className="mt-0.5 flex-shrink-0 text-pilot-500 transition-colors">
                                                        {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5 text-muted-foreground group-hover:text-pilot-400" />}
                                                    </button>
                                                    <div>
                                                        <p className={`text-sm ${isChecked ? 'text-muted-foreground line-through' : ''}`}>
                                                            {action.description}
                                                        </p>
                                                        {(action.monthStart || action.monthEnd) && (
                                                            <span className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 rounded-sm mt-1 inline-block">
                                                                🕒 {action.monthStart} - {action.monthEnd || 'Present'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Resources */}
                                    {node.resources.length > 0 && (
                                        <div className="pt-4 border-t border-border/50">
                                            <h4 className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">Study Resources</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {node.resources.map((res, i) => (
                                                    <a
                                                        key={i}
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-black/40 border border-border px-2.5 py-1.5 rounded-full hover:border-pilot-500 transition-colors"
                                                    >
                                                        {getResourceIcon(res.type)}
                                                        <span className="truncate max-w-[150px]">{res.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div >
                    );
                })}
            </div >
        </div >
    );
}

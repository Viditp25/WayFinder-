"use client";

import { AlertCircle, Calendar } from 'lucide-react';
import type { CareerRoadmap } from '@/types/roadmap';

export function DeadlineTracker({ roadmapsData }: { roadmapsData: any[] }) {
    // Extract actions that have specific dates/months from all saved roadmaps
    const upcomingDeadlines = roadmapsData.flatMap(data => {
        const roadmap: CareerRoadmap = data.careerData;
        const savedInfo = data.savedInfo;
        const completed = new Set(savedInfo.completed_actions || []);

        return roadmap.nodes.flatMap(node =>
            node.actionItems
                .filter(action => action.monthStart && !completed.has(action.id) && !action.isCompleted)
                .map(action => ({
                    careerTitle: roadmap.targetCareer,
                    careerSlug: data.slug,
                    nodeTitle: node.title,
                    actionTitle: action.description,
                    monthStart: action.monthStart,
                    examDate: node.examDate
                }))
        );
    });

    if (upcomingDeadlines.length === 0) {
        return (
            <div className="glass-card p-6 border-l-4 border-emerald-500 flex items-start gap-4 bg-emerald-500/5">
                <Calendar className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-lg mb-1">Clear Skies</h3>
                    <p className="text-sm text-muted-foreground">You have no immediate exam deadlines or pending milestones tracked for this month.</p>
                </div>
            </div>
        );
    }

    // Display the first 3 urgent items
    const urgentItems = upcomingDeadlines.slice(0, 3);

    return (
        <div className="glass-card p-6 border-l-4 border-orange-500 bg-orange-500/5">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <h3 className="font-bold text-lg">Next Immediate Actions</h3>
            </div>

            <div className="space-y-4">
                {urgentItems.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-lg bg-background/50 border border-white/5">
                        <div className="mb-2 sm:mb-0">
                            <span className="text-xs font-bold text-pilot-500 mb-1 tracking-wider uppercase">{item.careerTitle} • {item.nodeTitle}</span>
                            <p className="text-sm font-medium">{item.actionTitle}</p>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                                🕒 {item.monthStart}
                            </span>
                            {item.examDate && (
                                <span className="text-[10px] text-muted-foreground mt-1">
                                    Target Date: {item.examDate}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

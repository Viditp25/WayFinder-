"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { AuthModal } from './auth/AuthModal';

export default function SaveRoadmapButton({ careerSlug, isSavedInitial, isLoggedIn }: { careerSlug: string, isSavedInitial: boolean, isLoggedIn: boolean }) {
    const [isSaved, setIsSaved] = useState(isSavedInitial);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    if (!isLoggedIn) {
        return (
            <div className="flex items-center gap-3">
                <AuthModal customTrigger={
                    <Button className="gap-2 transition-all shadow-md bg-pilot-600 hover:bg-pilot-700 text-white shadow-pilot-500/20">
                        <Bookmark className="w-4 h-4" />
                        ⭐ Save Roadmap
                    </Button>
                } />
            </div>
        );
    }

    const handleSave = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('saved_roadmaps')
                .eq('id', user.id)
                .single();

            const currentRoadmaps = profile?.saved_roadmaps || [];
            let updatedRoadmaps;

            if (isSaved) {
                updatedRoadmaps = currentRoadmaps.filter((r: any) => typeof r === 'string' ? r !== careerSlug : r.slug !== careerSlug);
            } else {
                updatedRoadmaps = [...currentRoadmaps, { slug: careerSlug, completed_actions: [] }];
            }

            await supabase
                .from('profiles')
                .update({ saved_roadmaps: updatedRoadmaps })
                .eq('id', user.id);

            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Error saving roadmap:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSave}
            disabled={loading}
            className={`gap-2 transition-all shadow-md ${isSaved
                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30'
                : 'bg-pilot-600 hover:bg-pilot-700 text-white shadow-pilot-500/20'}`}
        >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? 'Saved to Profile' : '⭐ Save Roadmap'}
        </Button>
    );
}

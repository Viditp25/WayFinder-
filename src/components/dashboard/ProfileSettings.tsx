"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Settings, Save } from 'lucide-react';

export function ProfileSettings({ initialProfile }: { initialProfile: any }) {
    const [saving, setSaving] = useState(false);
    const [category, setCategory] = useState(initialProfile?.category || 'General');
    const [examName, setExamName] = useState(initialProfile?.latest_score?.exam || 'JEE Main');
    const [score, setScore] = useState(initialProfile?.latest_score?.score || '');
    const supabase = createClient();

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const latest_score = {
                exam: examName,
                score: score,
                updated_at: new Date().toISOString()
            };

            await supabase
                .from('profiles')
                .update({ category, latest_score })
                .eq('id', user.id);

            alert("Profile settings updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 bg-pilot-500/10 border border-pilot-500/20 p-4 rounded-xl">
                <Settings className="w-8 h-8 text-pilot-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-lg text-pilot-600 dark:text-pilot-400">Profile Configuration</h3>
                    <p className="text-sm text-foreground/80">
                        Customize your demographics and recent scores to activate the Scholarship Matcher and College Predictor.
                    </p>
                </div>
            </div>

            <div className="glass-card p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Reservation Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-background border border-border p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pilot-500"
                    >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">Used exclusively to match government state and central scholarship eligibility.</p>
                </div>

                <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold mb-4">Latest Mock/Exam Performance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Target Exam</label>
                            <select
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                className="w-full bg-background border border-border p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pilot-500"
                            >
                                <option value="JEE Main">JEE Main</option>
                                <option value="NEET">NEET</option>
                                <option value="MHT-CET">MHT-CET</option>
                                <option value="CLAT">CLAT</option>
                                <option value="CA Foundation">CA Foundation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Score / Percentile</label>
                            <input
                                type="text"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                placeholder="e.g. 95 PR or 650/720"
                                className="w-full bg-background border border-border p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pilot-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-pilot-600 hover:bg-pilot-700 w-full sm:w-auto">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {saving ? 'Saving...' : 'Save Profile Settings'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

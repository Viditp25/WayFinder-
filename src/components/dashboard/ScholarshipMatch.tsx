import { createClient } from '@/utils/supabase/server';
import { Award, ExternalLink, IndianRupee } from 'lucide-react';

export async function ScholarshipMatch({ userId }: { userId: string }) {
    const supabase = await createClient();

    // 1. Get user profile for location and category
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    const userState = profile?.home_state || 'Maharashtra';
    const userCategory = profile?.category || 'General';

    // 2. Fetch scholarships matching user state and category
    const { data: scholarships } = await supabase
        .from('scholarships')
        .select('*')
        .or(`target_state.ilike.%${userState}%,target_state.ilike.All India`)
        .or(`target_category.ilike.%${userCategory}%,target_category.ilike.All,target_category.ilike.General/OBC`);

    if (!scholarships || scholarships.length === 0) {
        return (
            <div className="glass-panel p-8 text-center text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No customized scholarships found for {userState} and {userCategory} category currently.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">Recommended Scholarships</h3>
                    <p className="text-sm text-foreground/80">
                        Based on your profile set to {userState} ({userCategory}), you are eligible for the following financial grants.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scholarships.map((scholarship) => (
                    <div key={scholarship.id} className="glass-card p-6 flex flex-col justify-between hover:border-yellow-500/50 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg leading-tight">{scholarship.name}</h4>
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-4">{scholarship.provider}</span>

                            <p className="text-sm mb-4 line-clamp-2">{scholarship.description}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">Eligibility:</span>
                                    <span className="line-clamp-1">{scholarship.eligibility_criteria}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    <IndianRupee className="w-4 h-4" />
                                    <span>{scholarship.amount}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                                    <span>Deadline:</span>
                                    <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <a
                            href={scholarship.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 py-2 rounded-lg font-medium transition-colors"
                        >
                            Apply Now <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

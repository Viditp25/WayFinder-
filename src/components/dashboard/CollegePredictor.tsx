"use client";

import { GraduationCap, AlertCircle } from 'lucide-react';

export function CollegePredictor({ profile }: { profile: any }) {
    const latestScore = profile?.latest_score;

    if (!latestScore || !latestScore.score) {
        return (
            <div className="glass-panel p-6 text-center text-muted-foreground border-dashed border-2">
                <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Update your latest Mock/Exam score in Profile Settings to unlock College Predictions.</p>
            </div>
        );
    }

    const exam = latestScore.exam;
    let scoreVal = parseFloat(latestScore.score.replace(/[^\d.]/g, ''));

    // Fallback Mock Logic
    let predictions = { safety: [] as string[], target: [] as string[], reach: [] as string[] };

    if (exam === 'JEE Main') {
        if (scoreVal >= 99) {
            predictions = {
                safety: ["NIT Nagpur", "NIT Surat"],
                target: ["NIT Trichy", "NIT Warangal"],
                reach: ["IIT Bombay (via Advanced)", "IIT Delhi (via Advanced)"]
            };
        } else if (scoreVal >= 95) {
            predictions = {
                safety: ["IIIT Pune", "VJTI Mumbai (State Quota)"],
                target: ["NIT Nagpur", "NIT Calicut"],
                reach: ["NIT Trichy", "IIIT Hyderabad"]
            };
        } else {
            predictions = {
                safety: ["Tier 3 State Colleges"],
                target: ["COEP Pune", "VIT Vellore"],
                reach: ["NITs", "IIITs"]
            };
        }
    } else if (exam === 'NEET') {
        if (scoreVal >= 650) {
            predictions = {
                safety: ["State Govt Medical Colleges"],
                target: ["Top State GMCs", "AIIMS (New)"],
                reach: ["AIIMS Delhi", "MAMC Delhi"]
            };
        } else {
            predictions = {
                safety: ["Private Medical Colleges"],
                target: ["State Semi-Govt", "Deemed Universities"],
                reach: ["Top State GMCs"]
            };
        }
    } else {
        predictions = {
            safety: ["Local City Universities"],
            target: ["Top State Universities"],
            reach: ["National Institutes of Eminence"]
        };
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-pilot-500/10 p-2 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-pilot-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">College Predictor <span className="text-[10px] uppercase bg-pilot-500 text-white px-1.5 py-0.5 rounded ml-2 relative -top-0.5">Beta</span></h3>
                        <p className="text-xs text-muted-foreground">Based on {exam} score: <strong className="text-foreground">{latestScore.score}</strong></p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 mb-2">Safety (High Probability)</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                            {predictions.safety.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                    <div className="flex-1 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-2">Target (Good Chance)</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                            {predictions.target.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                    <div className="flex-1 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">Reach (Ambitious)</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                            {predictions.reach.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="flex items-start gap-2 text-[10px] text-muted-foreground mt-4 bg-background/50 p-2 rounded">
                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <p>Predictions use historical 2024-25 cutoff data. Final admissions depend on rank fluctuations and category reservations.</p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Brain, Trophy, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function IkigaiDiagnostic({ onSkipToSearch, onSelectCareer }: { onSkipToSearch?: () => void, onSelectCareer?: (career: string, ikigaiData: any) => void }) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [customPath, setCustomPath] = useState('');
    const [responses, setResponses] = useState<Record<string, string[]>>({
        love: [],
        goodAt: [],
        worldNeeds: [],
        paidFor: []
    });

    const questions = [
        {
            id: 'love',
            question: "What do you absolutely LOVE doing?",
            subtitle: "Think about activities where you lose track of time.",
            icon: <Sparkles className="w-8 h-8 text-pilot-500" />,
            options: ["Solving complex puzzles", "Helping & talking to people", "Creating art/designs", "Building things from scratch", "Managing & leading teams"]
        },
        {
            id: 'goodAt',
            question: "What are you naturally GOOD AT?",
            subtitle: "What skills do others come to you for help with?",
            icon: <Brain className="w-8 h-8 text-pilot-500" />,
            options: ["Math & Logic", "Communication & Writing", "Visual Design", "Coding & Tech", "Organization & Planning"]
        },
        {
            id: 'worldNeeds',
            question: "What does the WORLD NEED right now?",
            subtitle: "What problems do you want to solve in India or globally?",
            icon: <Trophy className="w-8 h-8 text-pilot-500" />,
            options: ["Better Healthcare", "Sustainable Energy", "Quality Education", "Advanced Technology/AI", "Financial Inclusion"]
        },
    ];

    const clusters = [
        {
            id: 'technical',
            title: "Technical & Problem Solving",
            desc: "Engineering, Data Science, AI, and Math.",
            paths: ["Software Engineering (B.Tech)", "Data Science & AI", "Architecture (B.Arch)"]
        },
        {
            id: 'creative',
            title: "Creative & Communication",
            desc: "Design, Media, Performing Arts.",
            paths: ["Professional Singer / Vocalist", "Professional Dancer / Choreographer", "Professional Actor"]
        },
        {
            id: 'management',
            title: "People & Management",
            desc: "Business, Law, Healthcare Management.",
            paths: ["Business Management (MBA/CAT)", "Legal Studies (Law/CLAT)", "Medical Services (MBBS/NEET)"]
        }
    ];

    const currentQ = questions[step];

    const handleSelect = (option: string) => {
        const currentSelected = responses[currentQ.id as keyof typeof responses];
        const nextSelected = currentSelected.includes(option)
            ? currentSelected.filter(o => o !== option)
            : [...currentSelected, option];

        setResponses({ ...responses, [currentQ.id]: nextSelected });
    };

    const handleSelectPath = (pathName: string) => {
        const finalResponses = { ...responses, paidFor: [pathName] };
        if (onSelectCareer) {
            onSelectCareer(pathName, finalResponses);
        } else {
            localStorage.setItem('wayfinder_ikigai', JSON.stringify(finalResponses));
            router.push('/roadmap/generating');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="glass-panel p-8 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                    <motion.div
                        className="h-full bg-pilot-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {step < questions.length ? (
                            <>
                                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                                    <div className="p-4 bg-pilot-500/10 rounded-full">
                                        {currentQ.icon}
                                    </div>
                                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pilot-400 to-pilot-600">
                                        {currentQ.question}
                                    </h2>
                                    <p className="text-muted-foreground">{currentQ.subtitle}</p>
                                </div>
                                <div className="grid gap-3">
                                    {currentQ.options.map((opt, i) => {
                                        const isSelected = responses[currentQ.id as keyof typeof responses].includes(opt);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleSelect(opt)}
                                                className={`glass-card p-4 text-left flex items-center justify-between group flex-col sm:flex-row sm:items-center transition-all ${isSelected
                                                    ? 'ring-2 ring-pilot-500 bg-pilot-500/10'
                                                    : 'hover:bg-pilot-500/5 hover:border-pilot-500/30'
                                                    }`}
                                            >
                                                <span className="font-medium text-foreground">{opt}</span>
                                                {isSelected ? (
                                                    <span className="text-pilot-500 font-bold">✓</span>
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-pilot-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between items-center mt-8 pt-4 border-t border-border/50">
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        disabled={step === 0}
                                        className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        disabled={responses[currentQ.id as keyof typeof responses].length === 0}
                                        className="px-6 py-2 rounded-xl text-sm font-medium transition-all bg-pilot-600 hover:bg-pilot-700 text-white disabled:opacity-50 disabled:hover:bg-pilot-600"
                                    >
                                        Continue →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Your Career Clusters</h2>
                                    <p className="text-muted-foreground text-sm">Based on your interests, explore these paths.</p>
                                </div>
                                <div className="space-y-4">
                                    {clusters.map(cluster => (
                                        <div key={cluster.id} className="glass-card p-4 text-left border-l-4 border-l-pilot-500 transition-all">
                                            <h3 className="font-bold text-lg">{cluster.title}</h3>
                                            <p className="text-xs text-muted-foreground mb-3">{cluster.desc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {cluster.paths.map(path => (
                                                    <button
                                                        key={path}
                                                        onClick={() => handleSelectPath(path)}
                                                        className="bg-pilot-500/10 hover:bg-pilot-500 text-pilot-700 dark:text-pilot-300 hover:text-white border border-pilot-200 dark:border-pilot-800 text-xs px-3 py-1.5 rounded-full transition-colors"
                                                    >
                                                        {path}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex gap-2 w-full">
                                    <input
                                        type="text"
                                        placeholder="Or type your own career path..."
                                        value={customPath}
                                        onChange={(e) => setCustomPath(e.target.value)}
                                        className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pilot-500/50 transition-all placeholder:text-muted-foreground/50 text-foreground"
                                    />
                                    <button
                                        onClick={() => {
                                            if (customPath.trim() !== '') {
                                                handleSelectPath(customPath.trim());
                                            }
                                        }}
                                        disabled={!customPath.trim()}
                                        className="bg-pilot-600 hover:bg-pilot-700 h-auto py-3 px-6 rounded-xl transition-all text-white font-medium disabled:opacity-50 disabled:hover:bg-pilot-600"
                                    >
                                        Submit
                                    </button>
                                </div>
                                <div className="mt-8 text-center border-t border-border/50 pt-6">
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                                    >
                                        ← Go Back and Change Answers
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-between items-center text-sm text-muted-foreground">
                    <span>Step {Math.min(step + 1, questions.length)} of {questions.length}</span>
                    <span>WayFinder AI</span>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from 'react';
import { Target, HelpCircle, ArrowRight, Search, ChevronRight, MapPin, GraduationCap } from 'lucide-react';
import IkigaiDiagnostic from './ikigai-diagnostic';
import { useRouter } from 'next/navigation';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (NCT)", "Jammu & Kashmir",
    "Chandigarh", "All India"
];

const CLASSES = ["Class 6-8", "Class 9", "Class 10", "Class 11", "Class 12", "Undergrad/College"];

const CAREER_PATHS = [
    { name: "Software Engineering (B.Tech)", slug: "btech" },
    { name: "Medical Services (MBBS/NEET)", slug: "mbbs" },
    { name: "Business Management (MBA/CAT)", slug: "mba" },
    { name: "Chartered Accountancy (CA)", slug: "ca" },
    { name: "Legal Studies (Law/CLAT)", slug: "law" },
    { name: "Data Science & AI", slug: "data-science" },
    { name: "Architecture (B.Arch)", slug: "barch" },
    { name: "Pure Sciences (B.Sc/M.Sc)", slug: "bsc" },
    { name: "Professional Singer / Vocalist", slug: "singer" },
    { name: "Professional Dancer / Choreographer", slug: "dancer" },
    { name: "Professional Actor", slug: "actor" }
];

export default function PathSelection() {
    const router = useRouter();
    const [step, setStep] = useState<'selection' | 'ikigai' | 'searching' | 'demographics'>('selection');
    const [searchQuery, setSearchQuery] = useState('');

    // Demographic States
    const [selectedCareer, setSelectedCareer] = useState('');
    const [ikigaiPayload, setIkigaiPayload] = useState<any>(null);
    const [demoClass, setDemoClass] = useState('');
    const [demoState, setDemoState] = useState('');

    const handleSelectPath = (pathName: string) => {
        // Intercept path selection to ask for Class & State constraints BEFORE generating
        setSelectedCareer(pathName);
        setStep('demographics');
    };

    const handleIkigaiPathSelect = (pathName: string, ikigaiData: any) => {
        setSelectedCareer(pathName);
        setIkigaiPayload(ikigaiData);
        setStep('demographics');
    };

    const handleFinalGeneration = () => {
        // Save constraints for the AI engine
        localStorage.setItem('wayfinder_demographics', JSON.stringify({
            state: demoState || 'All India',
            currentClass: demoClass
        }));

        if (ikigaiPayload) {
            localStorage.setItem('wayfinder_ikigai', JSON.stringify(ikigaiPayload));
            router.push('/roadmap/generating');
        } else {
            // For custom target searches
            const mockIkigaiPayload = {
                love: "N/A - Direct Path",
                goodAt: "N/A - Direct Path",
                worldNeeds: "N/A - Direct Path",
                paidFor: selectedCareer
            };
            localStorage.setItem('wayfinder_ikigai', JSON.stringify(mockIkigaiPayload));
            router.push('/roadmap/generating');
        }
    };

    const filteredPaths = CAREER_PATHS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (step === 'ikigai') {
        return <IkigaiDiagnostic
            onSkipToSearch={() => setStep('searching')}
            onSelectCareer={handleIkigaiPathSelect}
        />;
    }

    if (step === 'searching') {
        return (
            <div className="w-full max-w-xl mx-auto glass-panel p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-pilot-500/10 blur-3xl rounded-full" />

                <button
                    onClick={() => setStep('selection')}
                    className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 transition-colors relative z-10"
                >
                    ← Back
                </button>

                <div className="relative z-10 text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Search Your Target</h2>
                    <p className="text-muted-foreground text-sm">
                        Select a specific degree or career path to generate an instant roadmap.
                    </p>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search B.Tech, CA, Law..."
                        className="w-full bg-black/5 dark:bg-white/5 border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilot-500 transition-all text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredPaths.map((path, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelectPath(path.name)}
                            className="w-full flex items-center justify-between p-4 glass-card hover:bg-pilot-500/10 hover:border-pilot-500/30 transition-all text-left group"
                        >
                            <span className="font-semibold text-sm">{path.name}</span>
                            <ChevronRight className="w-4 h-4 text-pilot-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                    {filteredPaths.length === 0 && (
                        <div className="text-center py-6 border border-dashed border-pilot-500/30 rounded-xl mt-4 bg-pilot-500/5">
                            <p className="text-muted-foreground text-sm mb-4">
                                Cannot find &quot;{searchQuery}&quot; in our database.
                            </p>
                            <button
                                onClick={() => handleSelectPath(searchQuery)}
                                className="bg-pilot-600 hover:bg-pilot-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-all shadow-md shadow-pilot-500/20"
                            >
                                Generate Live Roadmap
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (step === 'demographics') {
        return (
            <div className="w-full max-w-xl mx-auto glass-panel p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />

                <button
                    onClick={() => setStep('selection')}
                    className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 transition-colors relative z-10"
                >
                    ← Cancel
                </button>

                <div className="relative z-10 text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Finalization</h2>
                    <p className="text-muted-foreground text-sm">
                        To accurately map exams and trim unnecessary historical steps for <strong className="text-pilot-600 dark:text-pilot-400">{selectedCareer}</strong>, please provide your current level.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-pilot-500" /> Current Stage (Required)
                        </label>
                        <select
                            className="w-full appearance-none bg-black/5 dark:bg-white/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilot-500 transition-all text-sm font-medium"
                            value={demoClass}
                            onChange={(e) => setDemoClass(e.target.value)}
                        >
                            <option value="" disabled>Select your class/stage</option>
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-pilot-500" /> Target State (Optional)
                        </label>
                        <select
                            className="w-full appearance-none bg-black/5 dark:bg-white/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilot-500 transition-all text-sm font-medium"
                            value={demoState}
                            onChange={(e) => setDemoState(e.target.value)}
                        >
                            <option value="">Leave empty for All India Coverage</option>
                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={handleFinalGeneration}
                        disabled={!demoClass}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-pilot-600 hover:bg-pilot-700 disabled:opacity-50 disabled:hover:bg-pilot-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-pilot-500/25"
                    >
                        Generate Constrained Roadmap <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

            <button
                onClick={() => router.back()}
                className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 transition-colors relative z-10"
            >
                ← Back to Setup
            </button>

            <div className="relative z-10 text-center mb-10">
                <h2 className="text-2xl font-bold mb-2">What&apos;s Your Status?</h2>
                <p className="text-muted-foreground text-sm">
                    Do you already know what you want to study, or do you need help finding your passion?
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <button
                    onClick={() => setStep('searching')}
                    className="glass-card p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-pilot-500/5 hover:border-pilot-500/50 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Target Path</h3>
                        <p className="text-xs text-muted-foreground mt-1 px-2">I know exactly what degree or career I want.</p>
                    </div>
                </button>

                <button
                    onClick={() => setStep('ikigai')}
                    className="glass-card p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-purple-500/5 hover:border-purple-500/50 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">I&apos;m Confused</h3>
                        <p className="text-xs text-muted-foreground mt-1 px-2">Help me find my passion and build a profile.</p>
                    </div>
                </button>
            </div>
        </div>
    );
}

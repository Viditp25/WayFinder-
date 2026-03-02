"use client";

import { useState } from 'react';
import { MapPin, GraduationCap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (NCT)", "Jammu & Kashmir",
    "Chandigarh"
];

const CLASSES = ["Class 6-8", "Class 9", "Class 10", "Class 11", "Class 12", "Undergrad/College"];

export default function SetupForm() {
    const router = useRouter();
    const [data, setData] = useState({ state: '', currentClass: '' });

    const handleStart = () => {
        if (data.state && data.currentClass) {
            localStorage.setItem('wayfinder_demographics', JSON.stringify(data));
            router.push('/selection');
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto glass-panel p-8 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pilot-500/10 blur-3xl rounded-full" />

            <div className="relative z-10 mb-8">
                <h2 className="text-2xl font-bold mb-2">Configure Your GPS</h2>
                <p className="text-muted-foreground text-sm">
                    We'll ask for your current class and state right before generation so we can map exact timelines and state-level exams.
                </p>
            </div>

            <button
                onClick={() => router.push('/selection')}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-pilot-600 hover:bg-pilot-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-pilot-500/25"
            >
                Begin Journey <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

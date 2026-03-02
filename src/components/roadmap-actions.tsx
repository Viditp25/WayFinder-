"use client";

import Link from 'next/link';

export function RoadmapActions() {
    return (
        <>
            <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm font-medium transition-all border border-border/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                Download PDF
            </button>

            <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm font-medium transition-all border border-border/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                Home
            </Link>
        </>
    );
}

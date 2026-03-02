import { NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { career, state, currentClass } = body;

        if (!career || !state || !currentClass) {
            return NextResponse.json(
                { error: "Missing required fields: career, state, or currentClass" },
                { status: 400 }
            );
        }

        const roadmap = await generateRoadmap(career, state, currentClass);

        if (!roadmap) {
            return NextResponse.json(
                { error: "Failed to generate roadmap from AI" },
                { status: 500 }
            );
        }

        const customSlug = `custom-${crypto.randomUUID()}`;

        const { error: dbError } = await supabase
            .from('careers')
            .insert({
                slug: customSlug,
                name: `Custom AI Roadmap: ${career}`,
                stream: 'Custom',
                roadmap_data: roadmap
            });

        if (dbError) {
            console.error("Supabase Insertion Error:", dbError);
            return NextResponse.json(
                { error: "Failed to persist roadmap" },
                { status: 500 }
            );
        }

        return NextResponse.json({ roadmap, slug: customSlug });
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

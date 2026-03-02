"use client";

import { CareerRoadmap, Resource } from "@/types/roadmap";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { BookOpen, ExternalLink, PlayCircle, LibraryBig, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StudyMaterialsSidebar({ roadmap }: { roadmap: CareerRoadmap }) {
    // Extract node-specific resources safely
    const nodeResources = roadmap.nodes.flatMap(node =>
        node.resources.map(res => ({
            ...res,
            sourceNode: node.title
        }))
    );

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'youtube': return <PlayCircle className="w-5 h-5 text-red-500" />;
            case 'book': return <BookOpen className="w-5 h-5 text-blue-500" />;
            case 'official_site': return <LibraryBig className="w-5 h-5 text-emerald-500" />;
            default: return <FileText className="w-5 h-5 text-pilot-500" />;
        }
    };

    const ResourceCard = ({ res }: { res: Resource & { sourceNode?: string } }) => (
        <a
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 glass-card hover:bg-pilot-500/5 hover:border-pilot-500/30 transition-all group"
        >
            <div className="mt-1 flex-shrink-0">
                {getResourceIcon(res.type)}
            </div>
            <div>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-pilot-600 dark:group-hover:text-pilot-400 transition-colors">
                    {res.title}
                </h4>
                {res.sourceNode && (
                    <span className="text-xs text-muted-foreground mt-1 block">
                        Module: {res.sourceNode}
                    </span>
                )}
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
    );

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-pilot-600 text-white shadow-[-4px_0_24px_rgba(37,99,235,0.25)] hover:bg-pilot-700 hover:pr-6 pr-4 pl-3 py-6 rounded-l-2xl rounded-r-none transition-all duration-300 flex flex-col items-center gap-3 group print:hidden">
                    <LibraryBig className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="[writing-mode:vertical-lr] rotate-180 font-bold tracking-widest uppercase text-sm">
                        Study Materials
                    </span>
                </button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md border-l border-border/50 bg-background/95 backdrop-blur-xl p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border/50 bg-pilot-500/5 text-left">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <LibraryBig className="w-6 h-6 text-pilot-600 dark:text-pilot-400" />
                        Resource Center
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                        Curated notes, videos, and official documents for {roadmap.targetCareer}.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8 pb-12">
                        {/* Global Resources */}
                        {roadmap.globalResources && roadmap.globalResources.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                                    <h3 className="font-bold text-lg">Top Global Resources</h3>
                                </div>
                                <div className="space-y-3">
                                    {roadmap.globalResources.map((res, i) => (
                                        <ResourceCard key={`global-${i}`} res={res} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Phase-Specific Resources */}
                        {nodeResources.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-pilot-500 rounded-full" />
                                    <h3 className="font-bold text-lg">Timeline Materials</h3>
                                </div>
                                <div className="space-y-3">
                                    {nodeResources.map((res, i) => (
                                        <ResourceCard key={`node-${i}`} res={res} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {(!roadmap.globalResources?.length && !nodeResources.length) && (
                            <div className="text-center p-8 border border-dashed rounded-xl">
                                <p className="text-muted-foreground text-sm">No specific resources generated for this roadmap.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

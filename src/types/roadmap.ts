export interface ActionItem {
    id: string;
    title: string;
    description: string;
    monthStart?: string; // Estimated month e.g. "January 2026"
    monthEnd?: string;
    isCompleted: boolean;
}

export interface Resource {
    title: string;
    url: string;
    type: 'youtube' | 'book' | 'course' | 'official_site';
}

export interface RoadmapNode {
    id: string;
    title: string; // e.g., "JEE Main Session 1", "MHT-CET Session 1"
    phase: 'preparation' | 'application' | 'examination' | 'counseling';
    examDate?: string; // The exact or approximate date derived from our research
    actionItems: ActionItem[];
    resources: Resource[];
    dependsOn?: string[]; // IDs of prerequisite nodes
}

export interface CareerRoadmap {
    userId: string;
    targetCareer: string; // e.g., "Software Engineer"
    targetState: string; // e.g., "Maharashtra"
    startingClass: string; // e.g., "11th"
    dayInTheLifeSnippet: string; // 50-word AI simulation
    estimatedEducationCost: number;
    estimatedFutureSalary: number;
    globalResources: Resource[];
    nodes: RoadmapNode[];
}

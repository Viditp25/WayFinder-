import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

// NOTE: In a real production app, seeding should be done with the SERVICE_ROLE key to bypass RLS.
// For this demo context, assuming the anon key has insert permissions (or RLS disabled for testing).
const supabase = createClient(supabaseUrl, supabaseKey);

const defaultNodes = [
    {
        id: "1",
        title: "Foundation & Skill Building",
        phase: "preparation",
        actionItems: [
            { id: "a1", title: "Core Fundamentals", description: "Master the foundational concepts and basic techniques.", isCompleted: false },
            { id: "a2", title: "Practical Application", description: "Start applying theories through minor projects or daily practice.", isCompleted: false }
        ],
        resources: [
            { title: "Introductory Masterclass", url: "https://youtube.com", type: "youtube" },
            { title: "Standard Reference Material", url: "https://wikipedia.org", type: "book" },
            { title: "Official Community Forums", url: "https://reddit.com", type: "official_site" }
        ]
    }
];

const seedData = [
    {
        slug: 'btech',
        name: 'Software Engineering (B.Tech)',
        stream: 'Science',
        roadmap_data: {
            targetCareer: 'Software Engineering (B.Tech)',
            targetState: 'Generic',
            startingClass: 'Class 12',
            dayInTheLifeSnippet: "Building scalable systems, debugging critical software faults, and collaborating via daily standups.",
            estimatedEducationCost: 1200000,
            estimatedFutureSalary: 800000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'mbbs',
        name: 'Medical Services (MBBS/NEET)',
        stream: 'Medical',
        roadmap_data: {
            targetCareer: 'Medical Professional (MBBS)',
            targetState: 'Generic',
            startingClass: 'Class 12',
            dayInTheLifeSnippet: "Conducting patient rounds, diagnosing illnesses, and continuously updating medical knowledge.",
            estimatedEducationCost: 3500000,
            estimatedFutureSalary: 900000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'mba',
        name: 'Business Management (MBA/CAT)',
        stream: 'Commerce',
        roadmap_data: {
            targetCareer: 'Business Management (MBA)',
            targetState: 'Generic',
            startingClass: 'Undergrad',
            dayInTheLifeSnippet: "Analyzing market trends, leading cross-functional teams, and making strategic financial decisions.",
            estimatedEducationCost: 2000000,
            estimatedFutureSalary: 1500000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'law',
        name: 'Legal Studies (Law/CLAT)',
        stream: 'Law',
        roadmap_data: {
            targetCareer: 'Corporate Lawyer (BA LLB)',
            targetState: 'Generic',
            startingClass: 'Class 12',
            dayInTheLifeSnippet: "Reviewing contracts, researching case laws, and advising corporate clients on compliance.",
            estimatedEducationCost: 1500000,
            estimatedFutureSalary: 1000000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'singer',
        name: 'Professional Singer / Vocalist',
        stream: 'Performing Arts',
        roadmap_data: {
            targetCareer: 'Professional Singer',
            targetState: 'Generic',
            startingClass: 'Class 9',
            dayInTheLifeSnippet: "Daily vocal warmups, studio recording sessions, coordinating with music producers, and live event performances.",
            estimatedEducationCost: 300000,
            estimatedFutureSalary: 500000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'dancer',
        name: 'Professional Dancer / Choreographer',
        stream: 'Performing Arts',
        roadmap_data: {
            targetCareer: 'Choreographer',
            targetState: 'Generic',
            startingClass: 'Class 9',
            dayInTheLifeSnippet: "Intense physical training, rehearsing routines, conceptualizing stage performances, and teaching workshops.",
            estimatedEducationCost: 250000,
            estimatedFutureSalary: 450000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'ca',
        name: 'Chartered Accountancy (CA)',
        stream: 'Commerce',
        roadmap_data: {
            targetCareer: 'Chartered Accountant (CA)',
            targetState: 'Generic',
            startingClass: 'Class 12',
            dayInTheLifeSnippet: "Auditing corporate accounts, calculating precise tax liabilities, and advising major firms on financial structuring and compliance.",
            estimatedEducationCost: 350000,
            estimatedFutureSalary: 1100000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'data-science',
        name: 'Data Science & Cybersecurity',
        stream: 'Computer Science',
        roadmap_data: {
            targetCareer: 'Data Scientist / Cybersecurity Analyst',
            targetState: 'Generic',
            startingClass: 'Class 12',
            dayInTheLifeSnippet: "Training machine learning models on massive datasets to uncover hidden trends, and securing network infrastructures against zero-day vulnerabilities.",
            estimatedEducationCost: 1000000,
            estimatedFutureSalary: 1300000,
            nodes: defaultNodes
        }
    },
    {
        slug: 'actor',
        name: 'Professional Actor / Theatre',
        stream: 'Performing Arts',
        roadmap_data: {
            targetCareer: 'Professional Actor',
            targetState: 'Generic',
            startingClass: 'Class 9',
            dayInTheLifeSnippet: "Memorizing scripts, attending intense reading sessions, rehearsing emotional performances, and collaborating closely with directors on set.",
            estimatedEducationCost: 400000,
            estimatedFutureSalary: 600000,
            nodes: defaultNodes
        }
    }
];

async function seed() {
    console.log("Seeding Database...");
    for (const career of seedData) {
        const { error } = await supabase
            .from('careers')
            .upsert(career, { onConflict: 'slug' });

        if (error) {
            console.error(`Failed to seed ${career.slug}:`, error);
        } else {
            console.log(`Successfully seeded ${career.slug}`);
        }
    }
    console.log("Seeding Complete!");
}

seed();

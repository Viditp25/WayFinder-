import Link from 'next/link';
import { ArrowRight, Compass, Target, Rocket } from 'lucide-react';
import SetupForm from '@/components/setup-form';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pilot-400/20 dark:bg-pilot-900/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 dark:bg-indigo-900/40 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Compass className="w-8 h-8 text-pilot-600 dark:text-pilot-400" />
            <span className="text-xl font-bold tracking-tight">WayFinder</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#start"
              className="px-4 py-2 rounded-full bg-pilot-600 hover:bg-pilot-700 text-white text-sm font-medium transition-colors shadow-lg shadow-pilot-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pilot-50 text-pilot-700 dark:bg-pilot-900/30 dark:text-pilot-300 border border-pilot-200 dark:border-pilot-800 text-sm font-medium mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>AI-Powered Career GPS for Indian Students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Navigate your future with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pilot-400 to-pilot-600">
              precision and purpose
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            WayFinder is an intelligent architect bridging the gap between Class 6 schooling and global professional standards. Stop reading Wikis; start following a map.
          </p>

          <div className="flex justify-center gap-4 mb-24">
            <a
              href="#start"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background hover:scale-105 transition-transform font-medium"
            >
              Discover Your Path <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left mb-32">
            <FeatureCard
              icon={<Target className="w-6 h-6 text-pilot-500" />}
              title="State-Level Drilldown"
              desc="Adapts to 28 Indian States. Whether it's MHT-CET or KCET, we plot the exact milestones."
            />
            <FeatureCard
              icon={<Compass className="w-6 h-6 text-pilot-500" />}
              title="Dynamic Roadmaps"
              desc="Clickable nodes, verified YouTube resources, and actionable steps mapped to exam timelines."
            />
            <FeatureCard
              icon={<Rocket className="w-6 h-6 text-pilot-500" />}
              title="Financial Reality Check"
              desc="Budget meters that compare estimated education costs against projected Y1 starting salaries."
            />
          </div>
        </section>

        {/* Diagnostic Section */}
        <section id="start" className="py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent to-pilot-50/50 dark:to-pilot-950/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Zone of Genius</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Take our quick multi-dimensional diagnostic to map your passions against high-growth market realities.
              </p>
            </div>

            <SetupForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 text-center text-sm text-muted-foreground relative z-10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-pilot-500" />
            <span className="font-semibold text-foreground">WayFinder</span>
          </div>
          <p>© 2026 WayFinder. Built for the Indian Student.</p>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-card p-6">
      <div className="w-12 h-12 rounded-xl bg-pilot-500/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

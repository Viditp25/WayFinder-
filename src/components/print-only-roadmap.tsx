import { CareerRoadmap } from "@/types/roadmap";

export default function PrintOnlyRoadmap({ roadmap }: { roadmap: CareerRoadmap }) {
    return (
        <div className="hidden print:block print:w-full print:p-8 font-sans text-black bg-white">
            <header className="border-b-2 border-slate-800 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2 uppercase tracking-wide">
                    {roadmap.targetCareer} Roadmap
                </h1>
                <p className="text-xl text-slate-600 font-medium">
                    Personalized pathway from {roadmap.startingClass} to Industry in {roadmap.targetState}, India
                </p>
            </header>

            <section className="mb-8 grid grid-cols-2 gap-8 text-sm">
                <div className="border border-slate-300 p-4 rounded-lg">
                    <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">Financial Overview</h3>
                    <p><strong>Estimated Education Cost:</strong> ₹{roadmap.estimatedEducationCost.toLocaleString('en-IN')}</p>
                    <p><strong>Estimated Future Salary:</strong> ₹{roadmap.estimatedFutureSalary.toLocaleString('en-IN')} / year</p>
                </div>
                <div className="border border-slate-300 p-4 rounded-lg bg-slate-50">
                    <h3 className="font-bold text-slate-800 mb-2 uppercase text-xs tracking-wider">A Day in the Life</h3>
                    <p className="italic text-slate-700">{roadmap.dayInTheLifeSnippet}</p>
                </div>
            </section>

            {roadmap.globalResources && roadmap.globalResources.length > 0 && (
                <section className="mb-10 page-break-inside-avoid">
                    <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-4">Top Global Resources</h2>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {roadmap.globalResources.map((res, idx) => (
                            <li key={idx}>
                                <strong>{res.title}</strong> - {res.type === 'youtube' ? 'Video Hub' : res.type === 'official_site' ? 'Official Portal' : 'Reference material'}<br />
                                <span className="text-xs text-slate-500 font-mono">{res.url}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="space-y-10">
                <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-300 pb-2 mb-6">Execution Timeline</h2>

                {roadmap.nodes.map((node, index) => (
                    <div key={node.id} className="relative pl-6 border-l-4 border-slate-800 page-break-inside-avoid mb-8">
                        <div className="absolute w-4 h-4 rounded-full bg-slate-800 -left-2.5 top-1"></div>

                        <div className="mb-4">
                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider rounded mb-2">
                                Phase {index + 1}: {node.phase}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{node.title}</h3>
                            {node.examDate && (
                                <p className="text-sm font-semibold text-slate-600">
                                    Target Date / Milestone: {node.examDate}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-4">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Key Actions</h4>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                                    {node.actionItems.map(action => (
                                        <li key={action.id}>
                                            <strong>{action.title}</strong>
                                            {action.monthStart && <span className="text-xs ml-2 bg-slate-100 px-1 rounded">[{action.monthStart}]</span>}
                                            <p className="mt-0.5">{action.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {node.resources.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Specific Materials</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                                        {node.resources.map((res, idx) => (
                                            <li key={idx}>
                                                <strong>{res.title}</strong>
                                                <span className="text-xs text-slate-500 block mt-0.5 font-mono">{res.url}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-16 pt-6 border-t border-slate-300 text-center text-slate-500 text-sm">
                Generated by WayFinder AI • Personal Education Compass
            </footer>
        </div>
    );
}

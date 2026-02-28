"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutTemplate,
    ShieldCheck,
    Sparkles,
    Download,
    Cpu,
    Github,
    Menu,
    X,
    Terminal,
    Layers,
    Activity,
    Code,
    Database,
    Binary,
    ChevronRight,
    Zap,
    MousePointer2
} from 'lucide-react';
import { LanguageSelector, Lang } from '@/components/LanguageSelector';
import { DiscordIcon } from '@/components/DiscordIcon';

const DICT = {
    en: {
        navHome: "Home",
        navKb: "Core Docs",
        navDiscord: "Discord",
        btnCanvas: "Open Workspace",
        footerText: "Fluscope System Docs © 2025",
        footerTags: ["Non-relational", "Ephemeral", "Client-bound"]
    },
    es: {
        navHome: "Inicio",
        navKb: "Core Docs",
        navDiscord: "Discord",
        btnCanvas: "Abrir Workspace",
        footerText: "Fluscope System Docs © 2025",
        footerTags: ["No relacional", "Efemero", "Cliente-bound"]
    },
    fr: {
        navHome: "Accueil",
        navKb: "Core Docs",
        navDiscord: "Discord",
        btnCanvas: "Ouvrir Workspace",
        footerText: "Fluscope System Docs © 2025",
        footerTags: ["Non relationnel", "Éphémère", "Client-side"]
    }
};

const TechBlock = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
    <div className="bg-[#131B2D] border border-slate-800 rounded-xl p-6 font-mono text-sm leading-relaxed mb-8 shadow-inner">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            {Icon && <Icon size={16} className="text-indigo-400" />}
            <span className="text-slate-200 font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="text-slate-400 space-y-4">
            {children}
        </div>
    </div>
);

const CodeBlock = ({ code }: { code: string }) => (
    <pre className="bg-black/40 p-4 rounded-lg border border-slate-800/50 my-4 overflow-x-auto">
        <code className="text-indigo-300/90 text-xs">{code}</code>
    </pre>
);

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('architecture');
    const [lang, setLang] = useState<Lang>('en');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = DICT[lang];

    const sections = [
        { id: 'architecture', title: 'System Architecture', icon: <Layers size={16} /> },
        { id: 'engine', title: 'Deterministic Engine', icon: <Binary size={16} /> },
        { id: 'ai-layer', title: 'Semantic AI Audit', icon: <Cpu size={16} /> },
        { id: 'data', title: 'Schema & Persistence', icon: <Database size={16} /> },
        { id: 'mechanics', title: 'Canvas Mechanics', icon: <Activity size={16} /> },
        { id: 'deployment', title: 'Client-Side Runtime', icon: <Terminal size={16} /> },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'architecture':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">System <span className="text-indigo-400">Architecture</span></h1>
                        <p className="text-slate-500 mb-10 font-mono text-sm italic">Status: v2.4.0 Stable // Client-Bound Distribution</p>

                        <TechBlock title="Overview" icon={Layers}>
                            <p>Fluscope is architected as a thin, highly interactive client for structural graph validation. It operates on a zero-backend principle, leveraging heavy client-side compute for real-time rule evaluation and state management.</p>
                            <p>The system is divided into three primary modules: the Interactive Canvas Layer, the Deterministic Validation Engine, and the Semantic AI Service.</p>
                        </TechBlock>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Code size={14} className="text-emerald-400" /> Interface Layer
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">Built on React Flow, utilizing a custom-built hook system for state synchronization and a reactive event bus for audit triggering.</p>
                            </div>
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Database size={14} className="text-fuchsia-400" /> Ephemeral Data
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">State is strictly local. Persistent storage is handled via browser LocalStorage with automatic LZ-based compression (proposed) for large graphs.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'engine':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Deterministic <span className="text-emerald-400">Logic Engine</span></h1>

                        <TechBlock title="Graph Traversal" icon={Binary}>
                            <p>The first layer of audit uses a custom BFS-based (Breadth-First Search) traversal algorithm to analyze the canvas graph as a Directed Acyclic Graph (DAG).</p>
                            <p>Key validation rules include:</p>
                            <ul className="list-disc ml-4 space-y-2 text-xs">
                                <li><span className="text-slate-200">Orphaned Nodes:</span> Nodes with in-degree = 0 (excluding start points).</li>
                                <li><span className="text-slate-200">Logical Dead-ends:</span> Termination points that are not explicitly marked as 'Terminal' nodes.</li>
                                <li><span className="text-slate-200">Cyclic Redundancy:</span> Detection of infinite loops in state transitions.</li>
                                <li><span className="text-slate-200">Handle Saturation:</span> Verification of minimum required outgoing connections for Decision nodes.</li>
                            </ul>
                        </TechBlock>

                        <CodeBlock code={`// Pseudo-logic for structural audit
const validateGraph = (nodes, edges) => {
  const orphans = nodes.filter(n => !edges.find(e => e.target === n.id));
  const sinks = nodes.filter(n => n.type !== 'terminal' && !edges.find(e => e.source === n.id));
  return { integrity: sinks.length === 0, orphans };
};`} />
                    </div>
                );
            case 'ai-layer':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Semantic <span className="text-fuchsia-400">AI Deep Audit</span></h1>

                        <TechBlock title="Knowledge Retrieval" icon={Cpu}>
                            <p>Unlike structural rules, the Semantic Layer uses LLMs (GPT-4o-mini) to evaluate the *intent* of each node.</p>
                            <p>We transform the visual graph into a structured semantic prompt:
                                <CodeBlock code={`FlowType: AUTH
Nodes: [ {id: 1, label: "Login"}, {id: 2, label: "Dashboard"} ]
Audit focus: SECURITY, UX_FRICTION, EDGE_CASES`} />
                            </p>
                            <p>The AI then identifies logical gaps such as missing "Forgot Password" paths or the absence of SSL/MFA requirements in sensitive flows.</p>
                        </TechBlock>

                        <TechBlock title="Smart Builder" icon={Sparkles}>
                            <p>The AI Smart Builder parses natural language into a JSON flow description, which is then mapped to the React Flow coordinate system using a force-directed layout approximation.</p>
                        </TechBlock>
                    </div>
                );
            case 'data':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Schema & <span className="text-sky-400">Persistence</span></h1>

                        <TechBlock title="JSON Schema" icon={Code}>
                            <p>Fluscope exports adhere to a standard JSON schema, ensuring compatibility across sessions.</p>
                            <CodeBlock code={`{
  "nodes": [ { "id": "uuid", "type": "screenNode", "data": { "label": "string" } } ],
  "edges": [ { "id": "uuid", "source": "id", "target": "id" } ],
  "metadata": { "version": "1.0", "timestamp": "ISO8601" }
}`} />
                        </TechBlock>

                        <TechBlock title="Local Storage Synchronization" icon={Database}>
                            <p>Changes are debounced and synced every 1500ms to `fluscope-flow-data`. This ensures data persistence across browser restarts without requiring an account or server connection.</p>
                        </TechBlock>
                    </div>
                );
            case 'mechanics':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Canvas <span className="text-amber-400">Mechanics</span></h1>

                        <TechBlock title="Interactive Presentation" icon={MousePointer2}>
                            <p><span className="text-slate-200">Laser Pointer Mode:</span> Implemented using a custom Canvas API layer overlay. Points are tracked with a TTL (Time-to-Live) of 2.5s and rendered with a Gaussian blur shader to simulate a laser trail.</p>
                        </TechBlock>

                        <TechBlock title="Auto-Layout Engine" icon={Zap}>
                            <p>Uses a proprietary implementation of the Dagre layout algorithm. It calculates optimal rank-based positioning to minimize edge crossings while maintaining a consistent horizontal flow direction.</p>
                        </TechBlock>
                    </div>
                );
            case 'deployment':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Runtime & <span className="text-slate-400">Distribution</span></h1>

                        <TechBlock title="Zero-Backend Runtime" icon={Terminal}>
                            <p>Fluscope is a strictly static distribution. All logic, from graph layout to the rule engine, runs in the client's VM. API calls are restricted to the AI Audit service endpoints (OpenAI proxy).</p>
                            <ul className="list-disc ml-4 space-y-1 text-xs">
                                <li>Framework: Next.js 15 (App Router)</li>
                                <li>State: React Hooks + Flow Context</li>
                                <li>Styling: Tailwind CSS / CSS Modules</li>
                                <li>Iconography: Lucide React</li>
                            </ul>
                        </TechBlock>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans text-slate-300">
            {/* Unified Docs Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 z-50 flex items-center justify-between px-4 sm:px-6 gap-3">
                <div className="flex items-center gap-2 sm:gap-6 overflow-hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <Image src="/logos/logo-isotope-1024x1024.png" alt="Logo" width={24} height={24} className="sm:w-7 sm:h-7 group-hover:rotate-[15deg] transition-transform duration-300" />
                        <span className="font-black text-white tracking-tighter text-lg hidden xs:block">FLUSCOPE.</span>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-1 shrink-0">
                        <ChevronRight size={10} className="text-slate-700 mx-1" />
                        <span className="px-2.5 py-0.5 text-[10px] font-black text-slate-400 bg-slate-800 rounded border border-slate-700 uppercase tracking-widest">Engineering Docs</span>
                    </nav>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                    <LanguageSelector lang={lang} setLang={setLang} />
                    <Link href="/canvas" className="px-4 py-2 bg-white text-black text-[10px] sm:text-xs font-black rounded uppercase hover:bg-slate-200 transition-all shadow-lg whitespace-nowrap">
                        {t.btnCanvas}
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 pt-16 relative">
                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed lg:sticky top-16 bottom-0 w-64 bg-[#0F172A] border-r border-slate-800 p-6 overflow-y-auto z-[46] transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-6">Core Specification</div>
                    <nav className="space-y-1">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setActiveSection(s.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold transition-all ${activeSection === s.id ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                            >
                                {s.icon} {s.title}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-12 p-5 bg-slate-900 border border-slate-800 rounded-xl">
                        <h5 className="text-white text-[10px] font-black uppercase tracking-widest mb-2">Technical Support</h5>
                        <p className="text-slate-600 text-[10px] mb-3 leading-relaxed">System status and architecture queries.</p>
                        <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-[10px] font-bold hover:underline">Support Channel →</a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-full overflow-hidden bg-[#0A0F1E]/50">
                    <div className="max-w-[900px] mx-auto p-6 sm:p-12 md:p-16 lg:p-24">
                        <div className="min-h-[600px]">
                            {renderContent()}
                        </div>

                        {/* Footer */}
                        <footer className="mt-24 border-t border-slate-800 py-10 opacity-50">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <Image src="/logos/logo-isotope-1024x1024.png" alt="Fluscope Icon" width={18} height={18} className="grayscale" />
                                    <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{t.footerText}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <a href="https://github.com/SyntalysTech/fluscope" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors">
                                        <Github size={14} />
                                    </a>
                                    <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#5865F2] transition-colors">
                                        <DiscordIcon size={14} />
                                    </a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}

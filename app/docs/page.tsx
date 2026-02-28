"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutTemplate,
    ShieldCheck,
    Sparkles,
    Play,
    Settings,
    MousePointer2,
    Crosshair,
    ChevronRight,
    ArrowLeft,
    GitBranch,
    TerminalSquare,
    Zap,
    Download,
    Cpu,
    Github,
    MessageCircle
} from 'lucide-react';
import { LanguageSelector, Lang } from '@/components/LanguageSelector';

const DICT = {
    en: {
        navHome: "Home",
        navKb: "Knowledge Base",
        navDiscord: "Discord",
        btnCanvas: "Open Canvas",
        footerText: "Fluscope © 2025 — Built for product teams.",
        footerTags: ["No database", "No tracking", "100% client-side"]
    },
    es: {
        navHome: "Inicio",
        navKb: "Base de Conocimiento",
        navDiscord: "Discord",
        btnCanvas: "Abrir Canvas",
        footerText: "Fluscope © 2025 — Hecho para equipos de producto.",
        footerTags: ["Sin base de datos", "Sin rastreo", "100% del lado del cliente"]
    },
    fr: {
        navHome: "Accueil",
        navKb: "Base de connaissances",
        navDiscord: "Discord",
        btnCanvas: "Ouvrir Canvas",
        footerText: "Fluscope © 2025 — Conçu pour les équipes produit.",
        footerTags: ["Pas de BDD", "Aucun suivi", "100% côté client"]
    }
};

const LaserDemo = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const pointsRef = React.useRef<{ x: number, y: number, time: number }[]>([]);
    const [isDrawing, setIsDrawing] = React.useState(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;

        const render = () => {
            const now = Date.now();
            pointsRef.current = pointsRef.current.filter(p => now - p.time < 1500);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (pointsRef.current.length < 2) {
                animationFrame = requestAnimationFrame(render);
                return;
            }

            // Draw shadow/aura
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#818cf8';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            pointsRef.current.forEach((p, i) => {
                const opacity = 1 - (now - p.time) / 1500;
                ctx.globalAlpha = opacity * 0.1;
                ctx.strokeStyle = '#818cf8';
                ctx.lineWidth = 14;
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            // Draw core
            ctx.beginPath();
            pointsRef.current.forEach((p, i) => {
                const opacity = 1 - (now - p.time) / 1500;
                ctx.globalAlpha = opacity * 0.6;
                ctx.strokeStyle = '#818cf8';
                ctx.lineWidth = 3;
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            // Tip
            const tip = pointsRef.current[pointsRef.current.length - 1];
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = '#c4b5fd';
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
            ctx.fill();

            animationFrame = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        pointsRef.current.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            time: Date.now()
        });
    };

    return (
        <div
            className="w-full aspect-video bg-[#0A0F1E] border border-slate-800 rounded-3xl overflow-hidden relative group cursor-crosshair touch-none select-none"
            onPointerDown={() => setIsDrawing(true)}
            onPointerUp={() => setIsDrawing(false)}
            onPointerLeave={() => setIsDrawing(false)}
            onMouseMove={handleMouseMove}
        >
            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full"
            />
            {!isDrawing && pointsRef.current.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="p-4 bg-indigo-500/10 rounded-full mb-4 animate-bounce">
                        <MousePointer2 className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg mb-1">Click & Drag to draw</p>
                    <p className="text-slate-600 text-sm">Experience the smoke-fade laser effect</p>
                </div>
            )}
            <div className="absolute top-4 right-4 py-1 px-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{isDrawing ? 'Drawing' : 'Ready'}</span>
            </div>
        </div>
    );
};

const NodeShowcase = () => {
    const [selected, setSelected] = useState('screen');

    const types = {
        screen: {
            icon: <LayoutTemplate size={20} />,
            color: 'indigo',
            title: 'Screen Node',
            desc: 'The fundamental building block. Represents any interface, state, or view in your user experience.',
            accent: 'from-indigo-500/20 to-indigo-600/10'
        },
        decision: {
            icon: <GitBranch size={20} />,
            color: 'fuchsia',
            title: 'Decision Point',
            desc: 'A logical fork in the road. Defines conditional routing based on user input or system state.',
            accent: 'from-fuchsia-500/20 to-fuchsia-600/10'
        },
        terminal: {
            icon: <TerminalSquare size={20} />,
            color: 'emerald',
            title: 'Terminal Result',
            desc: 'The end of the line. Signifies a success state, an error exit, or a final handoff point.',
            accent: 'from-emerald-500/20 to-emerald-600/10'
        }
    };

    const t = types[selected as keyof typeof types];

    return (
        <div className="bg-[#0A0F1E] border border-slate-800/60 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden group">
            <div className="p-10">
                <div className="flex gap-3 mb-10">
                    {Object.keys(types).map(k => (
                        <button
                            key={k}
                            onClick={() => setSelected(k)}
                            className={`p-4 rounded-2xl border transition-all duration-300 ${selected === k ? `bg-${types[k as keyof typeof types].color}-500/10 border-${types[k as keyof typeof types].color}-500/40 text-${types[k as keyof typeof types].color}-400 shadow-[0_0_20px_rgba(99,102,241,0.05)]` : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                        >
                            {types[k as keyof typeof types].icon}
                        </button>
                    ))}
                </div>

                <div className={`relative p-8 bg-gradient-to-br ${t.accent} rounded-[2rem] border border-${t.color}-500/30 backdrop-blur-3xl animate-in zoom-in-95 duration-500 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl -mr-16 -mt-16 rounded-full" />
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${t.color}-500/20 rounded-full border border-${t.color}-500/30 mb-4`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-${t.color}-400 animate-pulse`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest text-${t.color}-300`}>Interactive Component</span>
                    </div>
                    <h4 className="text-white text-2xl font-black mb-3 tracking-tight">{t.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{t.desc}</p>
                </div>
            </div>
        </div>
    );
};

const AuditLayers = () => {
    const [layer, setLayer] = useState(1);

    return (
        <div className="relative aspect-video bg-[#0A0F1E] border border-slate-800/60 rounded-[2.5rem] flex flex-col items-center justify-center p-12 overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

            <div className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-full mb-12 z-10 shadow-xl">
                <button
                    onClick={() => setLayer(1)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${layer === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Layer 1: Rules
                </button>
                <button
                    onClick={() => setLayer(2)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${layer === 2 ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Layer 2: AI Deep Audit
                </button>
            </div>

            <div className="relative w-full max-w-sm z-10">
                {layer === 1 ? (
                    <div className="bg-[#131B2D] border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-4 duration-500 backdrop-blur-2xl">
                        <div className="flex items-center gap-3 text-emerald-400 mb-6">
                            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><Zap size={18} /></div>
                            <span className="text-xs font-black uppercase tracking-tighter">Structural Integrity Check</span>
                        </div>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full animate-[progress_1.5s_ease-in-out]" />
                            </div>
                            <div>
                                <div className="text-white text-md font-black tracking-tight mb-1">Graph: Validated</div>
                                <div className="text-slate-500 text-xs font-medium">0 unreachable nodes identified.</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-indigo-950/60 to-slate-950/60 border border-indigo-500/30 p-8 rounded-[2rem] shadow-2xl backdrop-blur-3xl animate-in slide-in-from-bottom-4 duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={40} className="text-indigo-400" /></div>
                        <div className="flex items-center gap-3 text-indigo-400 mb-6">
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20"><ShieldCheck size={18} /></div>
                            <span className="text-xs font-black uppercase tracking-tighter">AI Semantic Deep Audit</span>
                        </div>
                        <div className="space-y-5">
                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl italic">
                                <p className="text-indigo-200/80 text-sm font-medium leading-relaxed">
                                    "Architecture Note: Your 'Profile Edit' screen lacks a 'Discard Changes' confirmation. This may lead to data loss."
                                </p>
                            </div>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/40 active:scale-95">Apply AI Fix</button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { width: 0; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
};

const BuilderSandbox = () => {
    const [prompt, setPrompt] = useState('Create a payment flow with Stripe and an email confirmation...');
    const [status, setStatus] = useState<'idle' | 'building' | 'done'>('idle');

    const handleGenerate = () => {
        if (status === 'building') return;
        setStatus('building');
        setTimeout(() => setStatus('done'), 2200);
    };

    return (
        <div className="bg-[#0A0F1E] border border-slate-800/60 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden group relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

            <div className="relative p-10 flex flex-col items-center">
                <div className="mb-12 w-full max-w-xl">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Sparkles size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Smart Builder Sandbox</span>
                    </div>

                    <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 rounded-2xl blur opacity-20 group-focus-within/input:opacity-50 transition-opacity duration-500" />
                        <div className="relative flex gap-2 bg-[#131B2D] p-2.5 rounded-2xl border border-slate-700/50 backdrop-blur-3xl shadow-xl">
                            <input
                                className="bg-transparent border-none focus:ring-0 text-white text-sm flex-1 px-4 placeholder:text-slate-600 font-medium"
                                value={prompt}
                                placeholder="Describe your flow..."
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={status === 'building'}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={status === 'building'}
                                className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${status === 'building' ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 hover:scale-[1.02] active:scale-95 shadow-indigo-500/20'}`}
                            >
                                {status === 'building' ? <Cpu className="w-3.5 h-3.5 animate-spin" /> : <>Generate <Sparkles size={14} /></>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full min-h-[160px] flex items-center justify-center relative">
                    {status === 'idle' && (
                        <div className="flex flex-col items-center gap-4 text-slate-500 select-none animate-in fade-in duration-700">
                            <div className="p-5 rounded-3xl bg-slate-800/10 border border-slate-700/30 border-dashed border-2">
                                <LayoutTemplate className="w-12 h-12 opacity-20" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Ready to build</p>
                        </div>
                    )}

                    {status === 'building' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                            <div className="relative w-14 h-14 mb-8">
                                <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl" />
                                <div className="absolute inset-0 border-2 border-t-indigo-500 rounded-2xl animate-spin shadow-[0_0_15px_#6366f133]" />
                            </div>
                            <div className="space-y-2 text-center">
                                <p className="text-white font-black text-sm tracking-tight">AI Agent Processing</p>
                                <p className="text-indigo-400 font-bold text-[9px] uppercase tracking-[0.25em] animate-pulse">Mapping logic paths...</p>
                            </div>
                        </div>
                    )}

                    {status === 'done' && (
                        <div className="flex items-center gap-6 animate-in fade-in blur-in-sm slide-in-from-bottom-4 duration-700">
                            {/* Node 1 */}
                            <div className="flex flex-col gap-2">
                                <div className="w-36 h-24 bg-gradient-to-br from-indigo-500/15 to-indigo-500/5 backdrop-blur-xl border border-indigo-400/40 rounded-[1.5rem] p-4 shadow-[0_0_40px_rgba(99,102,241,0.1)] hover:border-indigo-400 transition-all">
                                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                                        <LayoutTemplate size={14} className="text-indigo-400" />
                                    </div>
                                    <div className="text-[11px] font-black text-white leading-tight uppercase tracking-tight">Purchase flow</div>
                                </div>
                            </div>

                            {/* Line */}
                            <div className="relative w-16 h-[1.5px] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-emerald-400/60 to-emerald-400/30" />
                                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white opacity-40 transform -translate-y-1/2 animate-[dash_2.5s_infinite_linear]" />
                            </div>

                            {/* Node 2 */}
                            <div className="flex flex-col gap-2">
                                <div className="w-36 h-24 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 backdrop-blur-xl border border-emerald-400/40 rounded-[1.5rem] p-4 shadow-[0_0_40px_rgba(52,211,153,0.1)] hover:border-emerald-400 transition-all">
                                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                                        <ShieldCheck size={14} className="text-emerald-400" />
                                    </div>
                                    <div className="text-[11px] font-black text-white leading-tight uppercase tracking-tight">Success View</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes dash {
                    0% { transform: scaleX(0); opacity: 0; transform-origin: left; }
                    50% { transform: scaleX(1); opacity: 1; transform-origin: left; }
                    51% { transform-origin: right; }
                    100% { transform: scaleX(0); opacity: 0; transform-origin: right; }
                }
            `}</style>
        </div>
    );
};

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('overview');
    const [lang, setLang] = useState<Lang>('en');
    const t = DICT[lang];

    const sections = [
        { id: 'overview', title: 'Product Overview', icon: <Zap size={18} /> },
        { id: 'nodes', title: 'Flow Components', icon: <LayoutTemplate size={18} /> },
        { id: 'audit', title: 'AI Dual-Layer Audit', icon: <ShieldCheck size={18} /> },
        { id: 'builder', title: 'Smart Builder', icon: <Sparkles size={18} /> },
        { id: 'presentation', title: 'Laser Presentation', icon: <Crosshair size={18} /> },
        { id: 'export', title: 'Export & Share', icon: <Download size={18} /> },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">What is Fluscope?</h1>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Fluscope is a structural validation workspace for product teams. It allows you to map out user flows and automatically detect logical gaps, edge cases, and missing states before a single line of code is written.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg"><Cpu size={16} /></div>
                                    Logic-First Design
                                </h3>
                                <p className="text-slate-400 text-sm">Focus on the "if-then" of your product rather than pixels. Ensure the skeleton is solid.</p>
                            </div>
                            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
                                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg"><ShieldCheck size={16} /></div>
                                    Automated Irony
                                </h3>
                                <p className="text-slate-400 text-sm">Let AI find what you missed. From missing error states to dead ends in complex auth flows.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'nodes':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-white tracking-tight">Flow Components</h2>
                        <div className="space-y-6">
                            <NodeShowcase />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                                    <h5 className="text-white font-bold text-sm mb-1">Drag to connect</h5>
                                    <p className="text-slate-500 text-xs text-balance">Every node has source (right) and target (left) handles. Simply click and drag to creates lines.</p>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                                    <h5 className="text-white font-bold text-sm mb-1">Context Menus</h5>
                                    <p className="text-slate-500 text-xs text-balance">Right-click any node to change its type or add a child node directly at its side.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'audit':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-white tracking-tight">AI Dual-Layer Audit</h2>
                        <p className="text-slate-400 text-lg">The secret sauce of Fluscope. Local rules meet deep semantic AI insights.</p>

                        <AuditLayers />

                        <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-5 rounded-xl flex items-center gap-4">
                            <div className="text-fuchsia-400 p-2 bg-fuchsia-500/5 rounded-lg border border-fuchsia-500/10"><Sparkles size={24} /></div>
                            <div>
                                <h5 className="text-fuchsia-300 font-bold">Auto-Fix Feature</h5>
                                <p className="text-fuchsia-300/70 text-sm">Patch structural gaps instantly with AI-driven vertex reconstruction.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'builder':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-white tracking-tight">Smart Builder</h2>
                        <p className="text-slate-400 text-lg">Zero-to-flow in seconds.</p>

                        <BuilderSandbox />

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400">
                            {[
                                "Natural language processing",
                                "Auto-positioning algorithms",
                                "Multilingual support",
                                "Iterative modification"
                            ].map(x => (
                                <li key={x} className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/30">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
                                    <span className="text-xs">{x}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'presentation':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-white tracking-tight">Laser Mode</h2>
                        <p className="text-slate-400 text-lg">Fluscope is built for meetings. Use Laser Mode to guide your team's eyes during demos.</p>

                        <LaserDemo />
                    </div>
                );
            case 'export':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-white tracking-tight">Export & Share</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-colors">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <div className="text-indigo-400"><Download size={16} /></div>
                                    PNG with Title
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Export high-resolution images for your Notion, Slack, or Figma boards. Includes a clean header with your project title.</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 transition-colors">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <div className="text-fuchsia-400"><Settings size={16} /></div>
                                    JSON Persistence
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Download the raw flow data to back it up or share the file with a teammate to import into their own Fluscope session.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <Image src="/logos/logo-isotope-1024x1024.png" alt="Logo" width={26} height={26} className="group-hover:rotate-[15deg] transition-transform duration-300" />
                        <Image src="/logos/logo-horizontal-text-alone-1600x400.png" alt="Fluscope" width={85} height={20} className="object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                        <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg ml-1 hidden sm:block backdrop-blur-md">Docs</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="/" className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-300">{t.navHome}</Link>
                        <ChevronRight size={10} className="text-slate-700" />
                        <span className="px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">{t.navKb}</span>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <a href="https://github.com/SyntalysTech/fluscope" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white transition-colors" title="GitHub">
                        <Github size={20} />
                    </a>
                    <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-[#5865F2] transition-colors" title="Discord">
                        <MessageCircle size={20} />
                    </a>
                    <LanguageSelector lang={lang} setLang={setLang} />
                    <Link href="/canvas" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/40">
                        {t.btnCanvas}
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#0F172A] border-r border-slate-800 p-6 overflow-y-auto hidden lg:block">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-6">Introduction</div>
                    <nav className="space-y-1">
                        {sections.slice(0, 1).map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                            >
                                {s.icon} {s.title}
                            </button>
                        ))}
                    </nav>

                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-6 mt-10">Guide</div>
                    <nav className="space-y-1">
                        {sections.slice(1).map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === s.id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                            >
                                {s.icon} {s.title}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-12 p-5 bg-gradient-to-br from-indigo-500/5 to-slate-800/20 border border-slate-700/40 rounded-2xl">
                        <h5 className="text-white text-xs font-bold mb-2">Need help?</h5>
                        <p className="text-slate-500 text-[11px] mb-3 leading-relaxed">Found a bug or have a feature request?</p>
                        <a href="mailto:hello@fluscope.app" className="text-indigo-400 text-xs font-bold hover:underline">Support →</a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 p-8 md:p-12 lg:p-20 max-w-5xl">
                    {/* Mobile Nav */}
                    <div className="lg:hidden mb-10 overflow-x-auto">
                        <div className="flex gap-2 pb-2">
                            {sections.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === s.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[500px]">
                        {renderContent()}
                    </div>

                    {/* Footer */}
                    <footer className="mt-32 border-t border-slate-800 py-12">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <Image src="/logos/logo-isotope-1024x1024.png" alt="Fluscope Icon" width={22} height={22} className="opacity-50 grayscale" />
                                <span className="text-slate-500 text-xs font-medium">{t.footerText}</span>
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                <a href="https://github.com/SyntalysTech/fluscope" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors normal-case" title="GitHub">
                                    <Github size={14} />
                                </a>
                                <span className="text-slate-800 text-base">·</span>
                                <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors normal-case" title="Discord">
                                    <MessageCircle size={14} />
                                </a>
                                <span className="text-slate-800 text-base">·</span>
                                {t.footerTags.map((tag, i) => (
                                    <span key={i} className="flex items-center gap-4">
                                        <span>{tag}</span>
                                        {i < t.footerTags.length - 1 && <span className="text-slate-800 text-base">·</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

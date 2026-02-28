import React, { useState } from 'react';
import { X, Sparkles, Wand2, Hammer, Loader2 } from 'lucide-react';
import { FluscopeNode, FluscopeEdge } from '@/types/flow';

interface SmartBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFlow: (nodes: FluscopeNode[], edges: FluscopeEdge[]) => void;
    lang: string;
}

export function SmartBuilderModal({ isOpen, onClose, onApplyFlow, lang }: SmartBuilderModalProps) {
    const [mode, setMode] = useState<'brief' | 'wizard'>('brief');

    // Brief Mode State
    const [briefText, setBriefText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Wizard Mode States
    const [wizAuth, setWizAuth] = useState(true);
    const [wizSubs, setWizSubs] = useState(true);
    const [wizOnboarding, setWizOnboarding] = useState(false);
    const [wizAdmin, setWizAdmin] = useState(false);

    if (!isOpen) return null;

    const handleGenerateBrief = async () => {
        if (!briefText.trim()) return;
        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate-flow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: briefText })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.nodes && data.edges) {
                    onApplyFlow(data.nodes, data.edges);
                    onClose();
                }
            }
        } catch (e) {
            console.error(e);
        }
        setIsGenerating(false);
    };

    const handleGenerateWizard = () => {
        const nodes: any[] = [];
        const edges: any[] = [];

        // Simple deterministic generator logic based on selections
        let currentY = 100;
        let lastId = '';

        const addNode = (id: string, label: string, type: string, x: number) => {
            nodes.push({ id, type, position: { x, y: currentY }, data: { label } });
            if (lastId) edges.push({
                id: `e_${lastId}_${id}`,
                source: lastId,
                target: id,
                sourceHandle: 'bottom-source',
                targetHandle: 'top-target'
            });
            lastId = id;
            currentY += 150;
        };

        if (wizOnboarding) addNode('onb', 'Onboarding Tutorial', 'screenNode', 300);
        if (wizAuth) addNode('auth', 'Login / Signup', 'decisionNode', 300);
        if (wizSubs) addNode('sub', 'Subscription Checkout', 'screenNode', 300);
        addNode('dash', 'Main Dashboard', 'screenNode', 300);

        if (wizAdmin) {
            nodes.push({ id: 'admin', type: 'terminalNode', position: { x: 600, y: currentY - 150 }, data: { label: 'Admin Panel' } });
            edges.push({
                id: `e_dash_admin`,
                source: `dash`,
                target: `admin`,
                sourceHandle: 'right-source',
                targetHandle: 'left-target',
                label: 'Admin Role'
            });
        }

        onApplyFlow(nodes, edges);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-[#0F172A]/30">
                    <div className="flex items-center gap-2 text-slate-200 font-bold">
                        <Sparkles size={18} className="text-indigo-400" />
                        AI Flow Assistant
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex p-2 bg-slate-800/50 border-b border-slate-700/50">
                    <button onClick={() => setMode('brief')} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'brief' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        <Wand2 size={14} /> Prompt Builder
                    </button>
                    <button onClick={() => setMode('wizard')} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${mode === 'wizard' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                        <Hammer size={14} /> Guided Wizard
                    </button>
                </div>

                <div className="p-6">
                    {mode === 'brief' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Describe your product flow</label>
                                <textarea
                                    value={briefText}
                                    onChange={(e) => setBriefText(e.target.value)}
                                    placeholder="e.g., A SaaS platform with a freemium signup, email verification, dashboard, and a stripe checkout for pro features..."
                                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleGenerateBrief}
                                disabled={isGenerating || !briefText.trim()}
                                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <><img src="/logos/logo-isotope-1024x1024.png" alt="" width={16} height={16} className="animate-spin opacity-80" /> Generating Graph...</> : <><Sparkles size={16} /> Generate Flow</>}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 text-sm text-slate-300">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Answer to auto-generate</label>

                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-800/50 transition">
                                <input type="checkbox" checked={wizAuth} onChange={(e) => setWizAuth(e.target.checked)} className="w-4 h-4 accent-indigo-500 cursor-pointer" />
                                <span>Require Authentication? (Login/Signup)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-800/50 transition">
                                <input type="checkbox" checked={wizOnboarding} onChange={(e) => setWizOnboarding(e.target.checked)} className="w-4 h-4 accent-indigo-500 cursor-pointer" />
                                <span>Include User Onboarding Tutorial?</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-800/50 transition">
                                <input type="checkbox" checked={wizSubs} onChange={(e) => setWizSubs(e.target.checked)} className="w-4 h-4 accent-indigo-500 cursor-pointer" />
                                <span>Include Subscription Checkout?</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-slate-800/50 transition">
                                <input type="checkbox" checked={wizAdmin} onChange={(e) => setWizAdmin(e.target.checked)} className="w-4 h-4 accent-indigo-500 cursor-pointer" />
                                <span>Add Admin Control Panel paths?</span>
                            </label>

                            <button
                                onClick={handleGenerateWizard}
                                className="w-full py-2.5 mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                            >
                                <Hammer size={16} /> Build Structure
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

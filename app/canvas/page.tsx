"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Canvas from '@/components/Canvas';
import AuditPanel from '@/components/AuditPanel';
import { runAudit } from '@/lib/ruleEngine';
import { FluscopeNode, FluscopeEdge, AuditResult } from '@/types/flow';
import { applyNodeChanges, applyEdgeChanges, addEdge, Connection, EdgeChange, NodeChange } from '@xyflow/react';
import { saveFlowToLocal, loadFlowFromLocal, clearLocalFlow } from '@/lib/storage';
import { exportFlowAsJson, exportCanvasAsPng } from '@/lib/exporter';
import { validateFlow } from '@/lib/flowValidator';
import { authFlowSchema, checkoutFlowSchema, brokenDemoFlowSchema } from '@/lib/templates';
import { runIntelligentAudit } from '@/lib/openaiAudit';
import { calculateScoreAndLabel } from '@/lib/ruleEngine';
import { LanguageSelector, Lang } from '@/components/LanguageSelector';
import { TemplateSelector } from '@/components/TemplateSelector';
import { getLayoutedElements } from '@/lib/autoLayout';
import { SmartBuilderModal } from '@/components/SmartBuilderModal';
import { DiscordIcon } from '@/components/DiscordIcon';
import { Download, Sparkles, Activity, Wrench, MousePointer2, LayoutTemplate, GitBranch, TerminalSquare, Play, Settings, Eraser, Crosshair, ChevronRight, ChevronLeft, Github, MessageCircle, X } from 'lucide-react';

const CANVAS_DICT = {
    en: {
        runAudit: "Audit Flow", analyzing: "Analyzing...",
        create: "Create",
        addScreen: "Add Screen", addDecision: "Add Decision", addTerminal: "Add Terminal",
        genBrief: "Generate from Brief", loadAuth: "Load Example (Auth)", loadBroken: "Load Broken Demo",
        discord: "Join Discord",
        tools: "Tools", laserMode: "Laser Pointer",
        github: "View on GitHub",
        exportJson: "Export JSON", exportPng: "Export PNG", resetCanvas: "Reset Canvas"
    },
    es: {
        runAudit: "Auditar Flujo", analyzing: "Analizando...",
        create: "Crear",
        addScreen: "Añadir Pantalla", addDecision: "Añadir Decisión", addTerminal: "Añadir Terminal",
        genBrief: "Generar desde Brief", loadAuth: "Ejemplo de Autenticación", loadBroken: "Demo Rota",
        discord: "Unirse a Discord",
        tools: "Herramientas", laserMode: "Puntero Láser",
        github: "Ver en GitHub",
        exportJson: "Exportar JSON", exportPng: "Exportar PNG", resetCanvas: "Vaciar Todo"
    },
    fr: {
        runAudit: "Auditer le Flux", analyzing: "Analyse...",
        create: "Créer",
        addScreen: "Ajouter Écran", addDecision: "Ajouter Décision", addTerminal: "Ajouter Terminal",
        genBrief: "Générer via Brief", loadAuth: "Exemple (Auth)", loadBroken: "Démo Cassée",
        discord: "Rejoindre Discord",
        tools: "Outils", laserMode: "Pointeur Laser",
        github: "Voir sur GitHub",
        exportJson: "Exporter JSON", exportPng: "Exporter PNG", resetCanvas: "Réinitialiser"
    }
};

const initialNodes: FluscopeNode[] = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: 'login' } },
];

const initialEdges: FluscopeEdge[] = [];

export default function CanvasPage() {
    const [nodes, setNodes] = useState<FluscopeNode[]>(initialNodes);
    const [edges, setEdges] = useState<FluscopeEdge[]>(initialEdges);
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [lang, setLang] = useState<Lang>('en');

    // Phase 2.6 & 3.0 States
    const [selectedNodeType, setSelectedNodeType] = useState('screenNode');
    const [drawModeEnabled, setDrawModeEnabled] = useState(false);
    const [clearDrawingsSignal, setClearDrawingsSignal] = useState(0);
    const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [liveAuditMode, setLiveAuditMode] = useState(false);
    const [isFixing, setIsFixing] = useState(false);
    const [isAuditPanelOpen, setIsAuditPanelOpen] = useState(false);
    const [flowTitle, setFlowTitle] = useState('Untitled Flow');

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds) as FluscopeNode[]),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    useEffect(() => {
        const saved = loadFlowFromLocal();
        if (saved) {
            setNodes(saved.nodes);
            setEdges(saved.edges);
            showNotification('Recovered previous session', 'info');
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            saveFlowToLocal(nodes, edges);
        }
    }, [nodes, edges, isInitialized]);

    // Live Audit Mode Trigger
    useEffect(() => {
        if (liveAuditMode && isInitialized && !isAnalyzingAI) {
            const detResult = runAudit(nodes, edges);
            setAuditResult(detResult);

            // Reapply basic highlights visually 
            setNodes((nds) => nds.map((node) => {
                const nodeIssues = detResult.issues.filter(i => i.affectedNodes.includes(node.id));
                let highestSeverity: 'critical' | 'warning' | 'suggestion' | undefined = undefined;
                if (nodeIssues.some(i => i.type === 'critical')) highestSeverity = 'critical';
                else if (nodeIssues.some(i => i.type === 'warning')) highestSeverity = 'warning';
                else if (nodeIssues.some(i => i.type === 'suggestion')) highestSeverity = 'suggestion';

                if (node.data.issueSeverity !== highestSeverity) {
                    return { ...node, data: { ...node.data, issueSeverity: highestSeverity } };
                }
                return node;
            }));
        }
    }, [nodes, edges, liveAuditMode, isInitialized, isAnalyzingAI]);

    const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const handleAddNode = (type: string) => {
        const newNode: FluscopeNode = {
            id: Math.random().toString(36).substring(7),
            type: type,
            position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
            data: { label: type === 'screenNode' ? 'New Screen' : type === 'decisionNode' ? 'Decision' : 'End' },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the canvas? All unsaved local progress will be lost.')) {
            clearLocalFlow();
            setNodes(initialNodes);
            setEdges(initialEdges);
            setAuditResult(null);
            showNotification('Flow reset to empty state', 'info');
        }
    };

    const handleExport = () => {
        const success = exportFlowAsJson(nodes, edges, flowTitle);
        if (success) showNotification('Flow exported successfully', 'success');
        else showNotification('Failed to export flow', 'error');
    };

    const handleExportPng = async () => {
        const success = await exportCanvasAsPng(nodes, flowTitle);
        if (success) showNotification('Canvas exported as PNG', 'success');
        else showNotification('Failed to export image', 'error');
    };

    const handleImportClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (validateFlow(parsed)) {
                    setNodes(parsed.nodes);
                    setEdges(parsed.edges);
                    showNotification('Flow imported successfully', 'success');
                    // Automatically run audit after successful state replacement (we use setTimeout to allow state to settle)
                    setTimeout(() => runAuditOnImport(parsed.nodes, parsed.edges), 0);
                } else {
                    showNotification('Invalid Fluscope file format', 'error');
                }
            } catch (err) {
                showNotification('Invalid JSON file format', 'error');
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    // Special handler to run audit cleanly off direct passed layout nodes when imported without relying on react render cycle
    const runAuditOnImport = (newNodes: FluscopeNode[], newEdges: FluscopeEdge[]) => {
        const result = runAudit(newNodes, newEdges);
        setAuditResult(result);

        setNodes((nds) => nds.map((node) => {
            const nodeIssues = result.issues.filter(i => i.affectedNodes.includes(node.id));
            let highestSeverity: 'critical' | 'warning' | 'suggestion' | undefined = undefined;
            if (nodeIssues.some(i => i.type === 'critical')) highestSeverity = 'critical';
            else if (nodeIssues.some(i => i.type === 'warning')) highestSeverity = 'warning';
            else if (nodeIssues.some(i => i.type === 'suggestion')) highestSeverity = 'suggestion';

            return {
                ...node,
                data: {
                    ...node.data,
                    issueSeverity: highestSeverity,
                    activeHighlight: false
                }
            };
        }));
    };

    const handleLoadTemplate = (val: string) => {
        if (!val) return;

        let schema: any = null;
        if (val === 'auth') schema = authFlowSchema;
        else if (val === 'checkout') schema = checkoutFlowSchema;
        else if (val === 'broken') schema = brokenDemoFlowSchema;

        if (schema) {
            setNodes(schema.nodes);
            setEdges(schema.edges);
            showNotification('Template loaded', 'info');
            // Allow state to settle, then audit
            setTimeout(() => runAuditOnImport(schema.nodes, schema.edges), 100);
        }
    };

    const handleAutoFix = async () => {
        if (!auditResult || auditResult.issues.length === 0) return;
        setIsFixing(true);
        showNotification('Fixing your flow...', 'info');

        try {
            const res = await fetch('/api/fix-flow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges, issues: auditResult?.issues ?? [] })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.nodes && data.edges) {
                    const mapped = data.edges.map((e: any) => ({ ...e, style: { stroke: '#818cf8', strokeWidth: 2 } }));
                    const { nodes: ln, edges: le } = getLayoutedElements(data.nodes, mapped);
                    setNodes(ln);
                    setEdges(le);
                    // Re-audit with the fixed flow
                    const fixed = runAudit(ln, le);
                    setAuditResult(fixed);
                    showNotification(`Fixed ✔ Score: ${fixed.score}/100`, 'success');
                } else {
                    showNotification('Unexpected response from AI.', 'error');
                }
            } else {
                showNotification('Auto-fix unavailable. Check your API key.', 'error');
            }
        } catch {
            showNotification('Auto-fix failed. Try again.', 'error');
        }

        setIsFixing(false);
    };

    const handleRunAudit = async () => {
        setIsAuditPanelOpen(true);
        // Run deterministic first
        const detResult = runAudit(nodes, edges);
        setAuditResult(detResult);

        // Pre-highlight mapping for deterministic fast results
        const updateNodeHighlights = (currentResult: AuditResult) => {
            setNodes((nds) => nds.map((node) => {
                const nodeIssues = currentResult.issues.filter(i => i.affectedNodes.includes(node.id));
                let highestSeverity: 'critical' | 'warning' | 'suggestion' | undefined = undefined;
                if (nodeIssues.some(i => i.type === 'critical')) highestSeverity = 'critical';
                else if (nodeIssues.some(i => i.type === 'warning')) highestSeverity = 'warning';
                else if (nodeIssues.some(i => i.type === 'suggestion')) highestSeverity = 'suggestion';

                return {
                    ...node,
                    data: {
                        ...node.data,
                        issueSeverity: highestSeverity,
                        activeHighlight: false
                    }
                };
            }));
        };

        updateNodeHighlights(detResult);

        // Start Intelligent Audit Check
        let aiUsageCount = 0;
        try {
            aiUsageCount = parseInt(localStorage.getItem('fluscope-ai-usage') || '0', 10);
        } catch (e) { }

        if (aiUsageCount >= 50) {
            showNotification('AI audit limit reached for this session.', 'error');
            return;
        }

        setIsAnalyzingAI(true);
        const { issues: aiIssues, aiConfidence } = await runIntelligentAudit(nodes, edges);
        setIsAnalyzingAI(false);

        if (aiIssues.length > 0) {
            localStorage.setItem('fluscope-ai-usage', (aiUsageCount + 1).toString());

            const allIssues = [...detResult.issues, ...aiIssues];
            const updatedScoreData = calculateScoreAndLabel(allIssues);

            const mergedResult: AuditResult = {
                ...detResult,
                score: updatedScoreData.score,
                scoreLabel: updatedScoreData.scoreLabel,
                issues: allIssues,
                aiConfidence
            };

            setAuditResult(mergedResult);
            updateNodeHighlights(mergedResult);
            showNotification('Deep analysis complete.', 'success');
        } else {
            showNotification('Deep analysis complete. No extra issues found.', 'success');
        }
    };

    const handleHighlightNodes = (nodeIds: string[]) => {
        setNodes((nds) => nds.map((node) => ({
            ...node,
            data: {
                ...node.data,
                activeHighlight: nodeIds.includes(node.id)
            }
        })));
    };

    const handleNodeLabelChange = (id: string, newLabel: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    node.data = { ...node.data, label: newLabel };
                }
                return node;
            })
        );
    };

    return (
        <div className="flex h-screen w-full bg-[#0F172A] relative overflow-hidden">
            {/* Unified Canvas Header */}
            <header className={`fixed top-0 left-0 w-full h-16 sm:h-20 px-4 sm:px-6 z-[60] flex items-center justify-between gap-3 sm:gap-4 transition-opacity duration-300 ${drawModeEnabled ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>

                {/* Left: Logo & Templates */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/" className="flex items-center gap-2 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 p-2 sm:px-4 sm:py-2 rounded-xl shadow-xl transition-all group shrink-0">
                        <Image src="/logos/logo-isotope-1024x1024.png" alt="Logo" width={24} height={24} className="sm:w-6 sm:h-6 object-contain group-hover:rotate-[15deg] transition-transform duration-300" />
                        <Image src="/logos/logo-horizontal-text-alone-1600x400.png" alt="Fluscope" width={80} height={20} className="hidden lg:block object-contain" />
                    </Link>
                    <div className="hidden sm:block">
                        <TemplateSelector lang={lang} onSelect={handleLoadTemplate} dict={CANVAS_DICT[lang]} />
                    </div>
                </div>

                {/* Center: Title (Large Screens Only) */}
                <div className="hidden lg:flex flex-1 justify-center max-w-[280px] xl:max-w-md">
                    <input
                        type="text"
                        value={flowTitle}
                        onChange={e => setFlowTitle(e.target.value)}
                        className="w-full bg-[#0F172A]/70 backdrop-blur-md border border-slate-700/50 hover:border-slate-600 focus:border-indigo-500/60 text-slate-300 placeholder-slate-600 text-sm font-medium text-center px-4 py-2 rounded-xl shadow-xl outline-none transition-all focus:ring-1 focus:ring-indigo-500/40"
                        placeholder="Untitled Flow"
                        spellCheck={false}
                    />
                </div>

                {/* Right: Actions */}
                <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${isAuditPanelOpen && !window.matchMedia('(max-width: 1024px)').matches ? 'mr-[320px]' : ''}`}>
                    <div className="relative group">
                        <button className="bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 text-slate-300 px-3 py-2 sm:py-2.5 rounded-xl shadow-xl flex items-center gap-2 transition-all">
                            <Settings size={18} />
                        </button>
                        {/* Settings Dropdown */}
                        <div className="absolute top-full right-0 mt-3 w-48 sm:w-56 bg-[#0F172A]/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <div className="py-2">
                                <div className="px-4 py-2 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Lang</span>
                                    <div className="flex items-center gap-1">
                                        {(['en', 'es', 'fr'] as const).map(l => (
                                            <button key={l} onClick={() => setLang(l)} className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold transition-all ${lang === l ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                                                {l.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-px bg-slate-800 my-1" />
                                <button onClick={() => setIsBuilderOpen(true)} className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-indigo-300 hover:bg-slate-800 hover:text-indigo-200 transition flex items-center gap-2">
                                    <Sparkles size={14} /> Brief
                                </button>
                                <div className="h-px bg-slate-800 my-1 sm:hidden transition-all" />
                                <div className="px-4 py-2 sm:hidden">
                                    <TemplateSelector lang={lang} onSelect={handleLoadTemplate} dict={CANVAS_DICT[lang]} />
                                </div>
                                <div className="h-px bg-slate-800 my-1" />
                                <a href="https://github.com/SyntalysTech/fluscope" target="_blank" rel="noopener noreferrer" className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition flex items-center gap-2">
                                    <Github size={14} /> GitHub
                                </a>
                                <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="w-full text-left px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-400 hover:bg-slate-800 hover:text-[#5865F2] transition flex items-center gap-2">
                                    <DiscordIcon size={14} /> Discord
                                </a>
                                <div className="h-px bg-slate-800 my-1" />
                                <button onClick={handleExportPng} className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                                    {CANVAS_DICT[lang].exportPng}
                                </button>
                                <button onClick={handleExport} className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition">
                                    {CANVAS_DICT[lang].exportJson}
                                </button>
                                <div className="h-px bg-slate-800 my-1" />
                                <button onClick={handleReset} className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-slate-800 font-medium transition flex items-center gap-2">
                                    <Eraser size={14} /> {CANVAS_DICT[lang].resetCanvas}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleRunAudit}
                        disabled={isAnalyzingAI}
                        className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all h-9 sm:h-10 ${isAnalyzingAI ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg'}`}
                    >
                        {isAnalyzingAI ? <img src="/logos/logo-isotope-1024x1024.png" alt="" width={16} height={16} className="animate-spin opacity-80" /> : <Play size={16} />}
                        <span className="hidden xs:block">{CANVAS_DICT[lang].runAudit}</span>
                    </button>

                    <button
                        onClick={() => setIsAuditPanelOpen(v => !v)}
                        title={isAuditPanelOpen ? 'Close panel' : 'Open audit panel'}
                        className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl shadow-xl flex items-center justify-center transition-all"
                    >
                        {isAuditPanelOpen ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                    </button>
                </div>
            </header>

            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Notification Banner */}
            {notification && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`px-4 py-2 rounded-full border shadow-lg text-xs font-semibold tracking-wide backdrop-blur-md ${notification.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                        {notification.message}
                    </div>
                </div>
            )}

            {/* Bottom Toolbar — Desktop */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-[#0F172A]/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl transition-all duration-300 hidden sm:flex ${drawModeEnabled ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={() => setDrawModeEnabled(false)}
                    className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${!drawModeEnabled ? 'bg-slate-700/80 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'}`}
                    title="Select"
                >
                    <MousePointer2 size={17} />
                </button>
                <div className="w-px h-5 bg-slate-700/80 mx-1" />
                <button onClick={() => { setDrawModeEnabled(false); handleAddNode('screenNode'); }} className="p-2.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all" title="Add Screen">
                    <LayoutTemplate size={17} />
                </button>
                <button onClick={() => { setDrawModeEnabled(false); handleAddNode('decisionNode'); }} className="p-2.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all" title="Add Decision">
                    <GitBranch size={17} />
                </button>
                <button onClick={() => { setDrawModeEnabled(false); handleAddNode('terminalNode'); }} className="p-2.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all" title="Add Terminal">
                    <TerminalSquare size={17} />
                </button>
                <div className="w-px h-5 bg-slate-700/80 mx-1" />
                <button
                    onClick={() => setDrawModeEnabled(true)}
                    className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${drawModeEnabled ? 'bg-indigo-500/80 text-white shadow-[0_0_12px_rgba(129,140,248,0.45)]' : 'text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
                    title="Laser Pointer"
                >
                    <Crosshair size={17} />
                </button>
            </div>

            {/* Bottom Toolbar — Mobile */}
            <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-[#0F172A]/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl transition-all duration-300 sm:hidden ${drawModeEnabled ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={() => setDrawModeEnabled(false)}
                    className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${!drawModeEnabled ? 'bg-slate-700/80 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'}`}
                >
                    <MousePointer2 size={17} />
                </button>
                <button onClick={() => { setDrawModeEnabled(false); handleAddNode('screenNode'); }} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg">
                    <LayoutTemplate size={17} />
                </button>
                <button onClick={() => { setDrawModeEnabled(false); handleAddNode('decisionNode'); }} className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg">
                    <GitBranch size={17} />
                </button>
                <button
                    onClick={() => setDrawModeEnabled(true)}
                    className={`p-2.5 rounded-lg transition-all ${drawModeEnabled ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}
                >
                    <Crosshair size={17} />
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative z-10 border-r border-slate-800">
                <Canvas
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    updateNodeLabel={handleNodeLabelChange}
                    drawModeEnabled={drawModeEnabled}
                    clearDrawingsSignal={clearDrawingsSignal}
                />
            </div>

            {/* Audit Panel Overlay */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0F172A] border-l border-slate-800 z-[70] transform transition-transform duration-500 ease-in-out shadow-2xl ${isAuditPanelOpen ? 'translate-x-0' : 'translate-x-full shadow-none'}`}>
                {/* Header for Panel */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 sm:hidden">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                        <Activity size={18} />
                        <span>Audit Panel</span>
                    </div>
                    <button
                        onClick={() => setIsAuditPanelOpen(false)}
                        className="p-2 text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="h-full overflow-y-auto">
                    <AuditPanel
                        result={auditResult}
                        onHighlightNodes={handleHighlightNodes}
                        nodes={nodes}
                        isAnalyzingAI={isAnalyzingAI}
                        onAutoFix={handleAutoFix}
                        isFixing={isFixing}
                        lang={lang}
                        onToggle={() => setIsAuditPanelOpen(false)}
                    />
                </div>
            </div>

            <SmartBuilderModal
                isOpen={isBuilderOpen}
                onClose={() => setIsBuilderOpen(false)}
                lang={lang}
                onApplyFlow={(newNodes, newEdges) => {
                    setNodes(newNodes);
                    setEdges(newEdges);
                    showNotification('AI Flow Generated Successfully', 'success');
                    setTimeout(() => runAuditOnImport(newNodes, newEdges), 100);
                }}
            />
        </div>
    );
}

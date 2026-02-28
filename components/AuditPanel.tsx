import { useState } from 'react';
import { AuditResult, AuditIssue, FluscopeNode } from '@/types/flow';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronRight, Lightbulb, ShieldCheck, Info, Sparkles, Zap, Wrench } from 'lucide-react';
import { Lang } from '@/components/LanguageSelector';

interface AuditPanelProps {
    result: AuditResult | null;
    onHighlightNodes?: (nodeIds: string[]) => void;
    nodes?: FluscopeNode[];
    isAnalyzingAI?: boolean;
    onAutoFix?: () => void;
    isFixing?: boolean;
    lang: Lang;
    onToggle?: () => void;
}

const AUDIT_DICT = {
    en: {
        noRun: "No Audit Run",
        noRunSub: "Click \"Run Audit\" to inspect your flow for structural issues and UX risks.",
        auditRes: "Audit Results",
        analysis: "ANALYSIS",
        robScore: "Robustness Score",
        howScore: "How is this score calculated?",
        critical: "Critical",
        warning: "Warning",
        suggestion: "Suggestion",
        issue: "Issue",
        issues: "Issues",
        graphFlow: "Structure integrity",
        noIssues: "This flow meets current structural standards.",
        ready: "No critical or warning-level risks detected.",
        aiInsight: "AI Insight",
        whyMatters: "Why this matters: ",
        quickFix: "Quick fix: ",
        affected: "Affected: ",
        autoFix: "Auto Fix",
        fixing: "Fixing..."
    },
    es: {
        noRun: "No Auditado",
        noRunSub: "Haz clic en \"Auditar\" para inspeccionar tu flujo por errores y cuellos de botella UX.",
        auditRes: "Resultados",
        analysis: "ANÁLISIS",
        robScore: "Nivel de Robustez",
        howScore: "¿Cómo se calcula?",
        critical: "Crítico",
        warning: "Cuidado",
        suggestion: "Sugerencia",
        issue: "Fallo",
        issues: "Fallos",
        graphFlow: "Integridad estructural",
        noIssues: "Este diagrama cumple los estándares estructurales.",
        ready: "No se han detectado riesgos críticos o peligrosos.",
        aiInsight: "Visión IA",
        whyMatters: "Por qué importa esto: ",
        quickFix: "Arreglo rápido: ",
        affected: "Afectados: ",
        autoFix: "Auto-Arreglar",
        fixing: "Arreglando..."
    },
    fr: {
        noRun: "Non audité",
        noRunSub: "Cliquez sur \"Auditer\" pour rechercher des risques UX et problèmes structurels.",
        auditRes: "Résultats d'Audit",
        analysis: "ANALYSE",
        robScore: "Score de Robustesse",
        howScore: "Comment est calculé ce score?",
        critical: "Critique",
        warning: "Alerte",
        suggestion: "Suggestion",
        issue: "Problème",
        issues: "Problèmes",
        graphFlow: "Intégrité structurelle",
        noIssues: "Ce flux répond aux normes structurelles actuelles.",
        ready: "Aucun risque critique ou niveau d'alerte détecté.",
        aiInsight: "Avis IA",
        whyMatters: "Pourquoi c'est important: ",
        quickFix: "Solution: ",
        affected: "Touchés: ",
        autoFix: "Réparation Auto",
        fixing: "Réparation..."
    }
};

export default function AuditPanel({ result, onHighlightNodes, nodes = [], isAnalyzingAI, onAutoFix, isFixing, lang, onToggle }: AuditPanelProps) {
    const t = AUDIT_DICT[lang] || AUDIT_DICT.en;

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <ShieldCheck className="w-10 h-10 text-slate-700 mb-4" />
                <h3 className="text-sm font-medium text-slate-400">{t.noRun}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-[200px]">
                    {t.noRunSub}
                </p>
            </div>
        );
    }

    const { score, issues, detectedFlowType, scoreLabel, aiConfidence } = result;

    const criticals = issues.filter((i) => i.type === 'critical');
    const warnings = issues.filter((i) => i.type === 'warning');
    const suggestions = issues.filter((i) => i.type === 'suggestion');

    // Score color logic Phase 2
    let scoreColor = 'text-emerald-400';
    if (score < 50) scoreColor = 'text-red-400';
    else if (score < 75) scoreColor = 'text-amber-400';
    else if (score < 90) scoreColor = 'text-yellow-300';

    const nodeGroups: Record<string, AuditIssue[]> = {};
    const globalIssues: AuditIssue[] = [];

    issues.forEach(issue => {
        if (issue.affectedNodes && issue.affectedNodes.length > 0) {
            issue.affectedNodes.forEach(nodeId => {
                if (!nodeGroups[nodeId]) nodeGroups[nodeId] = [];
                // Prevent duplicating the exact same issue if it already pushed correctly
                if (!nodeGroups[nodeId].find(i => i.id === issue.id)) {
                    nodeGroups[nodeId].push(issue);
                }
            });
        } else {
            globalIssues.push(issue);
        }
    });

    const sortOrder = { critical: 1, warning: 2, suggestion: 3 };

    const IssueCard = ({ issue }: { issue: AuditIssue }) => {
        const [expanded, setExpanded] = useState(false);
        let Icon = Lightbulb;
        let iconClass = 'text-blue-400 bg-blue-400/10';
        let borderClass = 'border-blue-500/30';

        if (issue.type === 'critical') {
            Icon = AlertCircle;
            iconClass = 'text-red-400 bg-red-400/10';
            borderClass = 'border-red-500/30 hover:border-red-500/60';
        } else if (issue.type === 'warning') {
            Icon = AlertTriangle;
            iconClass = 'text-amber-400 bg-amber-400/10';
            borderClass = 'border-amber-500/30 hover:border-amber-500/60';
        } else if (issue.type === 'suggestion') {
            borderClass = 'border-blue-500/30 hover:border-blue-500/60';
        }

        const handleClick = () => {
            setExpanded(!expanded);
            if (!expanded && onHighlightNodes && issue.affectedNodes.length > 0) {
                onHighlightNodes(issue.affectedNodes);
            } else if (expanded && onHighlightNodes) {
                onHighlightNodes([]); // clear highlight on collapse
            }
        };

        return (
            <div
                onClick={handleClick}
                className={`p-3 rounded-lg border bg-slate-800/30 ${borderClass} mb-3 flex gap-3 cursor-pointer transition-colors`}
            >
                <div className={`p-2 h-max rounded ${iconClass}`}>
                    <Icon size={16} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-semibold text-slate-200 leading-tight flex items-center gap-1.5 flex-wrap">
                                {issue.title}
                                {issue.isAiInsight && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase border border-indigo-500/30">
                                        <Sparkles size={10} />
                                        {t.aiInsight}
                                    </span>
                                )}
                            </h4>
                        </div>
                        {expanded ? <ChevronDown size={14} className="text-slate-500 shrink-0" /> : <ChevronRight size={14} className="text-slate-500 shrink-0" />}
                    </div>

                    {expanded && (
                        <div className="mt-2 animate-in slide-in-from-top-1 fade-in duration-200 space-y-2">
                            <p className="text-xs text-slate-400 leading-relaxed">{issue.description}</p>

                            {issue.isAiInsight && issue.whyItMatters && (
                                <div className="flex gap-1.5 items-start p-2 rounded-md bg-indigo-500/5 border border-indigo-500/15">
                                    <Zap size={11} className="text-indigo-400 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-indigo-300/80 italic leading-relaxed">
                                        <span className="font-semibold not-italic">{t.whyMatters}</span>
                                        {issue.whyItMatters}
                                    </p>
                                </div>
                            )}

                            {issue.isAiInsight && issue.quickFix && (
                                <div className="flex gap-1.5 items-start p-2 rounded-md bg-emerald-500/5 border border-emerald-500/15">
                                    <Wrench size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                                        <span className="font-semibold">{t.quickFix}</span>
                                        {issue.quickFix}
                                    </p>
                                </div>
                            )}

                            {issue.affectedNodes && issue.affectedNodes.length > 0 && (
                                <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5 flex-wrap pt-1">
                                    {t.affected}
                                    {issue.affectedNodes.map(id => (
                                        <span key={id} className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                            {id}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-[#0F172A] border-l border-slate-800 divide-y divide-slate-800">
            {/* Header */}
            <div className="px-5 pt-5 pb-4">
                {/* Row 1: title + collapse */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <ShieldCheck size={14} />
                        {t.auditRes}
                    </h2>
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
                            title="Collapse panel"
                        >
                            <ChevronRight size={14} />
                        </button>
                    )}
                </div>

                {/* Row 2: flow type + auto fix */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 leading-none">
                        {detectedFlowType} {t.analysis}
                    </span>
                    {issues.length > 0 && onAutoFix && (
                        <button
                            onClick={onAutoFix}
                            disabled={isFixing}
                            className="ml-auto text-[10px] uppercase font-bold px-2.5 py-1 rounded-md bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50 leading-none"
                        >
                            <img src="/logos/logo-isotope-1024x1024.png" alt="" width={12} height={12} className={isFixing ? 'animate-spin' : 'hidden'} />
                            {!isFixing && <Sparkles size={10} />}
                            {isFixing ? t.fixing : t.autoFix}
                        </button>
                    )}
                </div>
            </div>

            {/* Score + breakdown */}
            <div className="px-5 py-4">
                <div className="flex items-center justify-between py-2">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-xs tracking-widest text-slate-500 uppercase font-bold">{t.robScore}</div>
                        </div>
                        <div className={`text-6xl tracking-tighter font-black mt-1 ${scoreColor} transition-all duration-500`}>
                            {score}
                            <span className="text-2xl text-slate-600 font-medium tracking-normal ml-1">/100</span>
                        </div>
                        <div className={`text-sm tracking-wide mt-2 font-semibold ${scoreColor} opacity-90 transition-colors duration-500`}>
                            {scoreLabel}
                        </div>
                    </div>
                </div>

                <details className="mt-3 group cursor-pointer text-xs">
                    <summary className="flex items-center gap-1.5 text-slate-500 font-medium hover:text-slate-300 transition-colors list-none select-none [&::-webkit-details-marker]:hidden">
                        <Info size={12} />
                        {t.howScore}
                        <ChevronDown size={12} className="group-open:rotate-180 transition-transform ml-auto" />
                    </summary>
                    <div className="mt-2 p-4 bg-slate-900/50 rounded-xl space-y-3 text-slate-400 cursor-default">
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2"><AlertCircle size={14} className="text-red-400" /> {t.critical}</span> <span className="text-red-400 font-mono text-xs font-bold">-12</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-400" /> {t.warning}</span> <span className="text-amber-400 font-mono text-xs font-bold">-6</span></div>
                        <div className="flex justify-between items-center"><span className="flex items-center gap-2"><Lightbulb size={14} className="text-blue-400" /> {t.suggestion}</span> <span className="text-blue-400 font-mono text-xs font-bold">-3</span></div>
                    </div>
                </details>
            </div>

            {/* Issues List */}
            <div className="flex-1 overflow-y-auto p-6 pt-0 mt-6 md:pb-24">
                <div className="space-y-6">

                    {Object.keys(nodeGroups).map((nodeId, idx) => {
                        const nodeIssues = nodeGroups[nodeId].sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);
                        const nodeLabel = nodes.find(n => n.id === nodeId)?.data.label || 'Unnamed Node';

                        return (
                            <div key={nodeId} className={idx !== 0 ? 'pt-6 border-t border-slate-800/50' : ''}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">
                                        {nodeLabel}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full">
                                        {nodeIssues.length} {nodeIssues.length === 1 ? t.issue : t.issues}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {nodeIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
                                </div>
                            </div>
                        );
                    })}

                    {globalIssues.length > 0 && (
                        <div className={Object.keys(nodeGroups).length > 0 ? 'pt-6 border-t border-slate-800/50' : ''}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">
                                    {t.graphFlow}
                                </h3>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full">
                                    {globalIssues.length} {globalIssues.length === 1 ? t.issue : t.issues}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {globalIssues.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]).map(issue => <IssueCard key={issue.id} issue={issue} />)}
                            </div>
                        </div>
                    )}

                    {issues.length === 0 && (
                        <div className="text-center py-6">
                            <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-3">
                                <ShieldCheck size={24} />
                            </div>
                            <p className="text-emerald-400 font-medium text-sm">{t.noIssues}</p>
                            <p className="text-slate-500 text-xs mt-1">{t.ready}</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
}

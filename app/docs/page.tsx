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
        footerTags: ["Non-relational", "Ephemeral", "Client-bound"],
        engineeringDocs: "Engineering Docs",
        intro: "Core Specification",
        helpTitle: "Technical Support",
        helpDesc: "System status and architecture queries.",
        supportLink: "Support Channel →",
        status: "Status: v2.4.0 Stable // Client-Bound Distribution"
    },
    es: {
        navHome: "Inicio",
        navKb: "Core Docs",
        navDiscord: "Discord",
        btnCanvas: "Abrir Workspace",
        footerText: "Fluscope System Docs © 2025",
        footerTags: ["No relacional", "Efemero", "Cliente-bound"],
        engineeringDocs: "Docs de Ingeniería",
        intro: "Especificación Core",
        helpTitle: "Soporte Técnico",
        helpDesc: "Consultas sobre arquitectura y estado del sistema.",
        supportLink: "Canal de Soporte →",
        status: "Estado: v2.4.0 Estable // Distribución en Cliente"
    },
    fr: {
        navHome: "Accueil",
        navKb: "Core Docs",
        navDiscord: "Discord",
        btnCanvas: "Ouvrir Workspace",
        footerText: "Fluscope System Docs © 2025",
        footerTags: ["Non relationnel", "Éphémère", "Côté-client"],
        engineeringDocs: "Docs d'Ingénierie",
        intro: "Spécification Core",
        helpTitle: "Support Technique",
        helpDesc: "Requêtes sur l'architecture et l'état du système.",
        supportLink: "Canal de Support →",
        status: "Statut : v2.4.0 Stable // Distribution Côté Client"
    }
};

const DOCS_CONTENT = {
    en: {
        architecture: {
            title: "System Architecture",
            overviewTitle: "Overview",
            overviewBody1: "Fluscope is architected as a thin, highly interactive client for structural graph validation. It operates on a zero-backend principle, leveraging heavy client-side compute for real-time rule evaluation and state management.",
            overviewBody2: "The system is divided into three primary modules: the Interactive Canvas Layer, the Deterministic Validation Engine, and the Semantic AI Service.",
            interfaceTitle: "Interface Layer",
            interfaceDesc: "Built on React Flow, utilizing a custom-built hook system for state synchronization and a reactive event bus for audit triggering.",
            dataTitle: "Ephemeral Data",
            dataDesc: "State is strictly local. Persistent storage is handled via browser LocalStorage with automatic LZ-based compression for large graphs."
        },
        engine: {
            title: "Deterministic Logic Engine",
            traversalTitle: "Graph Traversal",
            traversalBody: "The first layer of audit uses a custom BFS-based (Breadth-First Search) traversal algorithm to analyze the canvas graph as a Directed Acyclic Graph (DAG).",
            rulesTitle: "Key validation rules include:",
            rule1: "Orphaned Nodes: Nodes with in-degree = 0 (excluding start points).",
            rule2: "Logical Dead-ends: Termination points that are not explicitly marked as 'Terminal' nodes.",
            rule3: "Cyclic Redundancy: Detection of infinite loops in state transitions.",
            rule4: "Handle Saturation: Verification of minimum required outgoing connections for Decision nodes."
        },
        ai: {
            title: "Semantic AI Deep Audit",
            knowledgeTitle: "Knowledge Retrieval",
            knowledgeBody: "Unlike structural rules, the Semantic Layer uses LLMs (GPT-4o-mini) to evaluate the *intent* of each node.",
            knowledgeBody2: "We transform the visual graph into a structured semantic prompt focusing on SECURITY, UX_FRICTION, and EDGE_CASES.",
            knowledgeBody3: "The AI then identifies logical gaps such as missing 'Forgot Password' paths or the absence of SSL/MFA requirements in sensitive flows.",
            builderTitle: "Smart Builder",
            builderBody: "The AI Smart Builder parses natural language into a JSON flow description, which is then mapped to the React Flow coordinate system using a force-directed layout approximation."
        },
        data: {
            title: "Schema & Persistence",
            schemaTitle: "JSON Schema",
            schemaBody: "Fluscope exports adhere to a standard JSON schema, ensuring compatibility across sessions.",
            syncTitle: "Local Storage Synchronization",
            syncBody: "Changes are debounced and synced every 1500ms to `fluscope-flow-data`. This ensures data persistence across browser restarts without requiring an account or server connection."
        },
        mechanics: {
            title: "Canvas Mechanics",
            laserTitle: "Interactive Presentation",
            laserBody: "Laser Pointer Mode: Implemented using a custom Canvas API layer overlay. Points are tracked with a TTL of 2.5s and rendered with a Gaussian blur shader to simulate a laser trail.",
            layoutTitle: "Auto-Layout Engine",
            layoutBody: "Uses a proprietary implementation of the Dagre layout algorithm. It calculates optimal rank-based positioning to minimize edge crossings while maintaining a consistent horizontal flow direction."
        },
        deployment: {
            title: "Runtime & Distribution",
            runtimeTitle: "Zero-Backend Runtime",
            runtimeBody: "Fluscope is a strictly static distribution. All logic, from graph layout to the rule engine, runs in the client's VM. API calls are restricted to the AI Audit service endpoints.",
            techList: ["Framework: Next.js 15 (App Router)", "State: React Hooks + Flow Context", "Styling: Tailwind CSS", "Iconography: Lucide React"]
        }
    },
    es: {
        architecture: {
            title: "Arquitectura del Sistema",
            overviewTitle: "Resumen",
            overviewBody1: "Fluscope está diseñado como un cliente ligero y altamente interactivo para la validación estructural de grafos. Opera bajo el principio de 'cero-backend', aprovechando el cómputo en el cliente para la evaluación de reglas en tiempo real.",
            overviewBody2: "El sistema se divide en tres módulos principales: la Capa de Canvas Interactivo, el Motor de Validación Determinatura y el Servicio de IA Semántica.",
            interfaceTitle: "Capa de Interfaz",
            interfaceDesc: "Basado en React Flow, utilizando un sistema de hooks personalizado para la sincronización de estado y un bus de eventos reactivo para disparar auditorías.",
            dataTitle: "Datos Efímeros",
            dataDesc: "El estado es estrictamente local. El almacenamiento persistente se gestiona mediante el LocalStorage del navegador con compresión para grafos grandes."
        },
        engine: {
            title: "Motor de Lógica Determinista",
            traversalTitle: "Recorrido de Grafos",
            traversalBody: "La primera capa de auditoría utiliza un algoritmo de recorrido basado en BFS (Breadth-First Search) para analizar el grafo del canvas como un Grafo Acíclico Dirigido (DAG).",
            rulesTitle: "Las reglas clave de validación incluyen:",
            rule1: "Nodos Huérfanos: Nodos con grado de entrada = 0 (excluyendo puntos de inicio).",
            rule2: "Callejones sin Salida: Puntos de terminación que no están marcados explícitamente como nodos 'Terminal'.",
            rule3: "Redundancia Cíclica: Detección de bucles infinitos en las transiciones de estado.",
            rule4: "Saturación de Conexiones: Verificación de conexiones de salida mínimas para nodos de Decisión."
        },
        ai: {
            title: "Auditoría Profunda de IA Semántica",
            knowledgeTitle: "Recuperación de Conocimiento",
            knowledgeBody: "A diferencia de las reglas estructurales, la Capa Semántica utiliza LLMs (GPT-4o-mini) para evaluar la *intención* de cada nodo.",
            knowledgeBody2: "Transformamos el grafo visual en un prompt semántico estructurado centrado en SEGURIDAD, FRICCIÓN UX y CASOS BORDE.",
            knowledgeBody3: "La IA identifica lagunas lógicas como rutas de 'Olvidé mi contraseña' faltantes o la ausencia de requisitos SSL/MFA en flujos sensibles.",
            builderTitle: "Smart Builder",
            builderBody: "El AI Smart Builder analiza el lenguaje natural para generar una descripción de flujo JSON, que luego se mapea al sistema de coordenadas de React Flow."
        },
        data: {
            title: "Esquema y Persistencia",
            schemaTitle: "Esquema JSON",
            schemaBody: "Las exportaciones de Fluscope se adhieren a un esquema JSON estándar, asegurando la compatibilidad entre sesiones.",
            syncTitle: "Sincronización en LocalStorage",
            syncBody: "Los cambios se sincronizan cada 1500ms con `fluscope-flow-data`. Esto asegura la persistencia sin necesidad de una cuenta o conexión al servidor."
        },
        mechanics: {
            title: "Mecánicas del Canvas",
            laserTitle: "Presentación Interactiva",
            laserBody: "Modo Puntero Láser: Implementado mediante una capa de Canvas API personalizada. Los puntos tienen un TTL de 2.5s y se renderizan con un shader de desenfoque gaussiano.",
            layoutTitle: "Motor de Auto-Layout",
            layoutBody: "Utiliza una implementación del algoritmo Dagre. Calcula el posicionamiento óptimo para minimizar el cruce de líneas manteniendo una dirección horizontal consistente."
        },
        deployment: {
            title: "Runtime y Distribución",
            runtimeTitle: "Runtime sin Backend",
            runtimeBody: "Fluscope es una distribución estrictamente estática. Toda la lógica se ejecuta en la VM del cliente. Las llamadas a API se restringen a los endpoints de la auditoría IA.",
            techList: ["Framework: Next.js 15 (App Router)", "Estado: React Hooks + Flow Context", "Eestilos: Tailwind CSS", "Iconografía: Lucide React"]
        }
    },
    fr: {
        architecture: {
            title: "Architecture du Système",
            overviewTitle: "Aperçu",
            overviewBody1: "Fluscope est architecturé comme un client léger et hautement interactif pour la validation structurelle de graphes. Il fonctionne sur le principe du 'zéro-backend', exploitant le calcul côté client pour l'évaluation des règles en temps réel.",
            overviewBody2: "Le système est divisé en trois modules principaux : la couche Canvas interactif, le moteur de validation déterministe et le service d'IA sémantique.",
            interfaceTitle: "Couche d'Interface",
            interfaceDesc: "Construit sur React Flow, utilisant un système de hooks personnalisé pour la synchronisation d'état et un bus d'événements réactif pour le déclenchement des audits.",
            dataTitle: "Données Éphémères",
            dataDesc: "L'état est strictement local. Le stockage persistant est géré via le LocalStorage du navigateur avec une compression automatique pour les grands graphes."
        },
        engine: {
            title: "Moteur Logique Déterministe",
            traversalTitle: "Parcours de Graphe",
            traversalBody: "La première couche d'audit utilise un algorithme de parcours personnalisé basé sur BFS (Breadth-First Search) pour analyser le graphe du canvas comme un graphe acyclique dirigé (DAG).",
            rulesTitle: "Les principales règles de validation incluent :",
            rule1: "Nœuds Orphelins : Nœuds avec un degré entrant = 0 (excluant les points de départ).",
            rule2: "Impasses Logiques : Points de terminaison qui ne sont pas explicitement marqués comme nœuds 'Terminal'.",
            rule3: "Redondance Cyclique : Détection de boucles infinies dans les transitions d'état.",
            rule4: "Saturation des Poignées : Vérification des connexions sortantes minimales pour les nœuds de Décision."
        },
        ai: {
            title: "Audit Profond IA Sémantique",
            knowledgeTitle: "Récupération de Connaissances",
            knowledgeBody: "Contrairement aux règles structurelles, la couche sémantique utilise des LLM (GPT-4o-mini) pour évaluer l'intention de chaque nœud.",
            knowledgeBody2: "Nous transformons le graphe visuel en un prompt sémantique structuré axé sur la SÉCURITÉ, la FRICTION UX et les CAS LIMITES.",
            knowledgeBody3: "L'IA identifie alors les lacunes logiques telles que les parcours 'Mot de passe oublié' manquants ou l'absence d'exigences SSL/MFA.",
            builderTitle: "Smart Builder",
            builderBody: "L'AI Smart Builder analyse le langage naturel en une description de flux JSON, qui est ensuite mappée au système de coordonnées React Flow."
        },
        data: {
            title: "Schéma et Persistance",
            schemaTitle: "Schéma JSON",
            schemaBody: "Les exportations Fluscope respectent un schéma JSON standard, garantissant la compatibilité entre les sessions.",
            syncTitle: "Synchronisation LocalStorage",
            syncBody: "Les modifications sont synchronisées toutes les 1500 ms vers `fluscope-flow-data`. Cela garantit la persistance des données sans compte utilisateur."
        },
        mechanics: {
            title: "Mécaniques du Canvas",
            laserTitle: "Présentation Interactive",
            laserBody: "Mode Pointeur Laser : Implémenté via une couche API Canvas personnalisée. Les points ont un TTL de 2,5 s et sont rendus avec un shader de flou gaussien.",
            layoutTitle: "Moteur d'Auto-Layout",
            layoutBody: "Utilise une implémentation propriétaire de l'algorithme Dagre. Il calcule le positionnement optimal pour minimiser les croisements de lignes."
        },
        deployment: {
            title: "Runtime et Distribution",
            runtimeTitle: "Runtime Zéro-Backend",
            runtimeBody: "Fluscope est une distribution strictement statique. Toute la logique s'exécute dans la VM du client. Les appels API sont restreints aux services d'audit IA.",
            techList: ["Framework : Next.js 15 (App Router)", "État : React Hooks + Flow Context", "Styling : Tailwind CSS", "Iconographie : Lucide React"]
        }
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
    const c = DOCS_CONTENT[lang];

    const sections = [
        { id: 'architecture', title: c.architecture.title, icon: <Layers size={16} /> },
        { id: 'engine', title: c.engine.title, icon: <Binary size={16} /> },
        { id: 'ai-layer', title: c.ai.title, icon: <Cpu size={16} /> },
        { id: 'data', title: c.data.title, icon: <Database size={16} /> },
        { id: 'mechanics', title: c.mechanics.title, icon: <Activity size={16} /> },
        { id: 'deployment', title: c.deployment.title, icon: <Terminal size={16} /> },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'architecture':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{c.architecture.title.split(' ')[0]} <span className="text-indigo-400">{c.architecture.title.split(' ').slice(1).join(' ')}</span></h1>
                        <p className="text-slate-500 mb-10 font-mono text-sm italic">{t.status}</p>

                        <TechBlock title={c.architecture.overviewTitle} icon={Layers}>
                            <p>{c.architecture.overviewBody1}</p>
                            <p>{c.architecture.overviewBody2}</p>
                        </TechBlock>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Code size={14} className="text-emerald-400" /> {c.architecture.interfaceTitle}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{c.architecture.interfaceDesc}</p>
                            </div>
                            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Database size={14} className="text-fuchsia-400" /> {c.architecture.dataTitle}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{c.architecture.dataDesc}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'engine':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">{c.engine.title.split(' ').slice(0, -1).join(' ')} <span className="text-emerald-400">{c.engine.title.split(' ').slice(-1)}</span></h1>

                        <TechBlock title={c.engine.traversalTitle} icon={Binary}>
                            <p>{c.engine.traversalBody}</p>
                            <p>{c.engine.rulesTitle}</p>
                            <ul className="list-disc ml-4 space-y-2 text-xs">
                                <li><span className="text-slate-200">{c.engine.rule1.split(':')[0]}:</span>{c.engine.rule1.split(':')[1]}</li>
                                <li><span className="text-slate-200">{c.engine.rule2.split(':')[0]}:</span>{c.engine.rule2.split(':')[1]}</li>
                                <li><span className="text-slate-200">{c.engine.rule3.split(':')[0]}:</span>{c.engine.rule3.split(':')[1]}</li>
                                <li><span className="text-slate-200">{c.engine.rule4.split(':')[0]}:</span>{c.engine.rule4.split(':')[1]}</li>
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
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">{c.ai.title.split(' ').slice(0, -1).join(' ')} <span className="text-fuchsia-400">{c.ai.title.split(' ').slice(-1)}</span></h1>

                        <TechBlock title={c.ai.knowledgeTitle} icon={Cpu}>
                            <p>{c.ai.knowledgeBody}</p>
                            <p>{c.ai.knowledgeBody2}</p>
                            <p>{c.ai.knowledgeBody3}</p>
                        </TechBlock>

                        <TechBlock title={c.ai.builderTitle} icon={Sparkles}>
                            <p>{c.ai.builderBody}</p>
                        </TechBlock>
                    </div>
                );
            case 'data':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">{c.data.title.split(' ').slice(0, -1).join(' ')} <span className="text-sky-400">{c.data.title.split(' ').slice(-1)}</span></h1>

                        <TechBlock title={c.data.schemaTitle} icon={Code}>
                            <p>{c.data.schemaBody}</p>
                            <CodeBlock code={`{
  "nodes": [ { "id": "uuid", "type": "screenNode", "data": { "label": "string" } } ],
  "edges": [ { "id": "uuid", "source": "id", "target": "id" } ],
  "metadata": { "version": "1.0", "timestamp": "ISO8601" }
}`} />
                        </TechBlock>

                        <TechBlock title={c.data.syncTitle} icon={Database}>
                            <p>{c.data.syncBody}</p>
                        </TechBlock>
                    </div>
                );
            case 'mechanics':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">{c.mechanics.title.split(' ').slice(0, -1).join(' ')} <span className="text-amber-400">{c.mechanics.title.split(' ').slice(-1)}</span></h1>

                        <TechBlock title={c.mechanics.laserTitle} icon={MousePointer2}>
                            <p>{c.mechanics.laserBody}</p>
                        </TechBlock>

                        <TechBlock title={c.mechanics.layoutTitle} icon={Zap}>
                            <p>{c.mechanics.layoutBody}</p>
                        </TechBlock>
                    </div>
                );
            case 'deployment':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">{c.deployment.title.split(' ').slice(0, -1).join(' ')} <span className="text-slate-400">{c.deployment.title.split(' ').slice(-1)}</span></h1>

                        <TechBlock title={c.deployment.runtimeTitle} icon={Terminal}>
                            <p>{c.deployment.runtimeBody}</p>
                            <ul className="list-disc ml-4 space-y-1 text-xs">
                                {c.deployment.techList.map((t, i) => <li key={i}>{t}</li>)}
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
            {/* Unified Header */}
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
                        <span className="px-2.5 py-0.5 text-[10px] font-black text-slate-400 bg-slate-800 rounded border border-slate-700 uppercase tracking-widest">{t.engineeringDocs}</span>
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
                    <div className="text-[10px] uppercase font-black text-slate-600 tracking-[0.3em] mb-6">{t.intro}</div>
                    <nav className="space-y-1">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setActiveSection(s.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold transition-all text-left ${activeSection === s.id ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
                            >
                                {s.icon} {s.title}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-12 p-5 bg-slate-900 border border-slate-800 rounded-xl">
                        <h5 className="text-white text-[10px] font-black uppercase tracking-widest mb-2">{t.helpTitle}</h5>
                        <p className="text-slate-600 text-[10px] mb-3 leading-relaxed">{t.helpDesc}</p>
                        <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-[10px] font-bold hover:underline">{t.supportLink}</a>
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

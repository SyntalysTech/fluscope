"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, GitBranch, ShieldAlert, Sparkles, Zap, Lock, RefreshCw, Download, Brain, ChevronDown, Github, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LanguageSelector, Lang } from '@/components/LanguageSelector';
import { DiscordIcon } from '@/components/DiscordIcon';

// ─── Translations & Dictionaries ─────────────────────────────────────────────

const DICT = {
  en: {
    navFeatures: "Features",
    navHow: "How it works",
    navDocs: "Docs",
    navCanvas: "Open Canvas →",
    heroBadge: "AI-powered · Rule engine · Zero backend",
    heroTitle1: "Design flows.",
    heroTitle2: "Ship with confidence.",
    heroSubtitle: "Fluscope is a visual product flow canvas with a dual-layer audit engine. Draw your UX flow, detect dead ends, auth gaps and security issues in under a second — then run a GPT-4o-mini deep audit from three expert perspectives.",
    heroCta: "Open Canvas — it's free",
    heroSubtext: "No signup · No database · Runs in your browser",
    demoBadge: "Live animated demo · Auth flow",
    proofItems: [
      '⚡ Rule engine fires in < 10ms',
      '🤖 Deep audit via GPT-4o-mini',
      '🔒 No backend — fully client-side',
      '📁 Import / Export as JSON',
      '🖊️ Laser pointer & annotation mode',
      '💾 Auto-saves to localStorage',
    ],
    featuresTitle: "A complete flow auditing workspace",
    featuresSubtitle: "Everything you need to go from flow idea to production-ready design — without writing a single line of code.",
    howTitle: "How it works",
    howSubtitle: "Three focused steps from blank canvas to audited flow.",
    typesTitle: "Domain-aware audit rules",
    typesSubtitle: "Fluscope auto-detects your flow type and applies specialized rule sets on top of the core graph analysis.",
    ctaTitle1: "Stop shipping broken flows.",
    ctaTitle2: "Start auditing.",
    ctaSubtitle: "Your engineers shouldn't be the ones discovering missing password recovery or no-logout paths. Fluscope catches those before kickoff.",
    ctaButton: "Open Canvas — free forever",
    footerText: "Fluscope © 2025 — Built for product teams.",
    footerTags: ["No database", "No tracking", "100% client-side"]
  },
  es: {
    navFeatures: "Características",
    navHow: "Cómo funciona",
    navDocs: "Docs",
    navCanvas: "Abrir Canvas →",
    heroBadge: "IA · Motor de reglas · Sin backend",
    heroTitle1: "Diseña flujos.",
    heroTitle2: "Lanza con seguridad.",
    heroSubtitle: "Fluscope es un canvas de flujos de producto con un motor de auditoría de doble capa. Dibuja tu flujo UX, detecta callejones sin salida, huecos de auth y problemas de seguridad en menos de un segundo — y luego lanza una auditoría profunda con GPT-4o-mini desde tres perspectivas expertas.",
    heroCta: "Abrir Canvas — es gratis",
    heroSubtext: "Sin registro · Sin base de datos · Corre en tu navegador",
    demoBadge: "Demo animada en vivo · Flujo de Auth",
    proofItems: [
      '⚡ Motor de reglas en < 10ms',
      '🤖 Auditoría profunda con GPT-4o-mini',
      '🔒 Sin backend — 100% en el cliente',
      '📁 Importar / Exportar JSON',
      '🖊️ Puntero láser y modo anotación',
      '💾 Auto-guardado en localStorage',
    ],
    featuresTitle: "Un workspace de auditoría de flujos completo",
    featuresSubtitle: "Todo lo que necesitas para ir de idea de flujo a diseño listo para producción, sin escribir una sola línea de código.",
    howTitle: "Cómo funciona",
    howSubtitle: "Tres pasos claros del canvas vacío al flujo auditado.",
    typesTitle: "Reglas de auditoría por dominio",
    typesSubtitle: "Fluscope auto-detecta el tipo de flujo y aplica conjuntos de reglas especializados sobre el análisis de grafo base.",
    ctaTitle1: "Deja de lanzar flujos rotos.",
    ctaTitle2: "Empieza a auditar.",
    ctaSubtitle: "Tus desarrolladores no deberían ser quienes descubran que falta el recuperar contraseña o que no hay cierre de sesión. Fluscope lo caza antes del kickoff.",
    ctaButton: "Abrir Canvas — gratis para siempre",
    footerText: "Fluscope © 2025 — Hecho para equipos de producto.",
    footerTags: ["Sin base de datos", "Sin rastreo", "100% del lado del cliente"]
  },
  fr: {
    navFeatures: "Fonctionnalités",
    navHow: "Comment ça marche",
    navDocs: "Docs",
    navCanvas: "Ouvrir Canvas →",
    heroBadge: "IA · Moteur de règles · Zéro backend",
    heroTitle1: "Concevez vos flux.",
    heroTitle2: "Livrez en confiance.",
    heroSubtitle: "Fluscope est un canvas visuel de flux produit avec un moteur d'audit bicouche. Dessinez votre flux UX, détectez les impasses, failles d'auth et risques sécurité en moins d'une seconde — puis lancez un audit profond via GPT-4o-mini selon trois perspectives expertes.",
    heroCta: "Ouvrir Canvas — c'est gratuit",
    heroSubtext: "Pas d'inscription · Pas de BDD · Tourne dans votre navigateur",
    demoBadge: "Démo animée en direct · Flux d'authentification",
    proofItems: [
      '⚡ Moteur de règles en < 10ms',
      '🤖 Audit profond via GPT-4o-mini',
      '🔒 Zéro backend — 100% côté client',
      '📁 Import / Export JSON',
      '🖊️ Pointeur laser & mode annotation',
      '💾 Sauvegarde auto en localStorage',
    ],
    featuresTitle: "Un espace de travail d'audit de flux complet",
    featuresSubtitle: "Tout ce qu'il faut pour passer d'une idée de flux à un design prêt pour la production — sans écrire une seule ligne de code.",
    howTitle: "Comment ça marche",
    howSubtitle: "Trois étapes claires du canvas vide au flux audité.",
    typesTitle: "Règles d'audit par domaine",
    typesSubtitle: "Fluscope détecte automatiquement le type de flux et applique des ensembles de règles spécialisés sur l'analyse de graphe de base.",
    ctaTitle1: "Arrêtez de livrer des flux cassés.",
    ctaTitle2: "Commencez à auditer.",
    ctaSubtitle: "Vos développeurs ne devraient pas être ceux qui découvrent qu'il manque la récupération de mot de passe ou la déconnexion. Fluscope les attrape avant le kickoff.",
    ctaButton: "Ouvrir Canvas — gratuit pour toujours",
    footerText: "Fluscope © 2025 — Conçu pour les équipes produit.",
    footerTags: ["Sans base de données", "Pas de tracking", "100% côté client"]
  }
};

const TRANSLATED_FEATURES: Record<Lang, { title: string, desc: string }[]> = {
  en: [
    { title: 'AI Smart Builder', desc: 'Describe your flow in plain text. Fluscope generates a full graph with intelligent connections and node placement, getting you to 80% completion in seconds.' },
    { title: 'Deterministic Rules', desc: 'Rule engine fires in < 10ms, traversing your entire graph to find dead ends, missing error states, and unhandled branching logic.' },
    { title: 'Auto-Layout Engine', desc: 'Organize complex or AI-generated flows instantly. Our layout algorithm optimizes node positioning for maximum horizontal readability.' },
    { title: 'Dual-layer Audit', desc: 'Deterministic rule engine fires in < 10ms, then GPT-4o-mini runs semantic analysis from architect, security, and UX perspectives.' },
    { title: 'Robustness Score', desc: '0–100 score with severity-weighted deductions per issue. See exactly what is dragging your score down and why.' },
    { title: 'Auto-fix Engine', desc: 'One-click auto-fix for common structural issues. Fluscope rewrites the broken portions of your graph automatically.' },
    { title: 'Export & Import', desc: 'Download flows as structured JSON. Import any compatible flow file. Share with your team or archive for later.' },
    { title: 'Session Persistence', desc: 'Every change auto-saves to localStorage. Close the tab, reopen tomorrow — your flow is exactly where you left it.' },
  ],
  es: [
    { title: 'Constructor IA', desc: 'Describe tu flujo en texto plano. Fluscope genera un grafo completo con conexiones inteligentes y posicionamiento de nodos en segundos.' },
    { title: 'Reglas Deterministas', desc: 'El motor de reglas recorre tu grafo en < 10ms para encontrar callejones sin salida, estados de error faltantes y lógica de ramificación no gestionada.' },
    { title: 'Motor de Auto-layout', desc: 'Organiza flujos complejos al instante. Nuestro algoritmo optimiza la posición de los nodos para una legibilidad horizontal máxima.' },
    { title: 'Auditoría Doble Capa', desc: 'Motor de reglas determinista en < 10ms, luego GPT-4o-mini hace análisis semántico desde perspectivas de arquitecto, seguridad y UX.' },
    { title: 'Puntuación de Robustez', desc: 'Score de 0 a 100 con penalizaciones ponderadas por severidad. Ves exactamente qué baja tu puntuación y por qué.' },
    { title: 'Motor de Auto-fix', desc: 'Auto-corrección en un clic para problemas estructurales comunes. Fluscope reescribe las partes rotas de tu grafo automáticamente.' },
    { title: 'Exportar e Importar', desc: 'Descarga flujos como JSON estructurado. Importa cualquier archivo de flujo. Comparte con tu equipo o archiva.' },
    { title: 'Persistencia de Sesión', desc: 'Cada cambio se auto-guarda en localStorage. Cierra la pestaña y vuelve mañana — tu flujo está exactamente donde lo dejaste.' },
  ],
  fr: [
    { title: 'Canvas Visuel', desc: "Nœuds Écran, Décision et Terminal. Glissez-déposez, connectez depuis n'importe quelle poignée et appliquez l'auto-layout en un clic." },
    { title: 'Constructeur IA', desc: 'Décrivez votre flux en texte libre. Fluscope génère un graphe complet avec des connexions intelligentes et un placement des nœuds en quelques secondes.' },
    { title: 'Règles Déterministes', desc: 'Le moteur de règles parcourt votre graphe en < 10ms pour trouver les impasses, les états d\'erreur manquants et la logique non gérée.' },
    { title: 'Moteur d\'Auto-layout', desc: 'Organisez instantanément des flux complexes. Notre algorithme optimise le positionnement des nœuds pour une lisibilité horizontale maximale.' },
    { title: 'Audit Bicouche', desc: 'Moteur de règles déterministe en < 10ms, puis GPT-4o-mini analyse sémantiquement selon les perspectives architecte, sécurité et UX.' },
    { title: 'Score de Robustesse', desc: 'Score de 0 à 100 avec déductions pondérées par sévérité. Voyez exactement ce qui fait baisser votre score et pourquoi.' },
    { title: "Moteur d'Auto-correction", desc: 'Correction automatique en un clic pour les problèmes structurels courants. Fluscope réécrit les parties cassées de votre graphe automatiquement.' },
    { title: 'Export & Import', desc: 'Téléchargez les flux en JSON structuré. Importez tout fichier de flux compatible. Partagez avec votre équipe ou archivez.' },
    { title: 'Persistance de Session', desc: 'Chaque modification est sauvegardée automatiquement dans le localStorage. Fermez l\'onglet, revenez demain — votre flux est intact.' },
  ]
};

const TRANSLATED_HOW: Record<Lang, { title: string, desc: string }[]> = {
  en: [
    { title: 'Build your flow', desc: 'Add Screen, Decision and Terminal nodes from the bottom toolbar. Drag to connect. Use the AI Smart Builder to generate a full flow from a text prompt.' },
    { title: 'Audit it', desc: 'Hit Audit Flow. The rule engine checks graph integrity instantly. Then GPT-4o-mini runs a deep semantic review from architect, security, and UX angles.' },
    { title: 'Fix and export', desc: 'Each issue includes a severity badge, explanation, and one-click auto-fix. Export the audited flow as JSON or screenshot when done.' }
  ],
  es: [
    { title: 'Construye tu flujo', desc: 'Añade nodos de Pantalla, Decisión y Terminal desde la barra inferior. Arrastra para conectar. Usa el Constructor IA para generar un flujo Completo desde un prompt.' },
    { title: 'Audítalo', desc: 'Dale a Auditar Flujo. El motor de reglas comprueba la integridad del grafo al instante. GPT-4o-mini hace una revisión semántica profunda desde perspectivas de arquitecto, seguridad y UX.' },
    { title: 'Arregla y exporta', desc: 'Cada problema incluye un badge de severidad, explicación y auto-fix en un clic. Exporta el flujo auditado como JSON o captura cuando termines.' }
  ],
  fr: [
    { title: 'Construisez votre flux', desc: "Ajoutez des nœuds Écran, Décision et Terminal depuis la barre du bas. Glissez pour connecter. Utilisez le Builder IA pour générer un flux complet depuis un prompt texte." },
    { title: 'Auditez-le', desc: 'Cliquez sur Auditer le Flux. Le moteur de règles vérifie l\'intégrité du graphe instantanément. GPT-4o-mini effectue une revue sémantique profonde depuis les angles architecte, sécurité et UX.' },
    { title: 'Corrigez et exportez', desc: 'Chaque problème inclut un badge de sévérité, une explication et un auto-fix en un clic. Exportez le flux audité en JSON ou en capture quand vous avez terminé.' }
  ]
};

const TRANSLATED_TYPES: Record<Lang, { name: string, desc: string }[]> = {
  en: [
    { name: 'AUTH', desc: 'Login, signup, password recovery, session handling, logout paths, and permission gates.' },
    { name: 'CHECKOUT', desc: 'Cart, payment, order confirmation, and failure/recovery paths. Revenue-critical by definition.' },
    { name: 'ONBOARDING', desc: 'First-run experiences, activation steps, tutorial flows, and skip-path edge cases.' },
    { name: 'GENERIC', desc: 'Any custom product flow. Core graph rules apply: dead ends, isolation, connectivity, and ux friction.' },
  ],
  es: [
    { name: 'AUTH', desc: 'Login, registro, recuperación de contraseña, manejo de sesión, cierre de sesión y puertas de permisos.' },
    { name: 'CHECKOUT', desc: 'Carrito, pago, confirmación de pedido, y rutas de fallo/recuperación. Crítico por definición.' },
    { name: 'ONBOARDING', desc: 'Primera ejecución, pasos de activación, flujos tutoriales y casos borde de rutas de salto.' },
    { name: 'GENÉRICO', desc: 'Cualquier flujo de producto personalizado. Reglas de grafo principales: callejones sin salida, aislamiento, conectividad y fricción UX.' },
  ],
  fr: [
    { name: "AUTH", desc: "Connexion, inscription, récupération de mot de passe, gestion de session, déconnexion et portes de permissions." },
    { name: "CHECKOUT", desc: "Panier, paiement, confirmation de commande, et parcours d'échec/récupération. Critique par définition." },
    { name: "ONBOARDING", desc: "Première exécution, étapes d'activation, flux tutoriels et cas limites de parcours de saut." },
    { name: "GÉNÉRIQUE", desc: "Tout flux produit personnalisé. Règles de graphe principales : impasses, isolation, connectivité et friction UX." }
  ]
};

// ─── Data arrays ──────────────────────────────────────────────────────────────
const ICONS_FEATURES = [GitBranch, ShieldAlert, Brain, Zap, Lock, Download, RefreshCw, CheckCircle2];
const COLORS_FEATURES = [
  { c: 'text-indigo-400', b: 'bg-indigo-500/10' },
  { c: 'text-red-400', b: 'bg-red-500/10' },
  { c: 'text-purple-400', b: 'bg-purple-500/10' },
  { c: 'text-amber-400', b: 'bg-amber-500/10' },
  { c: 'text-emerald-400', b: 'bg-emerald-500/10' },
  { c: 'text-sky-400', b: 'bg-sky-500/10' },
  { c: 'text-slate-400', b: 'bg-slate-500/10' },
  { c: 'text-teal-400', b: 'bg-teal-500/10' },
];

const ICONS_HOW = [GitBranch, ShieldAlert, CheckCircle2];
const COLORS_HOW = [
  { c: 'text-indigo-400', b: 'bg-indigo-500/10' },
  { c: 'text-violet-400', b: 'bg-violet-500/10' },
  { c: 'text-emerald-400', b: 'bg-emerald-500/10' }
];

const COLORS_TYPES = [
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-slate-600/50 text-slate-300 border-slate-600/50',
];


// ─── Animated Flow Demo ──────────────────────────────────────────────────────

const DEMO_NODES = [
  { id: 'login', label: 'Login', x: 200, y: 80, type: 'screen' },
  { id: 'error', label: 'Error State', x: 60, y: 220, type: 'screen' },
  { id: 'dashboard', label: 'Dashboard', x: 340, y: 220, type: 'screen' },
  { id: 'forgot', label: 'Forgot Password', x: 200, y: 220, type: 'screen' },
  { id: 'profile', label: 'Profile', x: 480, y: 340, type: 'terminal' },
  { id: 'reset', label: 'Reset Password', x: 200, y: 360, type: 'screen' },
  { id: 'confirm', label: 'Confirmation', x: 200, y: 490, type: 'terminal' },
];

const DEMO_EDGES = [
  { from: 'login', to: 'error' },
  { from: 'login', to: 'dashboard' },
  { from: 'login', to: 'forgot' },
  { from: 'forgot', to: 'reset' },
  { from: 'reset', to: 'confirm' },
  { from: 'dashboard', to: 'profile' },
];

const DEMO_ISSUES = [
  { nodeId: 'error', label: 'No Retry Mechanism', severity: 'critical', icon: '⛔' },
  { nodeId: 'login', label: 'Brute Force Risk', severity: 'critical', icon: '⛔' },
  { nodeId: 'forgot', label: 'No Rate Limiting', severity: 'warning', icon: '⚠️' },
  { nodeId: 'profile', label: 'Terminal State', severity: 'suggestion', icon: '💡' },
];

const NODE_W = 120;
const NODE_H = 38;

function getNodeCenter(node: typeof DEMO_NODES[0]) {
  return { cx: node.x + NODE_W / 2, cy: node.y + NODE_H / 2 };
}

function getEdgePath(from: typeof DEMO_NODES[0], to: typeof DEMO_NODES[0]) {
  const { cx: x1, cy: y1 } = getNodeCenter(from);
  const { cx: x2, cy: y2 } = getNodeCenter(to);
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function getSeverityColor(s: string) {
  if (s === 'critical') return { border: '#ef4444', glow: 'rgba(239,68,68,0.3)', dot: '#ef4444' };
  if (s === 'warning') return { border: '#f59e0b', glow: 'rgba(245,158,11,0.25)', dot: '#f59e0b' };
  if (s === 'suggestion') return { border: '#3b82f6', glow: 'rgba(59,130,246,0.25)', dot: '#818cf8' };
  return { border: '#334155', glow: 'transparent', dot: 'transparent' };
}

function AnimatedFlowDemo() {
  const [tick, setTick] = useState(0);
  const [activeIssue, setActiveIssue] = useState<string | null>(null);
  const [pulseNode, setPulseNode] = useState<string | null>(null);
  const [edgeProgress, setEdgeProgress] = useState<number[]>(DEMO_EDGES.map(() => 0));

  // Cycle through issues for a living demo feel
  useEffect(() => {
    const issueInterval = setInterval(() => {
      setTick(t => t + 1);
    }, 1600);
    return () => clearInterval(issueInterval);
  }, []);

  useEffect(() => {
    const idx = tick % DEMO_ISSUES.length;
    const issue = DEMO_ISSUES[idx];
    setActiveIssue(issue.nodeId);
    setPulseNode(issue.nodeId);
    const timeout = setTimeout(() => setPulseNode(null), 900);
    return () => clearTimeout(timeout);
  }, [tick]);

  // Animate edge particles
  useEffect(() => {
    let raf: number;
    let progress = DEMO_EDGES.map(() => Math.random());
    const animate = () => {
      progress = progress.map(p => (p + 0.006) % 1);
      setEdgeProgress([...progress]);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getPointOnPath = (from: typeof DEMO_NODES[0], to: typeof DEMO_NODES[0], t: number) => {
    const { cx: x1, cy: y1 } = getNodeCenter(from);
    const { cx: x2, cy: y2 } = getNodeCenter(to);
    const mx = (x1 + x2) / 2;
    // Cubic bezier: B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
    // Control points: P0=(x1,y1), P1=(mx,y1), P2=(mx,y2), P3=(x2,y2)
    const b = (p0: number, p1: number, p2: number, p3: number) => {
      const u = 1 - t;
      return u ** 3 * p0 + 3 * u ** 2 * t * p1 + 3 * u * t ** 2 * p2 + t ** 3 * p3;
    };
    return { x: b(x1, mx, mx, x2), y: b(y1, y1, y2, y2) };
  };

  const nodeMap = Object.fromEntries(DEMO_NODES.map(n => [n.id, n]));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0d1424] border border-slate-800 shadow-2xl h-[400px] sm:h-[580px]">
      {/* Dot grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#334155" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Main SVG canvas */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 570" preserveAspectRatio="xMidYMid meet">
        {/* Edges */}
        {DEMO_EDGES.map((edge, i) => {
          const fromNode = nodeMap[edge.from];
          const toNode = nodeMap[edge.to];
          if (!fromNode || !toNode) return null;
          const path = getEdgePath(fromNode, toNode);
          const pt = getPointOnPath(fromNode, toNode, edgeProgress[i]);
          return (
            <g key={i}>
              {/* Base track */}
              <path d={path} fill="none" stroke="#334155" strokeWidth="2" />
              {/* Glowing indigo overlay */}
              <path d={path} fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.55" strokeDasharray="none" />
              {/* Traveling particle */}
              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#a5b4fc" opacity="0.95">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx={pt.x} cy={pt.y} r="7" fill="#818cf8" opacity="0.12" />
            </g>
          );
        })}

        {/* Nodes */}
        {DEMO_NODES.map(node => {
          const issue = DEMO_ISSUES.find(i => i.nodeId === node.id);
          const isActive = activeIssue === node.id;
          const isPulsing = pulseNode === node.id;
          const colors = issue ? getSeverityColor(issue.severity) : getSeverityColor('');
          const isTerminal = node.type === 'terminal';
          const rx = isTerminal ? NODE_H / 2 : 7;

          return (
            <g key={node.id}>
              {/* Glow ring */}
              {issue && (
                <rect
                  x={node.x - 4} y={node.y - 4}
                  width={NODE_W + 8} height={NODE_H + 8}
                  rx={rx + 4}
                  fill="none"
                  stroke={colors.border}
                  strokeWidth={isPulsing ? 2.5 : isActive ? 1.5 : 0.5}
                  opacity={isActive ? 0.85 : 0.2}
                  style={{ transition: 'all 0.4s ease', filter: isActive ? `drop-shadow(0 0 8px ${colors.glow})` : 'none' }}
                />
              )}

              {/* Node shadow (simulated) */}
              <rect
                x={node.x + 2} y={node.y + 3}
                width={NODE_W} height={NODE_H}
                rx={rx}
                fill="rgba(0,0,0,0.35)"
              />

              {/* Node body */}
              <rect
                x={node.x} y={node.y}
                width={NODE_W} height={NODE_H}
                rx={rx}
                fill="#1e293b"
                stroke={isActive ? colors.border : '#475569'}
                strokeWidth={isActive ? 1.5 : 1}
                style={{ transition: 'stroke 0.4s ease' }}
              />

              {/* Label */}
              <text
                x={node.x + NODE_W / 2}
                y={node.y + NODE_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11.5"
                fontWeight="500"
                fill={isActive ? '#f1f5f9' : '#cbd5e1'}
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                style={{ transition: 'fill 0.4s ease' }}
              >
                {node.label}
              </text>

              {/* Severity dot */}
              {issue && (
                <circle
                  cx={node.x + NODE_W - 6}
                  cy={node.y + 6}
                  r="4.5"
                  fill={colors.dot}
                  stroke="#0F172A"
                  strokeWidth="1.5"
                  opacity={isActive ? 1 : 0.55}
                  style={{ transition: 'opacity 0.4s ease' }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Audit Overlay Panel */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-40 sm:w-56 bg-[#0F172A]/90 sm:bg-[#0F172A]/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 z-20">
        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-400">Live Audit</span>
          <span className="ml-auto text-[8px] sm:text-[10px] text-slate-500 font-mono">72/100</span>
        </div>
        {DEMO_ISSUES.map((issue, i) => {
          const isActive = activeIssue === issue.nodeId;
          return (
            <div key={i} className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-slate-800 border border-slate-700' : 'opacity-40'}`}>
              <span className="text-xs sm:text-sm">{issue.icon}</span>
              <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium leading-tight">{issue.label}</span>
            </div>
          );
        })}

        <div className="mt-0.5 sm:mt-1 pt-1.5 sm:pt-2 border-t border-slate-800 flex items-center gap-1.5">
          <Sparkles size={10} className="text-indigo-400" />
          <span className="text-[8px] sm:text-[10px] text-indigo-400 font-semibold">AI Confidence: High</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const t = DICT[lang];

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col selection:bg-indigo-500/30">
      <style>{`
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-gtext {
          background: linear-gradient(270deg, #c4b5fd, #a78bfa, #8b5cf6, #a78bfa, #ddd6fe, #a78bfa, #c4b5fd);
          background-size: 300% 300%;
          animation: gradient-shift 5s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: inline;
        }
        .cta-gbox {
          background: linear-gradient(270deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 1), rgba(49, 46, 129, 0.6), rgba(15, 23, 42, 1));
          background-size: 300% 300%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      {/* Unified Floating Header */}
      <header className="fixed top-0 left-0 w-full p-4 sm:p-6 z-50 flex items-center justify-between gap-4">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 px-3 py-2 sm:px-4 rounded-xl shadow-xl transition-all group shrink-0">
          <Image src="/logos/logo-isotope-1024x1024.png" alt="Fluscope Icon" width={24} height={24} className="sm:w-7 sm:h-7 object-contain group-hover:rotate-[15deg] transition-transform duration-300" />
          <Image src="/logos/logo-horizontal-text-alone-1600x400.png" alt="Fluscope" width={80} height={20} className="sm:w-[90px] sm:h-[22px] hidden xs:block object-contain" />
        </Link>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden lg:flex items-center gap-1 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 px-2 py-1.5 rounded-xl shadow-xl">
            <a href="#features" className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all">{t.navFeatures}</a>
            <a href="#how-it-works" className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all">{t.navHow}</a>
            <Link href="/docs" className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-all">{t.navDocs}</Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <a href="https://github.com/SyntalysTech/fluscope" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-2.5 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl shadow-xl transition-all hidden xs:flex" title="GitHub">
              <Github size={18} className="sm:w-5 sm:h-5" />
            </a>
            <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="p-2 sm:p-2.5 bg-[#0F172A]/80 backdrop-blur-md border border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-[#5865F2] rounded-xl shadow-xl transition-all hidden xs:flex" title="Discord">
              <DiscordIcon size={18} className="sm:w-5 sm:h-5" />
            </a>
            <LanguageSelector lang={lang} setLang={setLang} />
            <Link href="/canvas" className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-[11px] sm:text-sm font-semibold rounded-xl shadow-xl shadow-indigo-900/30 transition-all whitespace-nowrap">
              {t.navCanvas}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto px-6 pt-16 pb-8">
          <div className="text-center mb-14">

            <div className="flex justify-center mb-8">
              <Image src="/logos/logo-horizontal-text-alone-1600x400.png" alt="Fluscope" width={200} height={50} priority className="w-auto opacity-90" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
              <span className="text-slate-100 block">Draw your product flow.</span>
              <span className="hero-gtext block text-3xl sm:text-5xl md:text-6xl">Fluscope finds what's missing.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
              Structural validation and AI audit in seconds.<br />
              <span className="text-slate-600">No login. No backend. Runs entirely in your browser.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/canvas" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                Open Canvas
                <ArrowRight size={17} />
              </Link>
              <a href="#demo" className="text-sm text-slate-500 hover:text-slate-300 transition-colors px-2 py-3">
                See Demo Flow ↓
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-600">Built for product teams and indie builders.</p>
          </div>

          {/* Live Demo */}
          <div id="demo">
            <AnimatedFlowDemo />
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-1.5 h-1.5 bg-emerald-400/70 rounded-full animate-pulse" />
              <span className="text-[11px] text-slate-600 font-medium uppercase tracking-wider">{t.demoBadge}</span>
            </div>
          </div>
        </section>

        {/* ── Social Proof strip ─────────────────────────────────── */}
        <section className="w-full border-y border-slate-800/60 py-5 my-10 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {t.proofItems.map((s, i) => (
              <span key={i} className="text-xs text-slate-500 font-medium tracking-wide">{s}</span>
            ))}
          </div>
        </section>

        {/* ── Features (3 Pillars) ────────────────────────────────── */}
        <section id="features" className="w-full max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3 underline decoration-indigo-500/30 underline-offset-8">Everything in <span className="hero-gtext md:text-3xl">one place</span>.</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">Three focused tools. No switching context.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {/* Pillar 1 */}
            <div className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 transition-all">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                <GitBranch size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Visual Flow Builder</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Screen, Decision, and Terminal nodes. Connect from any direction. Auto-layout in one click. Generate full flows from a text brief.</p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 transition-all">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-5">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Dual-Layer Audit</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Rule engine catches structural issues in milliseconds. AI then reviews from three expert angles: architecture, security, and UX.</p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 transition-all sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 bg-slate-600/30 text-slate-400 rounded-xl flex items-center justify-center mb-5">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-2">Zero Friction Workspace</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Auto-saves to your browser. Import and export JSON. No login, no backend, no setup. Laser pointer mode for presentations.</p>
            </div>
          </div>

          {/* Collapsible Advanced */}
          <details className="group border border-slate-800/60 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-900/30 transition-all list-none select-none [&::-webkit-details-marker]:hidden">
              <span className="font-medium">Advanced capabilities</span>
              <ChevronDown size={15} className="group-open:rotate-180 transition-transform text-slate-600" />
            </summary>
            <div className="grid sm:grid-cols-2 gap-3 px-6 pb-5 pt-3">
              {[{ icon: Download, label: 'Import / Export JSON', desc: 'Share flows as structured JSON. Re-audit at any time.' },
              { icon: RefreshCw, label: 'Session Persistence', desc: 'Auto-saves every change to localStorage. Always where you left it.' },
              { icon: Lock, label: 'Fully Private', desc: 'Zero backend, zero telemetry. Flow data never leaves your browser.' },
              { icon: Brain, label: 'AI Smart Builder', desc: 'Describe your flow in plain language. Get a full graph instantly.' },
              { icon: Sparkles, label: 'Auto-fix Engine', desc: 'One-click structural fixes. Fluscope rewrites broken graph sections.' },
              { icon: CheckCircle2, label: 'Robustness Score', desc: '0–100 score with severity-weighted deductions per finding.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div className="w-7 h-7 bg-slate-800 text-slate-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">{item.label}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section id="how-it-works" className="w-full max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-100 mb-3 italic">How it <span className="hero-gtext text-3xl">actually works</span></h2>
            <p className="text-slate-400">{t.howSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {TRANSLATED_HOW[lang].map((s, i) => {
              const IconComp = ICONS_HOW[i];
              const clr = COLORS_HOW[i];
              const stepStr = '0' + (i + 1);
              return (
                <div key={i} className={`flex flex-col items-center text-center p-8 bg-slate-900/50 border border-slate-800 rounded-2xl ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <div className={`w-14 h-14 ${clr.b} ${clr.c} rounded-2xl flex items-center justify-center mb-5`}>
                    <IconComp size={26} />
                  </div>
                  <div className="text-[10px] font-black tracking-widest text-slate-600 mb-2">{stepStr}</div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section >

        {/* ── Flow types ─────────────────────────────────────────── */}
        < section className="w-full max-w-5xl mx-auto px-6 py-16" >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Domain-aware <span className="hero-gtext text-2xl">Audit Rules</span></h2>
            <p className="text-slate-400 text-sm">{t.typesSubtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRANSLATED_TYPES[lang].map((ft, i) => (
              <div key={i} className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 hover:border-slate-700 transition">
                <span className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-black tracking-widest mb-3 ${COLORS_TYPES[i]}`}>{ft.name}</span>
                <p className="text-xs text-slate-500 leading-relaxed">{ft.desc}</p>
              </div>
            ))}
          </div>
        </section >

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="w-full max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="relative cta-gbox border border-indigo-500/20 rounded-3xl p-8 sm:p-12 overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
            <div className="flex justify-center mb-4">
              <Image src="/logos/logo-isotope-1024x1024.png" alt="Fluscope" width={48} height={48} className="rounded-xl opacity-80" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 mb-4">
              Stop shipping <span className="hero-gtext text-2xl sm:text-3xl md:text-4xl">broken flows</span>.<br className="hidden sm:block" /> Start auditing.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-md mx-auto">
              {t.ctaSubtitle}
            </p>
            <Link href="/canvas" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-all hover:scale-[1.02] text-sm sm:text-base">
              {t.ctaButton}
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logos/logo-isotope-1024x1024.png" alt="Fluscope Icon" width={20} height={20} className="opacity-50 grayscale" />
            <span className="text-slate-500 text-sm">{t.footerText}</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 text-xs text-slate-600">
            <a href="https://github.com/SyntalysTech/fluscope" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors" title="GitHub">
              <Github size={16} />
            </a>
            <span className="text-slate-800">·</span>
            <a href="https://discord.gg/atQEZvhwfy" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors" title="Discord">
              <DiscordIcon size={16} />
            </a>
            <span className="text-slate-800">·</span>
            {t.footerTags.map((tag, i) => (
              <span key={i} className="flex items-center gap-3 sm:gap-5">
                <span>{tag}</span>
                {i < t.footerTags.length - 1 && <span className="text-slate-800">·</span>}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

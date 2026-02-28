"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    Handle,
    Position,
    NodeProps,
    BackgroundVariant,
    useReactFlow,
    ReactFlowProvider,
    NodeToolbar
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FluscopeNode } from '@/types/flow';
import { CanvasContextMenu, ContextMenuItem } from './CanvasContextMenu';
import { getLayoutedElements } from '@/lib/autoLayout';
import { Trash2, Copy, LayoutGrid, Paintbrush, Power, CircleDot, Plus, Sparkles } from 'lucide-react';

const DualHandle = ({ idPrefix, position }: { idPrefix: string, position: Position }) => (
    <>
        <Handle type="target" position={position} id={`${idPrefix}-target`} className="w-2.5 h-2.5 bg-slate-400 border-none rounded-full z-[1]" />
        <Handle type="source" position={position} id={`${idPrefix}-source`} className="w-2.5 h-2.5 bg-slate-400 border-none rounded-full opacity-0 z-[2]" />
    </>
);

const CommonNodeWrapper = ({ data, id, selected, isConnectable, shapeClass, innerClass, nodeType = 'rect' }: NodeProps<FluscopeNode> & { shapeClass: string, innerClass?: string, nodeType?: 'rect' | 'circle' | 'diamond' | 'screen' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label);
    const { setNodes, setEdges, getNode } = useReactFlow();

    const handleBlur = () => {
        setIsEditing(false);
        if (data.onChange) {
            (data.onChange as (id: string, label: string) => void)(id, label);
        } else {
            data.label = label;
        }
    };

    const handleDelete = () => {
        setNodes(nds => nds.filter(n => n.id !== id));
        setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    };

    const handleDuplicate = () => {
        const node = getNode(id);
        if (node) {
            setNodes(nds => nds.concat({
                ...node,
                id: Math.random().toString(36).substring(7),
                position: { x: node.position.x + 50, y: node.position.y + 50 }
            }));
        }
    };

    const handleTypeChange = (newType: string) => {
        setNodes(nds => nds.map(n => n.id === id ? { ...n, type: newType } : n));
    };

    const MinimalToolbar = () => (
        <NodeToolbar isVisible={selected} position={Position.Top} className="flex bg-slate-800/90 border border-slate-700/50 rounded-lg shadow-xl p-1 gap-1 -translate-y-2">
            <button onClick={() => setNodes(nds => nds.map(n => n.id === id ? { ...n, type: 'screenNode' } : n))} title="Set as Screen" className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded transition"><LayoutGrid size={14} /></button>
            <button onClick={() => setNodes(nds => nds.map(n => n.id === id ? { ...n, type: 'decisionNode' } : n))} title="Set as Decision" className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded transition"><CircleDot size={14} /></button>
            <button onClick={() => setNodes(nds => nds.map(n => n.id === id ? { ...n, type: 'terminalNode' } : n))} title="Set as Terminal" className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded transition"><Power size={14} /></button>
            <div className="w-px h-5 bg-slate-700 my-auto mx-1"></div>
            <button onClick={handleDuplicate} title="Duplicate Node" className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded transition"><Copy size={14} /></button>
            <button onClick={handleDelete} title="Delete Node" className="p-1.5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded transition"><Trash2 size={14} /></button>
        </NodeToolbar>
    );

    const severity = data.issueSeverity as 'critical' | 'warning' | 'suggestion' | undefined;
    let borderClass = 'border-slate-700';
    let dotColor = '';

    if (severity === 'critical') {
        borderClass = 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
        dotColor = 'bg-red-500';
    } else if (severity === 'warning') {
        borderClass = 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
        dotColor = 'bg-amber-500';
    } else if (severity === 'suggestion') {
        borderClass = 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
        dotColor = 'bg-blue-500';
    }

    let highlightClass = '';
    if (data.activeHighlight) {
        borderClass = 'border-indigo-400 ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#0F172A]';
        highlightClass = 'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]';
    }

    if (nodeType === 'diamond') {
        return (
            <div className={`relative flex items-center justify-center ${shapeClass} ${highlightClass}`}>
                <MinimalToolbar />
                <DualHandle idPrefix="top" position={Position.Top} />
                <DualHandle idPrefix="bottom" position={Position.Bottom} />
                <DualHandle idPrefix="left" position={Position.Left} />
                <DualHandle idPrefix="right" position={Position.Right} />

                {/* The rotated square creating the diamond */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92px] h-[92px] rotate-45 bg-[#1E293B] border transition-all duration-300 ${borderClass} z-0`}></div>

                {dotColor && !data.activeHighlight && (
                    <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${dotColor} border-2 border-[#1E293B] z-10`} />
                )}

                <div className={`w-full h-full flex items-center justify-center z-10 ${innerClass}`}>
                    {isEditing ? (
                        <input
                            autoFocus
                            className="bg-transparent border-b border-indigo-400 outline-none text-center w-[80%] focus:ring-0 px-1 py-0.5 text-[11px] m-0 text-white"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleBlur() }}
                        />
                    ) : (
                        <div
                            className="text-[11px] leading-tight font-medium w-full px-2 text-center cursor-text flex items-center justify-center break-words"
                            style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                            onClick={() => setIsEditing(true)}
                        >
                            {label || 'Decision'}
                        </div>
                    )}
                </div>
            </div>
        );
    }


    // Generic rect / terminal
    return (
        <div className={`relative bg-[#1E293B] border text-center text-slate-200 transition-all duration-300 ${shapeClass} ${borderClass} ${highlightClass}`}>
            <MinimalToolbar />
            <DualHandle idPrefix="top" position={Position.Top} />
            <DualHandle idPrefix="bottom" position={Position.Bottom} />
            <DualHandle idPrefix="left" position={Position.Left} />
            <DualHandle idPrefix="right" position={Position.Right} />

            {dotColor && !data.activeHighlight && (
                <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full ${dotColor} border-2 border-[#1E293B] z-10`} />
            )}

            <div className={`w-full h-full flex items-center justify-center ${innerClass}`}>
                {isEditing ? (
                    <input
                        autoFocus
                        className="bg-transparent border-b border-indigo-400 outline-none text-center w-[80%] focus:ring-0 px-1 py-0.5 text-sm m-0 text-white"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleBlur() }}
                    />
                ) : (
                    <div
                        className="text-sm font-medium w-full break-words whitespace-normal cursor-text py-0.5 px-2 leading-snug text-center"
                        onClick={() => setIsEditing(true)}
                    >
                        {label || 'Unnamed Node'}
                    </div>
                )}
            </div>
        </div>
    );
};


const ScreenNode = (props: NodeProps<FluscopeNode>) => (
    <CommonNodeWrapper {...props} nodeType="rect" shapeClass="rounded-md min-w-[130px] max-w-[200px] min-h-[40px] px-2 py-2" />
);

const TerminalNode = (props: NodeProps<FluscopeNode>) => (
    <CommonNodeWrapper {...props} nodeType="circle" shapeClass="rounded-full min-w-[120px] max-w-[190px] min-h-[40px] px-4 py-2" />
);

const DecisionNode = (props: NodeProps<FluscopeNode>) => (
    <CommonNodeWrapper {...props} nodeType="diamond" shapeClass="w-[130px] h-[130px] text-slate-200" />
);


interface CanvasProps {
    nodes: any[];
    edges: any[];
    onNodesChange: any;
    onEdgesChange: any;
    onConnect: any;
    setNodes?: any;
    setEdges?: any;
    updateNodeLabel?: (id: string, label: string) => void;
    drawModeEnabled?: boolean;
    clearDrawingsSignal?: number;
}

function CanvasInner({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeLabel,
    drawModeEnabled,
    clearDrawingsSignal,
    setNodes,
    setEdges
}: CanvasProps) {
    const { screenToFlowPosition } = useReactFlow();

    const nodeTypes = useMemo(() => ({
        screenNode: ScreenNode,
        decisionNode: DecisionNode,
        terminalNode: TerminalNode,
        customNode: ScreenNode // fallback legacy
    }), []);

    const mappedNodes = useMemo(() => {
        return nodes.map((n) => ({
            ...n,
            type: n.type && nodeTypes[n.type as keyof typeof nodeTypes] ? n.type : 'screenNode',
            data: {
                ...n.data,
                onChange: updateNodeLabel
            }
        }));
    }, [nodes, updateNodeLabel, nodeTypes]);

    const mappedEdges = useMemo(() => {
        return edges.map(e => {
            if (e.label) {
                return {
                    ...e,
                    labelStyle: { fill: '#E2E8F0', fontWeight: 700, fontSize: 11, fontFamily: 'Inter, ui-sans-serif, sans-serif', ...e.labelStyle },
                    labelBgStyle: { fill: '#1E293B', stroke: '#334155', strokeWidth: 1, ...e.labelBgStyle },
                    labelBgPadding: e.labelBgPadding || [8, 4],
                    labelBgBorderRadius: e.labelBgBorderRadius || 6,
                };
            }
            return e;
        });
    }, [edges]);

    // Context Menu Logic
    const [menu, setMenu] = useState<{
        x: number, y: number, type: 'node' | 'edge' | 'pane', targetId?: string
    } | null>(null);

    const onNodeContextMenu = useCallback((event: React.MouseEvent | MouseEvent, node: any) => {
        event.preventDefault();
        setMenu({ x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY, type: 'node', targetId: node.id });
    }, []);

    const onEdgeContextMenu = useCallback((event: React.MouseEvent | MouseEvent, edge: any) => {
        event.preventDefault();
        setMenu({ x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY, type: 'edge', targetId: edge.id });
    }, []);

    const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
        event.preventDefault();
        setMenu({ x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY, type: 'pane' });
    }, []);

    const getContextMenuItems = (): ContextMenuItem[] => {
        if (!menu) return [];

        if (menu.type === 'node' && menu.targetId && setNodes) {
            const _id = menu.targetId;
            return [
                { id: 'del', label: 'Delete Node', icon: <Trash2 size={14} />, destructive: true, onClick: () => setNodes((nds: any) => nds.filter((n: any) => n.id !== _id)) },
                {
                    id: 'dup', label: 'Duplicate', icon: <Copy size={14} />, onClick: () => {
                        const nodeToDup = nodes.find(n => n.id === _id);
                        if (nodeToDup) {
                            setNodes((nds: any) => nds.concat({
                                ...nodeToDup,
                                id: Math.random().toString(36).substring(7),
                                position: { x: nodeToDup.position.x + 50, y: nodeToDup.position.y + 50 }
                            }));
                        }
                    }
                },
                {
                    id: 'auto-connect', label: 'Auto Connect Next', icon: <Plus size={14} />, onClick: () => {
                        const origin = nodes.find(n => n.id === _id);
                        if (!origin) return;
                        const newId = Math.random().toString(36).substring(7);
                        setNodes((nds: any) => nds.concat({
                            id: newId,
                            type: 'screenNode',
                            position: { x: origin.position.x + 220, y: origin.position.y },
                            data: { label: 'Next Step' }
                        }));
                        setEdges((eds: any) => eds.concat({
                            id: `e_${origin.id}_${newId}`,
                            source: origin.id,
                            target: newId,
                            sourceHandle: 'right-source',
                            targetHandle: 'left-target',
                            style: { stroke: '#818cf8', strokeWidth: 3 }
                        }));
                    }
                },
                { id: 'type-screen', label: 'Set as Screen', icon: <LayoutGrid size={14} />, onClick: () => setNodes((nds: any) => nds.map((n: any) => n.id === _id ? { ...n, type: 'screenNode' } : n)) },
                { id: 'type-decision', label: 'Set as Decision', icon: <CircleDot size={14} />, onClick: () => setNodes((nds: any) => nds.map((n: any) => n.id === _id ? { ...n, type: 'decisionNode' } : n)) },
                { id: 'type-terminal', label: 'Set as Terminal', icon: <Power size={14} />, onClick: () => setNodes((nds: any) => nds.map((n: any) => n.id === _id ? { ...n, type: 'terminalNode' } : n)) },
            ];
        }

        if (menu.type === 'edge' && menu.targetId && setEdges) {
            const _id = menu.targetId;
            return [
                { id: 'del', label: 'Delete Edge', icon: <Trash2 size={14} />, destructive: true, onClick: () => setEdges((eds: any) => eds.filter((e: any) => e.id !== _id)) },
                { id: 'style-solid', label: 'Solid Line', icon: <Paintbrush size={14} />, onClick: () => setEdges((eds: any) => eds.map((e: any) => e.id === _id ? { ...e, animated: false, style: { strokeDasharray: 'none', stroke: '#818cf8', strokeWidth: 3 } } : e)) },
                { id: 'style-dashed', label: 'Dashed Line', icon: <Paintbrush size={14} />, onClick: () => setEdges((eds: any) => eds.map((e: any) => e.id === _id ? { ...e, animated: false, style: { strokeDasharray: '5, 5', stroke: '#818cf8', strokeWidth: 3 } } : e)) },
                { id: 'style-dotted', label: 'Dotted Line', icon: <Paintbrush size={14} />, onClick: () => setEdges((eds: any) => eds.map((e: any) => e.id === _id ? { ...e, animated: false, style: { strokeDasharray: '2, 5', stroke: '#818cf8', strokeWidth: 3 } } : e)) },
            ];
        }

        if (menu.type === 'pane' && setNodes && setEdges) {
            return [
                {
                    id: 'add-node', label: 'Add Node Here', icon: <Plus size={14} />, onClick: () => {
                        // Since we don't have direct access to project() mapping easily here without useReactFlow, 
                        // we just add it near top, or try naive mapping
                        setNodes((nds: any) => nds.concat({
                            id: Math.random().toString(36).substring(7),
                            type: 'screenNode',
                            position: { x: 200, y: 200 },
                            data: { label: 'New Action' }
                        }));
                    }
                },
                {
                    id: 'auto-layout', label: 'Auto Layout', icon: <LayoutGrid size={14} />, onClick: () => {
                        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
                        setNodes([...layoutedNodes]);
                        setEdges([...layoutedEdges]);
                    }
                },
            ];
        }
        return [];
    };

    // Laser Mode Logic
    const isDrawingRef = useRef(false);
    type Point = { x: number, y: number, time?: number };
    const laserPointsRef = useRef<Point[]>([]);
    const [historyCounter, setHistoryCounter] = useState(0);

    // Fade laser points out
    useEffect(() => {
        if (!drawModeEnabled) return;
        const interval = setInterval(() => {
            if (laserPointsRef.current.length > 0) {
                const now = Date.now();
                laserPointsRef.current = laserPointsRef.current.filter(p => now - (p.time || 0) < 2500);
                setHistoryCounter(c => c + 1);
            }
        }, 80);
        return () => clearInterval(interval);
    }, [drawModeEnabled]);

    useEffect(() => {
        if (clearDrawingsSignal && clearDrawingsSignal > 0) {
            laserPointsRef.current = [];
            setHistoryCounter(c => c + 1);
        }
    }, [clearDrawingsSignal]);

    const getScreenPos = (e: any) => {
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        // Since overlay is full screen, we can use bounding rect
        const container = document.getElementById('fluscope-canvas-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        return { x: clientX, y: clientY };
    };

    const startDraw = (e: any) => {
        if (!drawModeEnabled) return;
        isDrawingRef.current = true;
        if (e.pointerId && e.target && e.target.setPointerCapture) {
            try { e.target.setPointerCapture(e.pointerId); } catch (err) { }
        }

        const pos = getScreenPos(e);
        laserPointsRef.current.push({ ...pos, time: Date.now() });
        setHistoryCounter(c => c + 1);
    };

    const draw = (e: any) => {
        if (!drawModeEnabled || !isDrawingRef.current) return;
        const pos = getScreenPos(e);
        laserPointsRef.current.push({ ...pos, time: Date.now() });
        setHistoryCounter(c => c + 1);
    };

    const stopDraw = () => {
        if (!drawModeEnabled || !isDrawingRef.current) return;
        isDrawingRef.current = false;
        setHistoryCounter(c => c + 1);
    };

    // Track selected element for Canvas-level floating context tools if needed natively
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const onSelectionChange = useCallback(({ edges, nodes }: any) => {
        if (edges.length === 1 && nodes.length === 0) {
            setSelectedEdgeId(edges[0].id);
        } else {
            setSelectedEdgeId(null);
        }
    }, []);

    // Make canvas overlay conditional on clicking
    return (
        <div id="fluscope-canvas-container" className="w-full h-full bg-[#0F172A] relative overflow-hidden">

            {/* Empty State Helper Text */}
            {nodes.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg pointer-events-none select-none flex flex-col items-center gap-3 z-0">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <span>Add a node or generate a flow to begin.</span>
                </div>
            )}

            {/* Edge Toolbar UI Overlay */}
            {selectedEdgeId && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center bg-slate-800/90 border border-slate-700/50 rounded-full shadow-2xl p-1.5 gap-1 animate-in slide-in-from-bottom-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">Edge</span>
                    <div className="w-px h-4 bg-slate-700"></div>
                    <button onClick={() => setEdges((eds: any) => eds.map((e: any) => e.id === selectedEdgeId ? { ...e, animated: false, style: { strokeDasharray: 'none', stroke: '#818cf8', strokeWidth: 3 } } : e))} className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded-full transition" title="Solid"><Paintbrush size={14} /></button>
                    <button onClick={() => setEdges((eds: any) => eds.map((e: any) => e.id === selectedEdgeId ? { ...e, animated: false, style: { strokeDasharray: '5, 5', stroke: '#818cf8', strokeWidth: 3 } } : e))} className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded-full transition" title="Dashed"><Paintbrush size={14} /></button>
                    <button onClick={() => setEdges((eds: any) => eds.map((e: any) => e.id === selectedEdgeId ? { ...e, animated: false, style: { strokeDasharray: '2, 5', stroke: '#818cf8', strokeWidth: 3 } } : e))} className="p-1.5 hover:bg-slate-700 hover:text-white text-slate-400 rounded-full transition" title="Dotted"><Paintbrush size={14} /></button>
                    <div className="w-px h-4 bg-slate-700"></div>
                    <button onClick={() => setEdges((eds: any) => eds.filter((e: any) => e.id !== selectedEdgeId))} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-full transition mx-1" title="Delete"><Trash2 size={14} /></button>
                </div>
            )}

            <ReactFlow
                nodes={mappedNodes}
                edges={mappedEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                nodeTypes={nodeTypes}
                panOnDrag={!drawModeEnabled}
                zoomOnScroll={!drawModeEnabled}
                zoomOnPinch={!drawModeEnabled}
                zoomOnDoubleClick={!drawModeEnabled}
                elementsSelectable={!drawModeEnabled}
                nodesDraggable={!drawModeEnabled}
                nodesConnectable={!drawModeEnabled}
                fitView
                className="bg-[#0F172A]"
                deleteKeyCode={['Backspace', 'Delete']}
                defaultEdgeOptions={{
                    style: { stroke: '#64748B', strokeWidth: 2 }
                }}
            >
                <style>
                    {`
                    .react-flow__edge.selected .react-flow__edge-path {
                        stroke: #818cf8 !important;
                        stroke-width: 3 !important;
                    }
                    .react-flow__edge:hover .react-flow__edge-path {
                        stroke: #94a3b8;
                    }
                    `}
                </style>
                <Controls showInteractive={false} className="bg-[#1E293B] border-slate-700 !fill-slate-300 [&>button]:border-slate-700" />
                <MiniMap nodeColor="#6366f1" maskColor="rgba(10,15,30,0.6)" />

                <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#334155" />
            </ReactFlow>

            {/* Pure Screen-space Absolute Drawing Capture Layer Overlay */}
            {drawModeEnabled && (
                <div
                    style={{ touchAction: 'none' }}
                    className="absolute inset-0 z-[40] cursor-crosshair bg-black/0"
                    onPointerDown={startDraw}
                    onPointerMove={draw}
                    onPointerUp={stopDraw}
                    onPointerLeave={stopDraw}
                    onPointerCancel={stopDraw}
                >
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}>
                        {(() => {
                            const pts = laserPointsRef.current;
                            if (pts.length < 2) return null;
                            const now = Date.now();
                            const LIFETIME = 3000; // ms until fully gone

                            // Split into N chunks — each gets opacity based on its age
                            const N = 14;
                            const chunkSize = Math.max(2, Math.ceil(pts.length / N));
                            const chunks: { d: string; opacity: number }[] = [];

                            for (let i = 0; i < pts.length - 1; i += chunkSize) {
                                const slice = pts.slice(i, i + chunkSize + 1);
                                if (slice.length < 2) continue;
                                const midPoint = slice[Math.floor(slice.length / 2)];
                                const age = now - (midPoint.time || now);
                                const rawOpacity = Math.max(0, 1 - age / LIFETIME);
                                // Ease out: square root so fresh segments stay bright longer
                                const opacity = Math.sqrt(rawOpacity);
                                const d = slice.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                chunks.push({ d, opacity });
                            }

                            const tip = pts[pts.length - 1];
                            const tipAge = now - (tip.time || now);
                            const tipOpacity = Math.max(0, 1 - tipAge / LIFETIME);

                            return (
                                <>
                                    {/* Aura chunks */}
                                    {chunks.map((c, i) => (
                                        <path key={`aura-${i}`} d={c.d}
                                            fill="none" stroke="#818cf8" strokeWidth={10}
                                            strokeLinecap="round" strokeLinejoin="round"
                                            opacity={c.opacity * 0.06}
                                            style={{ filter: 'blur(5px)' }}
                                        />
                                    ))}
                                    {/* Trail chunks */}
                                    {chunks.map((c, i) => (
                                        <path key={`trail-${i}`} d={c.d}
                                            fill="none" stroke="#818cf8" strokeWidth={2.5}
                                            strokeLinecap="round" strokeLinejoin="round"
                                            opacity={c.opacity * 0.65}
                                            style={{ filter: 'drop-shadow(0 0 3px rgba(129,140,248,0.5))' }}
                                        />
                                    ))}
                                    {/* Tip */}
                                    <circle cx={tip.x} cy={tip.y} r={4}
                                        fill="#c4b5fd" opacity={tipOpacity * 0.92}
                                        style={{ filter: 'drop-shadow(0 0 5px #818cf8)' }}
                                    />
                                    <circle cx={tip.x} cy={tip.y} r={8}
                                        fill="#818cf8" opacity={tipOpacity * 0.12}
                                        style={{ filter: 'blur(3px)' }}
                                    />
                                </>
                            );
                        })()}
                    </svg>
                </div>
            )}

            {menu && (
                <CanvasContextMenu
                    x={menu.x}
                    y={menu.y}
                    title={menu.type === 'node' ? 'Node Actions' : menu.type === 'edge' ? 'Edge Actions' : 'Canvas Actions'}
                    items={getContextMenuItems()}
                    onClose={() => setMenu(null)}
                />
            )}
        </div>
    );
}

export default function Canvas(props: CanvasProps) {
    return (
        <ReactFlowProvider>
            <CanvasInner {...props} />
        </ReactFlowProvider>
    );
}

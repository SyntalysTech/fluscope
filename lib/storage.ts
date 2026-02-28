import { FluscopeNode, FluscopeEdge } from '@/types/flow';

const STORAGE_KEY = 'fluscope-current-flow';

export interface SavedFlow {
    nodes: FluscopeNode[];
    edges: FluscopeEdge[];
    version: number;
    updatedAt: number;
}

export function saveFlowToLocal(nodes: FluscopeNode[], edges: FluscopeEdge[]): void {
    if (typeof window === 'undefined') return;

    // Clean nodes of temporary UI state before saving
    const cleanNodes = nodes.map(n => ({
        ...n,
        data: {
            ...n.data,
            issueSeverity: undefined,
            activeHighlight: false
        }
    }));

    const flowData: SavedFlow = {
        nodes: cleanNodes,
        edges,
        version: 1,
        updatedAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(flowData));
}

export function loadFlowFromLocal(): SavedFlow | null {
    if (typeof window === 'undefined') return null;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
            return parsed as SavedFlow;
        }
    } catch (e) {
        console.error('Failed to parse saved flow', e);
    }
    return null;
}

export function clearLocalFlow(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

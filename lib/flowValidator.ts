import { FluscopeNode, FluscopeEdge } from '@/types/flow';

export function validateFlow(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    // Check nodes array
    if (!Array.isArray(data.nodes)) return false;
    for (const node of data.nodes) {
        if (!node.id || typeof node.id !== 'string') return false;
        if (!node.data || typeof node.data !== 'object') return false;
    }

    // Check edges array
    if (!Array.isArray(data.edges)) return false;
    for (const edge of data.edges) {
        if (!edge.id || typeof edge.id !== 'string') return false;
        if (!edge.source || typeof edge.source !== 'string') return false;
        if (!edge.target || typeof edge.target !== 'string') return false;
    }

    return true;
}

import { FluscopeNode, FluscopeEdge, AuditIssue } from '../../types/flow';

export function runGraphRules(nodes: FluscopeNode[], edges: FluscopeEdge[]): AuditIssue[] {
    const issues: AuditIssue[] = [];

    const incomingCount: Record<string, number> = {};
    const outgoingCount: Record<string, number> = {};
    const adjList: Record<string, string[]> = {};

    nodes.forEach(n => {
        incomingCount[n.id] = 0;
        outgoingCount[n.id] = 0;
        adjList[n.id] = [];
    });

    edges.forEach(e => {
        if (incomingCount[e.target] !== undefined) incomingCount[e.target]++;
        if (outgoingCount[e.source] !== undefined) {
            outgoingCount[e.source]++;
            adjList[e.source].push(e.target);
        }
    });

    const entryNodes: string[] = [];

    nodes.forEach(n => {
        const label = (n.data.label || '').toLowerCase();

        // Detect entry points
        if (incomingCount[n.id] === 0) {
            entryNodes.push(n.id);

            // Isolated node warning (if not ostensibly an entry point)
            if (!['login', 'start', 'home'].some(s => label.includes(s))) {
                issues.push({
                    id: Math.random().toString(36).substring(7),
                    type: 'warning',
                    title: 'Isolated / Unreachable Node',
                    description: `This node cannot be accessed from any entry point.`,
                    affectedNodes: [n.id]
                });
            }
        }

        // Dead ends / terminal detection
        if (outgoingCount[n.id] === 0) {
            const isEntry = incomingCount[n.id] === 0;
            // These are intentional leaf nodes — error states, success states, cancel paths, etc.
            const intentionalEnd = [
                'success', 'dashboard', 'confirmation', 'complete', 'end',
                'fail', 'failure', 'error', 'cancel', 'retry', 'reject',
                'empty', 'loading', 'reset', 'signup', 'register'
            ].some(s => label.includes(s));

            const isTerminalType = n.type === 'terminalNode';

            if (isTerminalType) {
                // Explicit terminal nodes are always fine — no issue
            } else if (intentionalEnd) {
                // Leaf node with recognizable end label — only suggest connecting if it's a fail/retry path
                const isLoopback = ['retry', 'fail', 'failure', 'reject'].some(s => label.includes(s));
                if (isLoopback) {
                    issues.push({
                        id: Math.random().toString(36).substring(7),
                        type: 'suggestion',
                        title: 'Dead End',
                        description: `"${n.data.label}" has no outgoing path. Consider connecting it back to the flow or to an End node.`,
                        affectedNodes: [n.id]
                    });
                }
                // All other intentional ends (success, dashboard, error, empty, loading, cancel) → no issue
            } else if (!isEntry) {
                // Unknown dead-end node mid-flow
                issues.push({
                    id: Math.random().toString(36).substring(7),
                    type: 'warning',
                    title: 'Dead End',
                    description: `"${n.data.label}" has no outgoing path. Users may become stuck here.`,
                    affectedNodes: [n.id]
                });
            }
        }

        // Phase 2: Too many outgoing edges
        if (outgoingCount[n.id] > 3) {
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'suggestion',
                title: 'Complex Decision Node',
                description: `Too many outgoing paths can overwhelm users. Consider simplifying.`,
                affectedNodes: [n.id]
            });
        }
    });

    // Phase 2: Multiple entry points
    if (entryNodes.length > 1) {
        issues.push({
            id: Math.random().toString(36).substring(7),
            type: 'warning',
            title: 'Multiple Entry Points',
            description: `Having multiple detached starting points can confuse the primary user flow.`,
            affectedNodes: entryNodes
        });
    }

    // Reachability check (Phase 2 constraint: unreachable from any entry node)
    const reachableFromAnyEntry = new Set<string>();
    const exploreReachability = (nodeId: string) => {
        if (reachableFromAnyEntry.has(nodeId)) return;
        reachableFromAnyEntry.add(nodeId);
        adjList[nodeId].forEach(neighbor => exploreReachability(neighbor));
    };
    entryNodes.forEach(exploreReachability);

    // If there are entry nodes, check what is unreachable
    if (entryNodes.length > 0) {
        const unreachableNodes = nodes.filter(n => !reachableFromAnyEntry.has(n.id));
        if (unreachableNodes.length > 0) {
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'warning',
                title: 'Unreachable Components',
                description: `Found ${unreachableNodes.length} nodes that cannot be reached from any entry point.`,
                affectedNodes: unreachableNodes.map(n => n.id)
            });
        }
    }

    // Detect long linear chains (>6 steps without branching)
    // For each node, if it has 1 incoming and 1 outgoing, trace it
    const linearChains = new Set<string>();
    nodes.forEach((n) => {
        if (linearChains.has(n.id)) return; // already counted

        let current = n.id;
        const chain: string[] = [current];

        // Follow chain forward
        while (outgoingCount[current] === 1) {
            const nextId = adjList[current][0];
            // Only keep chain pure if the next node has exactly 1 incoming too, avoid counting converging branches as linear
            if (incomingCount[nextId] !== 1) break;
            if (chain.includes(nextId)) break; // prevent cycle infinite loops

            chain.push(nextId);
            current = nextId;
        }

        if (chain.length > 6) {
            chain.forEach(id => linearChains.add(id)); // mark to avoid duplications
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'suggestion',
                title: 'Long Linear Chain',
                description: `A sequence this long without branching can cause user fatigue.`,
                affectedNodes: chain
            });
        }
    });

    // Simple cycle detection
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const checkCycle = (nodeId: string, currentPath: string[]): string[] | null => {
        if (recursionStack.has(nodeId)) {
            const cycleStartIdx = currentPath.indexOf(nodeId);
            return currentPath.slice(cycleStartIdx);
        }
        if (visited.has(nodeId)) return null;

        visited.add(nodeId);
        recursionStack.add(nodeId);
        currentPath.push(nodeId);

        for (const neighbor of (adjList[nodeId] || [])) {
            const cycle = checkCycle(neighbor, currentPath);
            if (cycle) return cycle;
        }

        currentPath.pop();
        recursionStack.delete(nodeId);
        return null;
    };

    let foundCycle = null;
    for (const n of nodes) {
        if (!visited.has(n.id)) {
            const cycle = checkCycle(n.id, []);
            if (cycle) {
                foundCycle = cycle;
                break; // Only report one cycle per audit run to prevent noise
            }
        }
    }

    if (foundCycle) {
        let hasExit = false;
        for (const nodeId of foundCycle) {
            for (const neighbor of (adjList[nodeId] || [])) {
                if (!foundCycle.includes(neighbor)) {
                    hasExit = true;
                    break;
                }
            }
            if (hasExit) break;
        }

        if (!hasExit) {
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'critical',
                title: 'Endless Loop Detected',
                description: `Circular loop with no exit detected. Users cannot escape this flow.`,
                affectedNodes: foundCycle
            });
        }
    }

    return issues;
}

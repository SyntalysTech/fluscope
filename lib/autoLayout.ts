import dagre from 'dagre';
import { FluscopeNode, FluscopeEdge } from '@/types/flow';

export const getLayoutedElements = (nodes: FluscopeNode[], edges: FluscopeEdge[], direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Setup the grid layout specifics
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        // Roughly mapped size of nodes inside Canvas (min-w 150)
        dagreGraph.setNode(node.id, { width: 220, height: 120 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 220 / 2,
                y: nodeWithPosition.y - 120 / 2,
            },
        };
    });

    return { nodes: newNodes, edges };
};

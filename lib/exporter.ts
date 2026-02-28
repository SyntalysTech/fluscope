import { FluscopeNode, FluscopeEdge } from '@/types/flow';
import { validateFlow } from './flowValidator';
import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from '@xyflow/react';

export function exportFlowAsJson(nodes: FluscopeNode[], edges: FluscopeEdge[], title?: string): boolean {
    const cleanNodes = nodes.map(n => {
        const { issueSeverity, activeHighlight, onChange, ...cleanData } = n.data as any;
        return { ...n, data: cleanData };
    });

    const flowData = { nodes: cleanNodes, edges, title: title || 'Untitled Flow' };

    if (!validateFlow(flowData)) {
        console.error('Invalid flow data for export');
        return false;
    }

    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const slug = (title || 'flow').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluscope-${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
}

export async function exportCanvasAsPng(nodes: FluscopeNode[], title?: string): Promise<boolean> {
    const container = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!container || nodes.length === 0) return false;

    try {
        const nodesBounds = getNodesBounds(nodes);

        const padding = 60;
        const titleBarHeight = title ? 72 : 0; // space reserved at top for title

        nodesBounds.x -= padding;
        nodesBounds.y -= padding;
        nodesBounds.width += padding * 2;
        nodesBounds.height += padding * 2;

        const imageWidth = Math.max(Math.ceil(nodesBounds.width), 600);
        const imageHeight = Math.ceil(nodesBounds.height);
        const totalHeight = imageHeight + titleBarHeight;

        const transform = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 0);

        // 1. Capture the flow viewport as PNG
        const flowDataUrl = await toPng(container, {
            backgroundColor: '#0F172A',
            width: imageWidth,
            height: imageHeight,
            pixelRatio: 2,
            style: {
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                transformOrigin: 'top left',
            }
        });

        // 2. Composite: draw title header + flow image on a Canvas 2D
        const canvas = document.createElement('canvas');
        const dpr = 2;
        canvas.width = imageWidth * dpr;
        canvas.height = totalHeight * dpr;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(dpr, dpr);

        // Background fill
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, imageWidth, totalHeight);

        if (title) {
            // Thin separator line at bottom of title bar
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(0, titleBarHeight - 1, imageWidth, 1);

            // Centered title text only
            ctx.fillStyle = '#E2E8F0';
            ctx.font = 'bold 20px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, imageWidth / 2, titleBarHeight / 2);
            ctx.textAlign = 'left';

            // Subtle watermark bottom-right
            ctx.fillStyle = '#334155';
            ctx.font = '11px Inter, system-ui, sans-serif';
            ctx.textBaseline = 'bottom';
            ctx.fillText('fluscope.app', imageWidth - padding, totalHeight - 14);
        }

        // Draw the captured flow image below the title
        await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, titleBarHeight, imageWidth, imageHeight);
                resolve();
            };
            img.src = flowDataUrl;
        });

        // 3. Download
        const finalDataUrl = canvas.toDataURL('image/png');
        const slug = (title || 'graph').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const a = document.createElement('a');
        a.href = finalDataUrl;
        a.download = `fluscope-${slug}.png`;
        a.click();
        return true;
    } catch (e) {
        console.error('Failed to export canvas as PNG', e);
        return false;
    }
}

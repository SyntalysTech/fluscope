import { FluscopeNode, FluscopeEdge, AuditIssue, AiConfidence, FlowType } from '@/types/flow';

// Keywords that warrant automatic escalation to critical severity
const CRITICAL_ESCALATION_KEYWORDS = [
    'security', 'abuse', 'data leak', 'payment failure', 'account compromise',
    'brute force', 'rate limit', 'injection', 'exploit', 'takeover',
    'fraud', 'session', 'unauthorized', 'bypass', 'vulnerability'
];

function needsEscalation(text: string): boolean {
    const lower = text.toLowerCase();
    return CRITICAL_ESCALATION_KEYWORDS.some(kw => lower.includes(kw));
}

function computeAiConfidence(
    issues: AuditIssue[],
    nodes: FluscopeNode[],
    edges: FluscopeEdge[],
    flowType: FlowType
): AiConfidence {
    let score = 0;

    // More issues = more signal
    if (issues.length >= 5) score += 2;
    else if (issues.length >= 2) score += 1;

    // Structural complexity
    const complexity = nodes.length + edges.length;
    if (complexity >= 10) score += 2;
    else if (complexity >= 5) score += 1;

    // Recognized flow type increases confidence (not generic)
    if (flowType !== 'GENERIC FLOW') score += 1;

    if (score >= 4) return 'High';
    if (score >= 2) return 'Medium';
    return 'Low';
}

export async function runIntelligentAudit(
    nodes: FluscopeNode[],
    edges: FluscopeEdge[]
): Promise<{ issues: AuditIssue[], aiConfidence: AiConfidence }> {
    try {
        const payload = {
            nodes: nodes.map(n => ({ id: n.id, label: n.data.label })),
            edges: edges.map(e => ({ source: e.source, target: e.target }))
        };

        const res = await fetch('/api/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ graphData: payload })
        });

        if (!res.ok) {
            console.error('AI Audit request failed:', res.statusText);
            return { issues: [], aiConfidence: 'Low' };
        }

        const data = await res.json();

        const issues: AuditIssue[] = (data.issues || []).map((i: any) => {
            // Severity escalation logic
            const combined = `${i.title} ${i.description} ${i.whyThisMatters || ''}`;
            const escalate = needsEscalation(combined);
            const finalSeverity = escalate ? 'critical' : (i.severity || 'suggestion');

            return {
                id: Math.random().toString(36).substring(7),
                type: finalSeverity,
                title: i.title,
                description: i.description,
                whyItMatters: i.whyThisMatters || undefined,
                quickFix: i.quickFix || undefined,
                affectedNodes: Array.isArray(i.affectedNodes) ? i.affectedNodes : [],
                isAiInsight: true
            };
        });

        // Determine flow type for confidence scoring (naive detection from nodes)
        const labels = nodes.map(n => n.data.label?.toLowerCase() || '').join(' ');
        let flowType: FlowType = 'GENERIC FLOW';
        if (labels.includes('login') || labels.includes('signup')) flowType = 'AUTH';
        else if (labels.includes('checkout') || labels.includes('payment')) flowType = 'CHECKOUT';
        else if (labels.includes('onboarding') || labels.includes('tutorial')) flowType = 'ONBOARDING';

        const aiConfidence = computeAiConfidence(issues, nodes, edges, flowType);

        return { issues, aiConfidence };
    } catch (error) {
        console.error('Failed to run intelligent audit:', error);
        return { issues: [], aiConfidence: 'Low' };
    }
}


import { FluscopeNode, FluscopeEdge, AuditResult, AuditIssue, FlowType } from '../types/flow';
import { runAuthRules, runCheckoutRules, runDashboardRules, runGraphRules } from './rules';

function detectFlowType(nodes: FluscopeNode[]): FlowType {
    const allLabels = nodes.map(n => (n.data.label || '').toLowerCase());
    const str = allLabels.join(' ');

    if (str.includes('login') || str.includes('signup')) return 'AUTH';
    if (str.includes('checkout') || str.includes('payment')) return 'CHECKOUT';
    if (str.includes('onboarding') || str.includes('tutorial')) return 'ONBOARDING';

    return 'GENERIC FLOW';
}

function calculateScoreLabel(score: number): string {
    if (score >= 90) return 'Production Ready';
    if (score >= 75) return 'Needs Minor Improvements';
    if (score >= 50) return 'High Risk Areas';
    return 'Structurally Fragile';
}

export function calculateScoreAndLabel(issues: AuditIssue[]): { score: number, scoreLabel: string } {
    let score = 100;
    issues.forEach(i => {
        if (i.type === 'critical') score -= 12;
        if (i.type === 'warning') score -= 6;
        if (i.type === 'suggestion') score -= 3;
    });

    score = Math.max(0, score);
    const scoreLabel = calculateScoreLabel(score);
    return { score, scoreLabel };
}

export function runDeterministicAudit(nodes: FluscopeNode[], edges: FluscopeEdge[]): AuditResult {
    const allLabels = nodes.map(n => (n.data.label || '').toLowerCase());

    // Rule runner pipeline
    const authIssues = runAuthRules(nodes, allLabels);
    const checkoutIssues = runCheckoutRules(nodes, allLabels);
    const dashboardIssues = runDashboardRules(nodes, allLabels);
    const structuralIssues = runGraphRules(nodes, edges);

    const issues: AuditIssue[] = [
        ...authIssues,
        ...checkoutIssues,
        ...dashboardIssues,
        ...structuralIssues
    ];

    const { score, scoreLabel } = calculateScoreAndLabel(issues);
    const detectedFlowType = detectFlowType(nodes);

    return { score, issues, detectedFlowType, scoreLabel };
}

export function runAudit(nodes: FluscopeNode[], edges: FluscopeEdge[]): AuditResult {
    return runDeterministicAudit(nodes, edges);
}

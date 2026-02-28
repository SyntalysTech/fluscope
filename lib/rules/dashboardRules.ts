import { FluscopeNode, AuditIssue } from '../../types/flow';

export function runDashboardRules(nodes: FluscopeNode[], allLabels: string[]): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const dashNodes = nodes.filter(n => (n.data.label || '').toLowerCase().includes('dashboard'));

    if (dashNodes.length > 0) {
        const hasEmpty = allLabels.some(l => l.includes('empty'));
        const hasError = allLabels.some(l => l.includes('error'));
        const hasLoading = allLabels.some(l => l.includes('loading'));

        const affectedNodes = dashNodes.map(n => n.id);

        if (!hasEmpty) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'suggestion', title: 'Missing Dashboard Empty State', description: 'New users with no data have no guided empty state.', affectedNodes });
        }
        if (!hasError) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'warning', title: 'Missing Dashboard Error State', description: 'Data fetching failures have no visible error state.', affectedNodes });
        }
        if (!hasLoading) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'suggestion', title: 'Missing Dashboard Loading State', description: 'Users receive no feedback while dashboard data loads.', affectedNodes });
        }
    }

    return issues;
}

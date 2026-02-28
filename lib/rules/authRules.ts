import { FluscopeNode, AuditIssue } from '../../types/flow';

export function runAuthRules(nodes: FluscopeNode[], allLabels: string[]): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const loginNodes = nodes.filter(n => (n.data.label || '').toLowerCase().includes('login'));

    if (loginNodes.length > 0) {
        const hasForgot = allLabels.some(l => l.includes('forgot'));
        const hasError = allLabels.some(l => l.includes('error'));
        const hasSignup = allLabels.some(l => l.includes('signup') || l.includes('register'));

        const affectedNodes = loginNodes.map(n => n.id);

        if (!hasForgot) {
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'warning',
                title: 'Missing Forgot Password',
                description: 'Users who forgot their password cannot recover it here.',
                affectedNodes
            });
        }
        if (!hasError) {
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'warning',
                title: 'Missing Error state',
                description: 'Failed authentication attempts have no visible error handling.',
                affectedNodes
            });
        }
        if (!hasSignup) {
            issues.push({
                id: Math.random().toString(36).substring(7),
                type: 'warning',
                title: 'Missing Signup state',
                description: 'Users without an account cannot create one from this flow.',
                affectedNodes
            });
        }
    }

    return issues;
}

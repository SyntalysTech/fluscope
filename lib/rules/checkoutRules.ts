import { FluscopeNode, AuditIssue } from '../../types/flow';

export function runCheckoutRules(nodes: FluscopeNode[], allLabels: string[]): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const checkoutNodes = nodes.filter(n => {
        const l = (n.data.label || '').toLowerCase();
        return l.includes('checkout') || l.includes('payment');
    });

    if (checkoutNodes.length > 0) {
        const hasSuccess = allLabels.some(l => l.includes('success'));
        const hasFailed = allLabels.some(l => l.includes('failed') || l.includes('error'));
        const hasRetry = allLabels.some(l => l.includes('retry'));
        const hasCancel = allLabels.some(l => l.includes('cancel'));

        const affectedNodes = checkoutNodes.map(n => n.id);

        if (!hasSuccess) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'critical', title: 'Missing Checkout Success', description: 'There is no success confirmation after a payment.', affectedNodes });
        }
        if (!hasFailed) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'critical', title: 'Missing Checkout Failed', description: 'If a payment fails, the user is left without feedback.', affectedNodes });
        }
        if (!hasRetry) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'suggestion', title: 'Missing Checkout Retry', description: 'Users have no clear way to retry a failed payment.', affectedNodes });
        }
        if (!hasCancel) {
            issues.push({ id: Math.random().toString(36).substring(7), type: 'suggestion', title: 'Missing Checkout Cancel', description: 'Users cannot abandon the payment flow gracefully.', affectedNodes });
        }
    }

    return issues;
}

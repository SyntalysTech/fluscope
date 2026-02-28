import { Node, Edge } from '@xyflow/react';

export type FluscopeNodeData = {
    label: string;
    onChange?: (id: string, label: string) => void;
    issueSeverity?: 'critical' | 'warning' | 'suggestion';
    activeHighlight?: boolean;
};

export type FluscopeNode = Node<FluscopeNodeData>;
export type FluscopeEdge = Edge;

export type RuleIssueType = 'critical' | 'warning' | 'suggestion';

export type FlowType = 'AUTH' | 'CHECKOUT' | 'ONBOARDING' | 'GENERIC FLOW';

export type AiConfidence = 'High' | 'Medium' | 'Low';

export interface AuditIssue {
    id: string;
    type: RuleIssueType;
    title: string;
    description: string;
    affectedNodes: string[];
    isAiInsight?: boolean;
    whyItMatters?: string;
    quickFix?: string;
}

export interface AuditResult {
    score: number;
    issues: AuditIssue[];
    detectedFlowType: FlowType;
    scoreLabel: string;
    aiConfidence?: AiConfidence;
}


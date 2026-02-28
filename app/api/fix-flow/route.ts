import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { nodes, edges, issues } = await req.json();

    if (!nodes || !edges) {
      return NextResponse.json({ error: 'Missing graph data' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Build a clear issues block for the prompt
    const issuesSummary = issues && issues.length > 0
      ? `\n\nKNOWN ISSUES TO FIX (detected by rule engine):\n${issues.map((i: any) =>
        `- [${i.type.toUpperCase()}] ${i.title}: ${i.description}${i.affectedNodes?.length ? ` (affected nodes: ${i.affectedNodes.join(', ')})` : ''}`
      ).join('\n')}`
      : '';

    const systemPrompt = `You are an expert SaaS product architect and UX engineer.
The user provides a partial, broken, or incomplete product flow graph (nodes + edges) AND a list of specific issues detected by a rule engine.

Your task:
1. Fix EVERY issue listed — add the missing nodes and edges described in each issue.
2. Connect all isolated or dead-end nodes into a coherent flow.
3. Ensure every decision node (decisionNode) has at least two outgoing edges (Yes/No or equivalent).
4. Ensure the flow ends with a terminalNode (type: "terminalNode").
5. Do NOT remove existing working nodes unless they are clearly redundant.
6. Keep node labels short and clear (2-4 words max).
7. The 'sourceHandle' must be "right-source" or "bottom-source". The 'targetHandle' must be "left-target" or "top-target".

Return ONLY this exact JSON schema (no markdown, no extra text):
{
  "nodes": [
    { "id": "unique-id", "type": "screenNode" | "decisionNode" | "terminalNode", "data": { "label": "Short Label" } }
  ],
  "edges": [
    { "id": "unique-e-id", "source": "source-id", "target": "target-id", "sourceHandle": "right-source", "targetHandle": "left-target", "label": "Optional (Yes/No/Error)" }
  ]
}`;

    const userPrompt = `Current graph:
${JSON.stringify({ nodes, edges })}${issuesSummary}

Fix all listed issues and return the complete corrected graph.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.15
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content || '{}');

    // Ensure nodes have position so auto-layout handles them
    if (parsed.nodes) {
      parsed.nodes = parsed.nodes.map((n: any, idx: number) => ({
        ...n,
        position: n.position || { x: (idx % 4) * 260, y: Math.floor(idx / 4) * 160 + 100 }
      }));
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('OpenAI Fix Error:', error);
    return NextResponse.json({ error: 'Failed to fix flow' }, { status: 500 });
  }
}

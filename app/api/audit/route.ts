import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { graphData } = body;

        if (!graphData) {
            return NextResponse.json({ error: 'Missing graph data' }, { status: 400 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const systemPrompt = `You are an elite product review system analyzing a flow graph. 
You consist of four perspectives:
1. SENIOR SAAS ARCHITECT: Looks for state explosion, scalability bottlenecks, missing cancellation paths, and missing fallback states.
2. SECURITY REVIEWER: Looks for authentication abuse risks, brute-force vulnerabilities, account enumeration, and broken access control.
3. UX RESEARCHER: Looks for complete confirmation flows, poor error feedback loops, user confusion paths, ambiguous navigation, and infinite retry patterns.
4. PRODUCT GROWTH STRATEGIST: Looks for revenue leakage scenarios, incomplete activation loops, and retention blockers.

Your task is to detect high-value, deep structural and business-logic flaws.
Do NOT repeat basic deterministic checks (like "node is disconnected").
Do NOT give generic advice. Do NOT write essays. Do NOT add fluff. Do NOT use marketing tone.
Descriptions and quick fixes must be extremely concise, sharp, and actionable.

Return ONLY a valid JSON object matching this schema exactly:
{
  "issues": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "title": "string (Max 6 words, punchy)",
      "description": "string (1-2 short sentences maximum. Direct and sharp.)",
      "whyThisMatters": "string (1 short sentence on business/security risk)",
      "quickFix": "string (1 short sentence on exact structural change needed)",
      "affectedNodes": ["<node-id>"]
    }
  ]
}`;

        const userPrompt = `Analyze this product flow graph:
${JSON.stringify(graphData, null, 2)}

Return your audit as strict JSON.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3
        });

        const content = response.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));
    } catch (error) {
        console.error('OpenAI Audit Error:', error);
        return NextResponse.json({ error: 'Failed to run AI audit' }, { status: 500 });
    }
}


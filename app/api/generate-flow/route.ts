import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const systemPrompt = `You are an expert, paranoid SaaS product architect.
Your task is to take a raw description of a software application and output a comprehensive, logical Fluscope graph JSON that models the user journey.

CRITICAL ARCHITECT RULES:
1. Think like a paranoid SaaS architect. Anticipate edge cases.
2. ALWAYS include: Error states, Retry paths, Exit paths, Confirmation states, Validation checks, Access control validation, and Revenue protection logic (if payments are involved).
3. NEVER generate isolated nodes. Everything must connect.
4. NEVER generate dead ends without explanation. Always connect flows back logically (e.g., from an Error back to the Retry node, or to a Terminal node).
5. Add sensible "label" strings to edges derived from decisions (e.g. "Yes", "No", "Error", "Invalid", "Success") when relevant.

NODE TYPES:
- "screenNode": For static pages, forms, emails, or views.
- "decisionNode": For logical splits (e.g., "Is logged in?", "Payment valid?").
- "terminalNode": For endpoints, success states, critical errors, or absolute logouts.

Return ONLY this exact JSON schema:
{
  "nodes": [
    {
      "id": "unique-alphanumeric-id",
      "type": "screenNode" | "decisionNode" | "terminalNode",
      "data": { "label": "Short Actionable Name" }
    }
  ],
  "edges": [
    {
      "id": "unique-e-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "sourceHandle": "right-source",
      "targetHandle": "left-target",
      "label": "Optional Edge Text"
    }
  ]
}

Ensure 'sourceHandle' uses "right-source" or "bottom-source" and 'targetHandle' uses "left-target" or "top-target".`;

    const userPrompt = `Build a flow graph for this application description:
"${prompt}"

Generate the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content || '{}');

    // Ensure some baseline position data so they don't spawn at 0,0 
    // We will layout them with auto-layout in the frontend, but we need initial positions to avoid crashes.
    if (parsed.nodes) {
      parsed.nodes = parsed.nodes.map((n: any, idx: number) => ({
        ...n,
        position: { x: idx * 250, y: 100 }
      }));
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('OpenAI Gen Error:', error);
    return NextResponse.json({ error: 'Failed to generate flow' }, { status: 500 });
  }
}

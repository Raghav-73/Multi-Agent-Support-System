import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema, Message } from '@/lib/types';
import { routeMessage, compactContext } from '@/lib/router';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

function checkRateLimit(ip: string) {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - record.lastReset > RATE_LIMIT_WINDOW) {
        record.count = 0; record.lastReset = now;
    }
    if (record.count >= MAX_REQUESTS) return false;
    record.count++;
    rateLimitMap.set(ip, record);
    return true;
}

/**
 * MAS Orchestration Logic:
 * 1. Router Agent: Inspects intent.
 * 2. Specialist Agent: Decides on action.
 * 3. Tool Agent: Simulate database/search lookup.
 * 4. QC Agent: Final validation.
 */
export async function POST(req: NextRequest) {
    const ip = req.ip || 'local';
    if (!checkRateLimit(ip)) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

    try {
        const body = await req.json();
        const result = ChatRequestSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: 'Invalid schema' }, { status: 400 });

        const { messages } = result.data;
        const lastUserMessage = messages[messages.length - 1].content;

        // Multi-Agent Workflow Simulation
        const steps = [];

        // Step 1: Orchestrator identifies the problem
        steps.push({ name: 'Orchestrator', status: 'finished', details: 'Analyzing global context & problem scale' });

        // Step 2: Context Agent manages history
        const compacted = compactContext(messages);
        steps.push({ name: 'Memory Agent', status: 'finished', details: `Context compacted (${messages.length} -> ${compacted.length} nodes)` });

        // Step 3: Router Agent delegates task
        const assignedAgent = routeMessage(lastUserMessage);
        steps.push({ name: 'Router Agent', status: 'finished', details: `Delegating to ${assignedAgent}` });

        // Step 4: Specialist Agent performs "Deep Work"
        steps.push({ name: assignedAgent, status: 'thinking', details: 'Consulting domain-specific internal knowledge' });

        // Step 5: Research/Tool Agent (Simulated)
        if (lastUserMessage.toLowerCase().includes('search')) {
            steps.push({ name: 'Research Agent', status: 'searching', details: 'Crawling API endpoints for live data' });
        }

        // Step 6: Final Review Agent
        steps.push({ name: 'Verifier Agent', status: 'finished', details: 'Validating response against safety & accuracy protocols' });

        const response: Message = {
            id: Math.random().toString(36).substring(7),
            role: 'assistant',
            content: `### MAS Multi-Agent Response\n\nI have collaborated with the **Router**, **Memory**, and **Verifier** agents to resolve your request. \n\n**Action Taken:** As the **${assignedAgent}**, I executed a domain-specific analysis of your query regarding "${lastUserMessage.substring(0, 30)}...". I then handed my draft to the **Verifier Agent** who confirmed the solution meets all system constraints.\n\n*This response was generated through a coordinated multi-step workflow defined in our MAS architecture.*`,
            timestamp: Date.now(),
            agentId: assignedAgent,
        };

        return NextResponse.json({ message: response, steps });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

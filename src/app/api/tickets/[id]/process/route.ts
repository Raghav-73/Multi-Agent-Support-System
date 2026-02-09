import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { runMultiAgentWorkflow } from '@/lib/agents';

// Use this to fix the params type error in Next.js 15+
type Params = Promise<{ id: string }>;

export async function POST(req: NextRequest, { params }: { params: Params }) {
    try {
        const { id } = await params;
        await connectDB();

        const ticket = await Ticket.findById(id);
        if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

        // Run the MAS workflow
        const { category, sentiment, aiDraft, logs } = await runMultiAgentWorkflow(ticket.message);

        // Update ticket with AI results
        ticket.category = category;
        ticket.sentiment = sentiment;
        ticket.ai_draft = aiDraft;
        ticket.agent_logs = [...ticket.agent_logs, ...logs];

        await ticket.save();

        return NextResponse.json(ticket);
    } catch (err) {
        console.error('Processing Error:', err);
        return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
    }
}

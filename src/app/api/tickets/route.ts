import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET() {
    await connectDB();
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { customer_name, message } = await req.json();

        const ticket = await Ticket.create({
            customer_name,
            message,
            agent_logs: [{
                agent: "System",
                thought: "Ticket received and queued for AI analysis.",
                timestamp: new Date()
            }]
        });

        return NextResponse.json(ticket);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }
}

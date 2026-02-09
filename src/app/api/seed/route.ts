import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET() {
    await connectDB();

    const mockTickets = [
        {
            customer_name: "Alice Johnson",
            message: "I am having trouble logging into my account. It says 'Invalid password' even though I reset it.",
            status: "open",
            agent_logs: [{ agent: "System", thought: "Initial ingestion" }]
        },
        {
            customer_name: "Bob Smith",
            message: "I was charged twice for my subscription this month. Can I get a refund for the extra charge?",
            status: "open",
            agent_logs: [{ agent: "System", thought: "Initial ingestion" }]
        },
        {
            customer_name: "Charlie Davis",
            message: "How do I export my data from the platform? I've been looking everywhere in the settings.",
            status: "open",
            agent_logs: [{ agent: "System", thought: "Initial ingestion" }]
        }
    ];

    await Ticket.deleteMany({});
    await Ticket.insertMany(mockTickets);

    return NextResponse.json({ message: "Database seeded with 3 tickets" });
}

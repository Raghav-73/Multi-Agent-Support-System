import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    try {
        const { id } = await params;
        const { status } = await req.json();

        await connectDB();
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json(ticket);
    } catch (err) {
        console.error('Update Error:', err);
        return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
    }
}

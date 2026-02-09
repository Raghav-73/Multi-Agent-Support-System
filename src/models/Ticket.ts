import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    customer_name: string;
    message: string;
    status: 'open' | 'closed';
    category?: 'Technical' | 'Billing' | 'General';
    sentiment?: 'Angry' | 'Neutral' | 'Happy';
    ai_draft?: string;
    agent_logs: Array<{
        agent: string;
        thought: string;
        timestamp: Date;
    }>;
    createdAt: Date;
}

const TicketSchema: Schema = new Schema({
    customer_name: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    category: { type: String },
    sentiment: { type: String },
    ai_draft: { type: String },
    agent_logs: [{
        agent: { type: String },
        thought: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

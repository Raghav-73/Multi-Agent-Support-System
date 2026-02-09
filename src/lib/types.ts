import { z } from 'zod';

export const MessageSchema = z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.number(),
    agentId: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;

export const AgentStateSchema = z.object({
    status: z.enum(['idle', 'thinking', 'searching', 'executing', 'finished']),
    agentName: z.string(),
});

export type AgentState = z.infer<typeof AgentStateSchema>;

export const ChatRequestSchema = z.object({
    messages: z.array(MessageSchema),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const AGENTS = {
    TECHNICAL: 'Technical Specialist',
    SUPPORT: 'General Support',
    BILLING: 'Billing & Accounting',
};

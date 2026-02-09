import { Message, AGENTS } from './types';

export function routeMessage(content: string): string {
    const lower = content.toLowerCase();
    if (lower.includes('code') || lower.includes('bug') || lower.includes('error')) {
        return AGENTS.TECHNICAL;
    }
    if (lower.includes('bill') || lower.includes('invoice') || lower.includes('payment')) {
        return AGENTS.BILLING;
    }
    return AGENTS.SUPPORT;
}

export function compactContext(messages: Message[]): Message[] {
    if (messages.length <= 5) return messages;

    const systemPrompt = messages.find(m => m.role === 'system');
    const recentMessages = messages.slice(-3);

    const summary: Message = {
        id: 'summary-' + Date.now(),
        role: 'system',
        content: '[Context Compacted: Previous conversation history summarized to save tokens]',
        timestamp: Date.now(),
    };

    return systemPrompt ? [systemPrompt, summary, ...recentMessages] : [summary, ...recentMessages];
}

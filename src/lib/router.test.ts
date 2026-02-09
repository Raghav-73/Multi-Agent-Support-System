import { describe, it, expect } from 'vitest';
import { routeMessage } from '@/lib/router';
import { AGENTS } from '@/lib/types';

describe('routeMessage', () => {
    it('should route technical messages to TECHNICAL agent', () => {
        expect(routeMessage('I have a bug in my code')).toBe(AGENTS.TECHNICAL);
        expect(routeMessage('Error in the application')).toBe(AGENTS.TECHNICAL);
    });

    it('should route billing messages to BILLING agent', () => {
        expect(routeMessage('I need to pay my invoice')).toBe(AGENTS.BILLING);
        expect(routeMessage('Where is my bill?')).toBe(AGENTS.BILLING);
    });

    it('should route general messages to SUPPORT agent', () => {
        expect(routeMessage('How do I use this?')).toBe(AGENTS.SUPPORT);
        expect(routeMessage('Hello there')).toBe(AGENTS.SUPPORT);
    });
});

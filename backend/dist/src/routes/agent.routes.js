import { Hono } from 'hono';
const agentRoutes = new Hono();
const agents = [
    {
        type: 'SUPPORT',
        name: 'Support Agent',
        description: 'Handles general support inquiries, FAQs, and troubleshooting.',
        capabilities: ['Query conversation history', 'General assistance']
    },
    {
        type: 'ORDER',
        name: 'Order Agent',
        description: 'Handles order status, tracking, modifications, and cancellations.',
        capabilities: ['Fetch order details', 'Check delivery status']
    },
    {
        type: 'BILLING',
        name: 'Billing Agent',
        description: 'Handles payment issues, refunds, invoices, and subscription queries.',
        capabilities: ['Get invoice details', 'Check refund status']
    }
];
agentRoutes.get('/', (c) => c.json(agents));
agentRoutes.get('/:type/capabilities', (c) => {
    const type = c.req.param('type').toUpperCase();
    const agent = agents.find(a => a.type === type);
    if (!agent)
        return c.json({ error: 'Agent not found' }, 404);
    return c.json({ capabilities: agent.capabilities });
});
export default agentRoutes;

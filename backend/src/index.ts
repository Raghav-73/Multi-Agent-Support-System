import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/error.middleware.js'
import chatRoutes from './routes/chat.routes.js'
import agentRoutes from './routes/agent.routes.js'
import * as dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['x-conversation-id'],
}))

import seed from '../prisma/seed.js'

app.get('/', (c) => c.text('Multi-Agent API is running'))

app.get('/seed', async (c) => {
    try {
        await seed()
        return c.json({ message: 'Database seeded successfully' })
    } catch (err: any) {
        return c.json({ error: err.message }, 500)
    }
})
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
app.route('/api/chat', chatRoutes)
app.route('/api/agents', agentRoutes)

// Error Handling
app.onError(errorHandler)

const port = Number(process.env.PORT) || 3000

if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
    console.log(`Server is running on port ${port}`)
    serve({
        fetch: app.fetch,
        port
    })
}

export default app

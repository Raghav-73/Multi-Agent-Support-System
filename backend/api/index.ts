import { handle } from 'hono/vercel'
import app from '../dist/src/index.js'

export const config = {
    runtime: 'nodejs18.x'
}

export default handle(app)

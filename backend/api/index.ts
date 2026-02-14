import { handle } from 'hono/vercel'
// @ts-ignore
import app from '../dist/src/index.js'

export const config = {
    runtime: 'nodejs'
}

export default handle(app)

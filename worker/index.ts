import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

app.get('/api/', (c) => {
  console.log('✅ Worker: GET / called')
  return c.json({
    name: 'Cloudflare Worker',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

export default app

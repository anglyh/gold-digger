import http from 'node:http'
import { serveStatic } from "./utils/serveStatic.js"
import { handlePDF, handlePriceUpdate } from "./handlers/routeHandlers.js"

const PORT = 8000
const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {
  if (req.url === '/api') {
    if (req.method === 'GET') {

    } else if (req.method === 'POST') {
      return await handlePDF(req, res)
    }
  } else if (req.url === '/api/prices') {
    return await handlePriceUpdate(req, res)
  } else if (!req.url.startsWith('/api')) {
    await serveStatic(req, res, __dirname)
  }

})

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
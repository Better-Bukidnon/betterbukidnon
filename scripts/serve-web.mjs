import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../apps/web/dist/client')
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath)
  const relative = decoded.replace(/^\/+/, '')
  const candidate = path.resolve(root, relative || 'index.html')
  if (!candidate.startsWith(`${root}${path.sep}`) && candidate !== path.join(root, 'index.html'))
    return undefined

  try {
    const details = await stat(candidate)
    const file = details.isDirectory() ? path.join(candidate, 'index.html') : candidate
    await stat(file)
    return file
  } catch {
    return undefined
  }
}

async function resolveNotFound(urlPath) {
  let directory = path.resolve(root, `.${decodeURIComponent(urlPath)}`)
  while (directory === root || directory.startsWith(`${root}${path.sep}`)) {
    const candidate = path.join(directory, '404.html')
    try {
      await stat(candidate)
      return candidate
    } catch {
      const parent = path.dirname(directory)
      if (parent === directory) break
      directory = parent
    }
  }
  return path.join(root, '404.html')
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost')
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    response.writeHead(301, { location: `${url.pathname.replace(/\/$/, '')}${url.search}` })
    response.end()
    return
  }

  const file = await resolveFile(url.pathname)
  const notFound = !file
  const target = file ?? (await resolveNotFound(url.pathname))
  try {
    const body = await readFile(target)
    response.writeHead(notFound ? 404 : 200, {
      'content-type': mime[path.extname(target)] ?? 'application/octet-stream',
    })
    response.end(body)
  } catch {
    response.writeHead(503)
    response.end('Build the site first with pnpm build.')
  }
}).listen(8322, '127.0.0.1')

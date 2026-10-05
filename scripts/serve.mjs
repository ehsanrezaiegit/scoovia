import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveStaticPath } from './static-path.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.argv[2] || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Use a port from 1 to 65535: npm run dev -- 3001');
  process.exit(1);
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};
const server = createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end('Method not allowed');
      return;
    }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolveStaticPath(root, path);
    if (file === null) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 :
      ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500;
    res.writeHead(status);
    res.end(status === 404 ? 'Not found' : 'Request failed');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is busy. Try: npm run dev -- ${port + 1}`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`SCOOVIA: http://127.0.0.1:${port}`);
  console.log(`English: http://127.0.0.1:${port}/?lang=en`);
  console.log('Stop with Ctrl+C. No dependencies or build step required.');
});

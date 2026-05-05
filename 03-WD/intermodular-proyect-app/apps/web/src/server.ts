import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const handler = createStartHandler({ handler: defaultStreamHandler });
const PORT = Number(process.env['PORT'] ?? 3000);
const CLIENT_DIST_DIR = resolve(process.cwd(), 'dist', 'client');
const API_BASE_URL =
  process.env['PUBLIC_API_BASE_URL'] ?? 'http://localhost:4000';

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

console.log('[server-entry] custom src/server.ts loaded');

function readBody(req: IncomingMessage): Promise<Buffer | null> {
  if (req.method === 'GET' || req.method === 'HEAD')
    return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () =>
      resolve(chunks.length > 0 ? Buffer.concat(chunks) : null),
    );
    req.on('error', reject);
  });
}

async function tryServeClientAsset(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const method = req.method ?? 'GET';
  if (method !== 'GET' && method !== 'HEAD') return false;

  const rawPath = req.url?.split('?')[0] ?? '/';
  if (!rawPath.startsWith('/assets/')) return false;

  const decodedPath = decodeURIComponent(rawPath);
  const assetPath = resolve(CLIENT_DIST_DIR, `.${decodedPath}`);

  // Prevent directory traversal outside dist/client.
  if (!assetPath.startsWith(CLIENT_DIST_DIR)) return false;

  try {
    await access(assetPath);
  } catch {
    return false;
  }

  const contentType = CONTENT_TYPES[extname(assetPath).toLowerCase()];
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  if (method === 'HEAD') {
    res.writeHead(200);
    res.end();
    return true;
  }

  await new Promise<void>((resolveDone, rejectDone) => {
    const stream = createReadStream(assetPath);
    stream.on('error', rejectDone);
    res.on('error', rejectDone);
    res.on('finish', () => resolveDone());
    stream.pipe(res);
  });

  return true;
}

async function sendWebResponse(
  res: ServerResponse,
  webRes: Response,
): Promise<void> {
  const resHeaders: Record<string, string[]> = {};
  webRes.headers.forEach((value, key) => {
    const existing = resHeaders[key];
    if (existing !== undefined) {
      existing.push(value);
    } else {
      resHeaders[key] = [value];
    }
  });

  res.writeHead(webRes.status, resHeaders);

  if (webRes.body) {
    const reader = webRes.body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      res.end();
    }
  } else {
    res.end();
  }
}

async function tryProxyApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const rawPath = req.url ?? '/';
  if (!rawPath.startsWith('/api/')) return false;

  const method = req.method ?? 'GET';
  const body = await readBody(req);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (key.toLowerCase() === 'host') continue;

    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else {
      headers.set(key, value);
    }
  }

  try {
    const apiRes = await fetch(`${API_BASE_URL}${rawPath}`, {
      method,
      headers,
      body: body !== null && body.length > 0 ? new Uint8Array(body) : undefined,
      redirect: 'manual',
    });

    await sendWebResponse(res, apiRes);
  } catch (error) {
    console.error('[api-proxy] failed request', {
      target: `${API_BASE_URL}${rawPath}`,
      method,
      error,
    });

    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          message:
            'No se pudo contactar con la API backend. Revisa PUBLIC_API_BASE_URL y conectividad.',
        }),
      );
    }
  }

  return true;
}

createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (await tryServeClientAsset(req, res)) {
      return;
    }

    if (await tryProxyApiRequest(req, res)) {
      return;
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = Array.isArray(forwardedProto)
      ? forwardedProto[0]
      : (forwardedProto?.split(',')[0]?.trim() ?? 'http');
    const forwardedHost = req.headers['x-forwarded-host'];
    const host = Array.isArray(forwardedHost)
      ? forwardedHost[0]
      : (forwardedHost ?? req.headers.host ?? `localhost:${PORT}`);
    const url = `${protocol}://${host}${req.url ?? '/'}`;
    const body = await readBody(req);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, v);
      } else {
        headers.set(key, value);
      }
    }

    const webReq = new Request(url, {
      method: req.method ?? 'GET',
      headers,
      body: body !== null && body.length > 0 ? new Uint8Array(body) : undefined,
    });

    const webRes = await handler(webReq);
    await sendWebResponse(res, webRes);
  } catch (err) {
    console.error('[server] error:', err);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(PORT, () => {
  console.log(`[tanstack-start] listening on http://0.0.0.0:${PORT}`);
});

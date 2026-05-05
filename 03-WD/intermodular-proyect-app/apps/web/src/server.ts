import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';

const handler = createStartHandler({ handler: defaultStreamHandler });
const PORT = Number(process.env['PORT'] ?? 3000);

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

createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
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
  } catch (err) {
    console.error('[server] error:', err);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(PORT, () => {
  console.log(`[tanstack-start] listening on http://0.0.0.0:${PORT}`);
});

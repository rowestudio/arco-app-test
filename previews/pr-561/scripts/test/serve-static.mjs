import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const port = Number.parseInt(process.env.PORT || process.env.ARCO_TEST_PORT || '4173', 10);
const host = process.env.HOST || '127.0.0.1';

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
]);

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(body);
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(decodedPath === '/' ? '/index.html' : decodedPath);
  const withoutLeadingSlash = normalizedPath.replace(/^[/\\]+/, '');
  const filePath = resolve(join(repoRoot, withoutLeadingSlash));
  const pathIsInsideRepo = filePath === repoRoot || relative(repoRoot, filePath).split(sep)[0] !== '..';

  if (!pathIsInsideRepo) {
    return null;
  }

  return filePath;
}

const server = createServer((req, res) => {
  if (!req.url || req.method !== 'GET') {
    send(res, 405, 'Method not allowed');
    return;
  }

  const filePath = resolveRequestPath(req.url);
  if (!filePath) {
    send(res, 403, 'Forbidden');
    return;
  }

  let fileStat;
  try {
    fileStat = statSync(filePath);
  } catch {
    send(res, 404, 'Not found');
    return;
  }

  if (!fileStat.isFile()) {
    send(res, 404, 'Not found');
    return;
  }

  res.writeHead(200, {
    'content-length': fileStat.size,
    'content-type': contentTypes.get(extname(filePath).toLowerCase()) || 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Arco Motion local test server running at http://${host}:${port}`);
});

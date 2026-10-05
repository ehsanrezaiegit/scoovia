import test from 'node:test';
import assert from 'node:assert/strict';
import { posix, win32, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolveStaticPath } from '../scripts/static-path.mjs';

test('Windows asset paths with native backslashes stay inside the public folder', () => {
  for (const root of ['C:\\Projects\\scoovia-v03\\dist', 'C:\\Users\\Ehsan\\Desktop\\Ice Cream\\dist']) {
    for (const file of ['assets/logo.svg', 'assets/hero.webp', 'assets/hero-berry.webp', 'assets/hero-chocolate.webp', 'assets/vazirmatn-400.woff2', 'assets/scoops.webp']) {
      assert.equal(resolveStaticPath(root, '/' + file, win32), win32.join(root, ...file.split('/')));
    }
  }
});

test('Both filesystem styles reject escapes but accept ordinary nested files', () => {
  for (const [path, root] of [[win32, 'C:\\project\\dist'], [posix, '/project/dist']]) {
    assert.equal(resolveStaticPath(root, '/', path), root);
    assert.equal(resolveStaticPath(root, '/assets/logo.svg', path), path.join(root, 'assets', 'logo.svg'));
    for (const request of ['/../private.txt', '/../dist-copy/private.txt', '/../../private.txt', '/assets\\..\\..\\private.txt', '/assets/\0bad.webp', 'assets/logo.svg']) {
      assert.equal(resolveStaticPath(root, request, path), null, request);
    }
  }
});

test('Actual local server returns every bundled file intact and handles HTTP methods', async () => {
  const reservation = createServer();
  await new Promise(done => reservation.listen(0, '127.0.0.1', done));
  const port = reservation.address().port;
  await new Promise(done => reservation.close(done));
  const server = spawn(process.execPath, [fileURLToPath(new URL('../scripts/serve.mjs', import.meta.url)), String(port)], { cwd: fileURLToPath(new URL('../../', import.meta.url)), stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
      await new Promise(done => setTimeout(done, 25));
    }
    assert.ok(ready, 'Owned server must start');
    const directory = new URL('../dist/', import.meta.url);
    const files = await readdir(directory, { recursive: true, withFileTypes: true });
    let verified = 0;
    for (const entry of files) {
      if (!entry.isFile()) continue;
      const file = join(entry.parentPath, entry.name);
      const requestPath = relative(fileURLToPath(directory), file).split(sep).join('/');
      const response = await fetch(base + '/' + requestPath);
      assert.equal(response.status, 200, requestPath);
      const expected = await readFile(file);
      assert.equal(Buffer.from(await response.arrayBuffer()).equals(expected), true, requestPath + ' must match the bundled bytes');
      const head = await fetch(base + '/' + requestPath, { method: 'HEAD' });
      assert.equal(head.status, 200, requestPath);
      assert.equal(Number(head.headers.get('content-length')), expected.length, requestPath);
      assert.equal((await head.arrayBuffer()).byteLength, 0, requestPath);
      verified++;
    }
    assert.ok(verified >= 19, 'All site assets must be covered');
    assert.equal((await fetch(base + '/missing.webp')).status, 404);
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
    assert.equal((await fetch(base + '/%2e%2e%2fpackage.json')).status, 403);
    assert.equal((await fetch(base + '/%ZZ')).status, 400);
  } finally {
    server.kill();
  }
});

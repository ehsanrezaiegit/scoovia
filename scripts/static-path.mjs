import * as nativePath from 'node:path';

// Validate the URL before using the platform's filesystem separator.
export function resolveStaticPath(root, pathname, path = nativePath) {
  if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0')) return null;
  const file = path.resolve(root, '.' + pathname);
  const relative = path.relative(root, file);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) return null;
  return file;
}

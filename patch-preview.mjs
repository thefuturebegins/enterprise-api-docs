/**
 * Watches Scalar's generated index.html and re-applies custom patches
 * (stylesheet, favicon) every time Scalar rebuilds and resets it.
 *
 * Run alongside `npx @scalar/cli project preview`:
 *   node patch-preview.mjs
 */

import { watch, readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const INDEX_HTML = join(homedir(), '.scalar/isolate/dist/build/index.html');
const BUILD_PUBLIC = join(homedir(), '.scalar/isolate/dist/build/public');

const INJECT = `
    <link rel="stylesheet" href="/custom.css" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
    <script src="/title-prefix.js"></script>`;

/** Copy project assets into the Scalar build's public directory */
function syncAssets() {
  const assets = [
    ['assets/custom.css',         'custom.css'],
    ['assets/favicon.svg',        'favicon.svg'],
    ['assets/favicon-32x32.png',  'favicon-32x32.png'],
    ['assets/favicon-16x16.png',  'favicon-16x16.png'],
    ['assets/favicon-180x180.png','favicon-180x180.png'],
    ['assets/title-prefix.js',    'title-prefix.js'],
  ];
  for (const [src, dest] of assets) {
    const srcPath = join(__dir, src);
    const destPath = join(BUILD_PUBLIC, dest);
    if (existsSync(srcPath)) copyFileSync(srcPath, destPath);
  }
}

/** Inject our <link> tags into index.html if not already present */
function patch() {
  try {
    if (!existsSync(INDEX_HTML)) return;
    const html = readFileSync(INDEX_HTML, 'utf8');
    if (html.includes('custom.css')) return; // already patched
    syncAssets();
    const patched = html.replace('  </head>', INJECT + '\n  </head>');
    writeFileSync(INDEX_HTML, patched);
    console.log('[patch] index.html patched ✓');
  } catch (e) {
    console.error('[patch] Error:', e.message);
  }
}

// Apply immediately on start
patch();

// Re-apply whenever Scalar rebuilds index.html
watch(INDEX_HTML, () => setTimeout(patch, 300));

console.log('[patch] Watching for Scalar rebuilds…');

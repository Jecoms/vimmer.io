#!/usr/bin/env node
// Static preview server that mirrors the COOP/COEP headers from
// public/_headers so vim.wasm can use SharedArrayBuffer locally and in CI.
// `astro preview` is convenient for development but doesn't honour Cloudflare
// Pages' _headers file, so the WASM editor refuses to boot. This server fills
// that gap: it's only used for `npm run test:e2e` (the Playwright harness),
// not for production hosting.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(process.cwd(), "dist");
const PORT = Number(process.env.PORT ?? 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

const COOP_COEP = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
};

async function resolveFile(urlPath) {
  // Strip query string + decode + prevent path traversal.
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safe = normalize(decoded).replace(/^([./\\])+/, "/");
  let full = join(ROOT, safe);

  try {
    const s = await stat(full);
    if (s.isDirectory()) full = join(full, "index.html");
  } catch {
    // Fall through; try html-extension fallback below.
  }

  try {
    const s = await stat(full);
    if (s.isFile()) return full;
  } catch {}

  // Astro emits `/lessons/foo/1/index.html` for `/lessons/foo/1`. The directory
  // case is handled above; this catches a request without a trailing slash.
  try {
    const candidate = full.endsWith("/") ? `${full}index.html` : `${full}.html`;
    const s = await stat(candidate);
    if (s.isFile()) return candidate;
  } catch {}

  return null;
}

const server = createServer(async (req, res) => {
  for (const [k, v] of Object.entries(COOP_COEP)) res.setHeader(k, v);

  const file = await resolveFile(req.url ?? "/");
  if (!file) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found");
    return;
  }

  const type = MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
  res.setHeader("Content-Type", type);

  try {
    const body = await readFile(file);
    res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err));
  }
});

server.listen(PORT, () => {
  console.log(`preview-isolated: http://localhost:${PORT} (root: ${ROOT})`);
});

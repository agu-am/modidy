// Parchea el output de OpenNext para que cloudflare:sockets esté disponible
// incluso cuando el bundler convierte su import dinamico en un require fallido.
//
// Uso: node scripts/patch-cf-sockets.mjs   (despues de opennextjs-cloudflare build)

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = ".open-next";

const PRELUDE =
  "// PATCH(modidy): expone cloudflare:sockets para shims CJS\n" +
  'try { globalThis.__cfs = await import("cloudflare:sockets"); } catch {}\n';

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let patchedWorker = false;
const workerPath = join(ROOT, "worker.js");
if (readFileSync(workerPath, "utf8").includes("__cfs") === false) {
  const src = readFileSync(workerPath, "utf8");
  writeFileSync(workerPath, PRELUDE + src);
  patchedWorker = true;
}

let patchedPolyfills = [];
for (const file of walk(ROOT)) {
  if (!file.endsWith("polyfills.js")) continue;
  if (!file.includes(join("postgres", "cf"))) continue;
  let src = readFileSync(file, "utf8");
  if (!src.includes("cloudflare:sockets")) continue;
  const original = src;
  src = src.replace(
    /await\s+import\(\s*['"]cloudflare:sockets['"]\s*\)/g,
    "(globalThis.__cfs ?? await import('cloudflare:sockets'))",
  );
  if (src !== original) {
    writeFileSync(file, src);
    patchedPolyfills.push(file);
  }
}

console.log(`[patch] worker.js ${patchedWorker ? "parcheado" : "ya estaba"}; polyfills: ${patchedPolyfills.length}`);
for (const f of patchedPolyfills) console.log("  -", f);

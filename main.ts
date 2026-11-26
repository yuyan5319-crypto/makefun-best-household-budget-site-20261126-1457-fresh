// HearthLedger's hand-in program (Node 22, standard library only).
//
// The site itself is plain static files under app/ — index.html, one stylesheet,
// five small JavaScript modules, and an SVG favicon — with no build step and no
// network requests. This program copies app/ and screenshots/ from beside this
// file into the output directory and writes /output/dossier.json with the
// vendored make.fun library, so the judge can read the site's first load, its
// source, and its screenshots. vendor/makefun-frontend.ts must stay untouched:
// the scorer rebuilds the dossier with its own copy and compares byte for byte.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly instead of handing the scorer a half-built output.
function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Count every file under a directory, recursively.
function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    n += entry.isDirectory() ? countFiles(p) : 1;
  }
  return n;
}

const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');
if (!existsSync(appDir) || !statSync(appDir).isDirectory()) {
  fail('app/ is missing — cannot build the site');
}
if (!existsSync(join(appDir, 'index.html'))) {
  fail('app/index.html is missing — the site has no entry page');
}
if (!existsSync(shotsDir) || !statSync(shotsDir).isDirectory()) {
  fail('screenshots/ is missing — the entry needs screenshots');
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });
const appFiles = countFiles(join(out, 'app'));
const shotFiles = countFiles(join(out, 'screenshots'));
if (shotFiles === 0) fail('screenshots/ is empty — the entry needs at least one screenshot');
console.log(`copied ${appFiles} app files and ${shotFiles} screenshots to ${out}`);

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
const dossierPath = join(out, 'dossier.json');
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(dossierPath, dossier);
console.log(`wrote ${dossierPath} (${statSync(dossierPath).size} bytes)`);

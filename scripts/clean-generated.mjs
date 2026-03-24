import fs from 'node:fs';

const targets = [
  'app-in-toss-by-gh.ait',
  'harness-smoke.ait',
  'dist',
  '.granite',
  '.swc',
  'artifacts',
  'docs/toss/apps-in-toss-full.md',
  'docs/toss/api',
];

for (const target of targets) {
  fs.rmSync(target, { recursive: true, force: true });
}

if (fs.existsSync('docs/toss/official-snapshots')) {
  for (const entry of fs.readdirSync('docs/toss/official-snapshots')) {
    if (entry.endsWith('.md')) {
      fs.rmSync(`docs/toss/official-snapshots/${entry}`, { force: true });
    }
  }
}

console.log('Removed generated artifacts and local raw document copies.');

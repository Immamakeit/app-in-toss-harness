import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  DOC_DRIFT_REPORT_PATH,
  DOC_MANIFEST_PATH,
  DOC_SNAPSHOT_DIR,
  DOC_SOURCES,
} from './apps-in-toss-doc-sources.mjs';

export function normalizeMarkdown(text) {
  return text.replaceAll('\r\n', '\n');
}

export function hashContent(text) {
  return createHash('sha256').update(text).digest('hex');
}

export async function fetchMarkdown(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'text/markdown,text/plain;q=0.9,*/*;q=0.1',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return normalizeMarkdown(await response.text());
}

export async function readManifest() {
  try {
    const raw = await fs.readFile(DOC_MANIFEST_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

export async function syncOfficialDocs({ now = new Date().toISOString() } = {}) {
  await fs.mkdir(DOC_SNAPSHOT_DIR, { recursive: true });

  const docs = [];

  for (const source of DOC_SOURCES) {
    const content = await fetchMarkdown(source.rawUrl);
    const snapshotPath = path.join(DOC_SNAPSHOT_DIR, `${source.slug}.md`);
    await fs.writeFile(snapshotPath, content, 'utf8');

    docs.push({
      ...source,
      snapshotPath,
      hash: hashContent(content),
      bytes: Buffer.byteLength(content, 'utf8'),
      fetchedAt: now,
    });
  }

  const manifest = {
    fetchedAt: now,
    docs,
  };

  await fs.writeFile(DOC_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  return manifest;
}

export async function compareOfficialDocs() {
  const manifest = await readManifest();

  if (manifest === null) {
    throw new Error(`Manifest not found at ${DOC_MANIFEST_PATH}. Run docs:sync first.`);
  }

  const checks = [];

  for (const source of DOC_SOURCES) {
    const previous = manifest.docs.find((doc) => doc.slug === source.slug);
    const currentContent = await fetchMarkdown(source.rawUrl);
    const currentHash = hashContent(currentContent);

    checks.push({
      ...source,
      previousHash: previous?.hash ?? null,
      currentHash,
      changed: previous?.hash !== currentHash,
    });
  }

  return {
    checkedAt: new Date().toISOString(),
    manifestFetchedAt: manifest.fetchedAt,
    checks,
  };
}

export function renderDocsFreshnessReport(result) {
  const changedDocs = result.checks.filter((check) => check.changed);
  const unchangedDocs = result.checks.filter((check) => !check.changed);

  const lines = [
    '# Apps in Toss Docs Freshness Report',
    '',
    `- Checked at: ${result.checkedAt}`,
    `- Baseline snapshot: ${result.manifestFetchedAt}`,
    `- Changed docs: ${changedDocs.length}`,
    `- Unchanged docs: ${unchangedDocs.length}`,
    '',
  ];

  if (changedDocs.length > 0) {
    lines.push('## Changed');
    lines.push('');

    for (const check of changedDocs) {
      lines.push(`- [${check.name}](${check.pageUrl})`);
      lines.push(`  - Priority: ${check.priority}`);
      lines.push(`  - Raw: ${check.rawUrl}`);
      lines.push(`  - Previous hash: ${check.previousHash ?? 'missing'}`);
      lines.push(`  - Current hash: ${check.currentHash}`);
    }

    lines.push('');
    lines.push('## Required Follow-up');
    lines.push('');
    lines.push('- Re-run `npm run docs:sync` to refresh local snapshots.');
    lines.push('- Review `AGENTS.md`, `STACK.md`, `docs/setup/apps-in-toss-rn.md`, and `docs/toss/integration/*` for policy or workflow drift.');
    lines.push('- Re-check release blockers first when `release-note` or `service-open-policy` changed.');
    lines.push('');
  } else {
    lines.push('## Status');
    lines.push('');
    lines.push('- No drift detected against the tracked Apps in Toss source documents.');
    lines.push('');
  }

  lines.push('## Notes');
  lines.push('');
  lines.push('- Raw `.md` endpoints are gzip-compressed markdown. Use a client that supports decompression, or inspect the `.html` page URL for browser rendering.');

  return `${lines.join('\n')}\n`;
}

export async function writeDocsFreshnessReport(report) {
  const outputPath = path.resolve(process.cwd(), DOC_DRIFT_REPORT_PATH);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, report, 'utf8');
  return outputPath;
}

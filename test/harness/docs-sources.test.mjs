import test from 'node:test';
import assert from 'node:assert/strict';
import { DOC_SOURCES } from '../../scripts/docs/apps-in-toss-doc-sources.mjs';
import { hashContent, normalizeMarkdown, renderDocsFreshnessReport } from '../../scripts/docs/lib.mjs';

test('tracked Apps in Toss document sources are unique and stable', () => {
  const slugs = DOC_SOURCES.map((source) => source.slug);
  const uniqueSlugs = new Set(slugs);

  assert.equal(uniqueSlugs.size, DOC_SOURCES.length);
  assert.equal(DOC_SOURCES.length >= 5, true);
});

test('markdown normalization and hashing are deterministic', () => {
  const normalized = normalizeMarkdown('a\r\nb\r\n');

  assert.equal(normalized, 'a\nb\n');
  assert.equal(hashContent(normalized), hashContent('a\nb\n'));
});

test('docs freshness report highlights changed documents', () => {
  const report = renderDocsFreshnessReport({
    checkedAt: '2026-03-24T00:00:00.000Z',
    manifestFetchedAt: '2026-03-23T00:00:00.000Z',
    checks: [
      {
        slug: 'deploy',
        name: '미니앱 출시',
        pageUrl: 'https://developers-apps-in-toss.toss.im/development/deploy.html',
        rawUrl: 'https://developers-apps-in-toss.toss.im/development/deploy.md',
        priority: 'critical',
        previousHash: 'old',
        currentHash: 'new',
        changed: true,
      },
    ],
  });

  assert.match(report, /Changed docs: 1/);
  assert.match(report, /Re-run `npm run docs:sync`/);
});

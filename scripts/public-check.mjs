import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const cwd = process.cwd();

const disallowedFiles = [
  '.env',
  'docs/toss/apps-in-toss-full.md',
];

const disallowedDirs = [
  '.granite',
  '.swc',
  'dist',
  'artifacts',
  'docs/toss/api',
];

const disallowedGlobs = [
  { dir: '.', suffix: '.ait', message: 'Generated .ait artifacts must not be kept in the public repository.' },
  {
    dir: 'docs/toss/official-snapshots',
    suffix: '.md',
    message: 'Official raw markdown snapshots must stay local or CI-only. Only the manifest should be tracked.',
  },
];

const textExtensions = new Set([
  '.md',
  '.txt',
  '.json',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.yml',
  '.yaml',
  '.gitignore',
]);

const forbiddenPatterns = [
  { pattern: /\/home\//, message: 'Local absolute filesystem paths must not be committed.' },
  { pattern: /-----BEGIN [A-Z ]+KEY-----/, message: 'Private or certificate key material must not be committed.' },
  {
    pattern: /^AITO_DEPLOY_API_KEY=.+$/m,
    message: 'AITO_DEPLOY_API_KEY must stay empty in tracked files.',
  },
  {
    pattern: /^AITO_MTLS_CERT_PATH=.+$/m,
    message: 'AITO_MTLS_CERT_PATH must stay empty in tracked files.',
  },
  {
    pattern: /^AITO_MTLS_KEY_PATH=.+$/m,
    message: 'AITO_MTLS_KEY_PATH must stay empty in tracked files.',
  },
];

function exists(relativePath) {
  return fs.existsSync(path.join(cwd, relativePath));
}

function scanDirectory(rootRelativePath, findings) {
  const rootPath = path.join(cwd, rootRelativePath);
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(rootRelativePath, entry.name);
    const absolutePath = path.join(cwd, relativePath);

    if (entry.isDirectory()) {
      if (['node_modules', '.git'].includes(entry.name)) {
        continue;
      }

      scanDirectory(relativePath, findings);
      continue;
    }

    const extension = path.extname(entry.name);
    if (!textExtensions.has(extension) && entry.name !== '.gitignore') {
      continue;
    }

    const content = fs.readFileSync(absolutePath, 'utf8');

    for (const { pattern, message } of forbiddenPatterns) {
      if (pattern.test(content)) {
        findings.push(`${relativePath}: ${message}`);
      }
    }
  }
}

const findings = [];

for (const file of disallowedFiles) {
  if (exists(file)) {
    findings.push(`${file}: remove this file before publishing the repository.`);
  }
}

for (const dir of disallowedDirs) {
  if (exists(dir)) {
    findings.push(`${dir}: remove this generated or mirrored directory before publishing the repository.`);
  }
}

for (const glob of disallowedGlobs) {
  if (!exists(glob.dir)) {
    continue;
  }

  const entries = fs.readdirSync(path.join(cwd, glob.dir), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(glob.suffix)) {
      findings.push(`${path.join(glob.dir, entry.name)}: ${glob.message}`);
    }
  }
}

scanDirectory('.', findings);

if (findings.length > 0) {
  console.error('Public repository check failed:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log('Public repository check passed.');

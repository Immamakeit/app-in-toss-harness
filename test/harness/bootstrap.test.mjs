import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bootstrapProject,
  buildBootstrapEnvContent,
  parseBootstrapArgs,
  validateBootstrapOptions,
} from '../../scripts/lib/bootstrap.mjs';

async function makeFixtureDir() {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'apps-in-toss-bootstrap-'));

  await fs.writeFile(
    path.join(cwd, 'package.json'),
    `${JSON.stringify({ name: 'app-in-toss-by-gh', private: true }, null, 2)}\n`,
    'utf8',
  );
  await fs.writeFile(
    path.join(cwd, 'package-lock.json'),
    `${JSON.stringify({ name: 'app-in-toss-by-gh', packages: { '': { name: 'app-in-toss-by-gh' } } }, null, 2)}\n`,
    'utf8',
  );

  return cwd;
}

test('parseBootstrapArgs reads required flags and force mode', () => {
  const options = parseBootstrapArgs([
    '--app-name',
    'meal-tracker',
    '--display-name',
    '식단 기록',
    '--primary-color',
    '#123456',
    '--api-base-url',
    'https://api.example.com',
    '--force',
  ]);

  assert.equal(options.appName, 'meal-tracker');
  assert.equal(options.force, true);
});

test('validateBootstrapOptions rejects invalid harness inputs', () => {
  const errors = validateBootstrapOptions({
    appName: 'Bad Name',
    displayName: '',
    primaryColor: 'blue',
    apiBaseUrl: 'api.example.com',
    iconUrl: 'ftp://example.com/icon.png',
  });

  assert.equal(errors.length >= 4, true);
});

test('buildBootstrapEnvContent renders deterministic .env output', () => {
  const content = buildBootstrapEnvContent({
    appName: 'meal-tracker',
    displayName: '식단 기록',
    primaryColor: '#123456',
    iconUrl: '',
    stage: 'local',
    apiBaseUrl: 'https://api.example.com',
    workspaceName: 'team-apps',
  });

  assert.match(content, /AITO_APP_NAME=meal-tracker/);
  assert.match(content, /AITO_WORKSPACE_NAME=team-apps/);
});

test('bootstrapProject writes .env and syncs package names', async () => {
  const cwd = await makeFixtureDir();

  await bootstrapProject(cwd, {
    appName: 'meal-tracker',
    displayName: '식단 기록',
    primaryColor: '#123456',
    iconUrl: '',
    stage: 'local',
    apiBaseUrl: 'https://api.example.com',
    workspaceName: '',
    force: false,
  });

  const envContent = await fs.readFile(path.join(cwd, '.env'), 'utf8');
  const packageJson = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'));
  const packageLock = JSON.parse(await fs.readFile(path.join(cwd, 'package-lock.json'), 'utf8'));

  assert.match(envContent, /AITO_APP_NAME=meal-tracker/);
  assert.equal(packageJson.name, 'meal-tracker');
  assert.equal(packageLock.name, 'meal-tracker');
  assert.equal(packageLock.packages[''].name, 'meal-tracker');
});

test('bootstrapProject protects an existing .env unless force is set', async () => {
  const cwd = await makeFixtureDir();
  await fs.writeFile(path.join(cwd, '.env'), 'AITO_APP_NAME=existing\n', 'utf8');

  await assert.rejects(
    bootstrapProject(cwd, {
      appName: 'meal-tracker',
      displayName: '식단 기록',
      primaryColor: '#123456',
      iconUrl: '',
      stage: 'local',
      apiBaseUrl: 'https://api.example.com',
      workspaceName: '',
      force: false,
    }),
    /already exists/,
  );
});

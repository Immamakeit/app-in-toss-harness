import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { readAppsInTossEnv } from './lib/apps-in-toss-env.mjs';

const env = readAppsInTossEnv();
const args = ['ait', 'deploy'];
const isCi = process.env.CI === 'true' || process.env.CI === '1';

if (env.deployApiKey !== '') {
  args.push('--api-key', env.deployApiKey);
}

if (env.deployApiKey === '' && isCi) {
  console.error('CI upload requires AITO_DEPLOY_API_KEY because a pre-registered local ait token does not exist in the runner.');
  process.exit(1);
}

console.log('Apps in Toss test upload');
console.log(`- appName: ${env.appName}`);
console.log(`- uploadAuth: ${env.deployApiKey !== '' ? 'api-key' : 'registered-token'}`);

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(command, args, { stdio: 'inherit' });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);

import process from 'node:process';

try {
  process.loadEnvFile?.();
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const appName = process.env.AITO_APP_NAME ?? 'app-in-toss-by-gh';

const origins = {
  appName,
  live: `https://${appName}.apps.tossmini.com`,
  qrTest: `https://${appName}.private-apps.tossmini.com`,
};

console.log(JSON.stringify(origins, null, 2));

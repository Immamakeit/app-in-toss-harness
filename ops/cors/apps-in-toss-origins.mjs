import process from 'node:process';

try {
  process.loadEnvFile?.();
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

export function getAppsInTossOrigins(appName = process.env.AITO_APP_NAME ?? 'app-in-toss-by-gh') {
  return [
    `https://${appName}.apps.tossmini.com`,
    `https://${appName}.private-apps.tossmini.com`,
  ];
}

export function isAllowedAppsInTossOrigin(origin, appName) {
  if (origin == null || origin === '') {
    return false;
  }

  return getAppsInTossOrigins(appName).includes(origin);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(getAppsInTossOrigins(), null, 2));
}

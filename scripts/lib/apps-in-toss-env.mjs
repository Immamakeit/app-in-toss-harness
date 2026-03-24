import process from 'node:process';

export const DEFAULT_ENV = {
  appName: 'app-in-toss-by-gh',
  displayName: '앱인토스 RN 앱',
  primaryColor: '#3182F6',
  iconUrl: '',
  stage: 'local',
  apiBaseUrl: 'https://api.example.com',
  workspaceName: '',
  deployApiKey: '',
  mtlsCertPath: '',
  mtlsKeyPath: '',
};

export const VALID_DOCTOR_MODES = new Set(['repo', 'local', 'release', 'upload']);

export function loadEnvFile() {
  try {
    process.loadEnvFile?.();
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

export function readAppsInTossEnv() {
  loadEnvFile();

  return {
    appName: process.env.AITO_APP_NAME ?? DEFAULT_ENV.appName,
    displayName: process.env.AITO_DISPLAY_NAME ?? DEFAULT_ENV.displayName,
    primaryColor: process.env.AITO_PRIMARY_COLOR ?? DEFAULT_ENV.primaryColor,
    iconUrl: process.env.AITO_ICON_URL ?? DEFAULT_ENV.iconUrl,
    stage: process.env.AITO_STAGE ?? DEFAULT_ENV.stage,
    apiBaseUrl: process.env.AITO_API_BASE_URL ?? DEFAULT_ENV.apiBaseUrl,
    workspaceName: process.env.AITO_WORKSPACE_NAME ?? DEFAULT_ENV.workspaceName,
    deployApiKey: process.env.AITO_DEPLOY_API_KEY ?? DEFAULT_ENV.deployApiKey,
    mtlsCertPath: process.env.AITO_MTLS_CERT_PATH ?? DEFAULT_ENV.mtlsCertPath,
    mtlsKeyPath: process.env.AITO_MTLS_KEY_PATH ?? DEFAULT_ENV.mtlsKeyPath,
  };
}

export function getOrigins(appName) {
  return {
    live: `https://${appName}.apps.tossmini.com`,
    qrTest: `https://${appName}.private-apps.tossmini.com`,
  };
}

export function isBlank(value) {
  return value.trim() === '';
}

export function isKebabCase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isHexColor(value) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

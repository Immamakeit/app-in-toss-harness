import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DEFAULT_ENV,
  isBlank,
  isHexColor,
  isHttpUrl,
  isKebabCase,
} from './apps-in-toss-env.mjs';

const OPTION_NAMES = new Map([
  ['--app-name', 'appName'],
  ['--display-name', 'displayName'],
  ['--primary-color', 'primaryColor'],
  ['--api-base-url', 'apiBaseUrl'],
  ['--stage', 'stage'],
  ['--icon-url', 'iconUrl'],
  ['--workspace-name', 'workspaceName'],
]);

function nextArg(argv, index, option) {
  const value = argv[index + 1];

  if (value === undefined || value.startsWith('--')) {
    throw new Error(`Missing value for ${option}`);
  }

  return value;
}

export function parseBootstrapArgs(argv) {
  const options = {
    appName: '',
    displayName: '',
    primaryColor: DEFAULT_ENV.primaryColor,
    apiBaseUrl: '',
    stage: DEFAULT_ENV.stage,
    iconUrl: DEFAULT_ENV.iconUrl,
    workspaceName: DEFAULT_ENV.workspaceName,
    force: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg === '--force') {
      options.force = true;
      continue;
    }

    const field = OPTION_NAMES.get(arg);

    if (field === undefined) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options[field] = nextArg(argv, index, arg);
    index += 1;
  }

  return options;
}

export function validateBootstrapOptions(options) {
  const errors = [];

  if (!isKebabCase(options.appName)) {
    errors.push('`--app-name` is required and must be kebab-case.');
  }

  if (isBlank(options.displayName)) {
    errors.push('`--display-name` is required.');
  }

  if (!isHexColor(options.primaryColor)) {
    errors.push('`--primary-color` must be a 6-digit RGB hex value such as #3182F6.');
  }

  if (!isHttpUrl(options.apiBaseUrl)) {
    errors.push('`--api-base-url` is required and must be an absolute http(s) URL.');
  }

  if (options.iconUrl !== '' && !isHttpUrl(options.iconUrl)) {
    errors.push('`--icon-url` must be an absolute http(s) URL when provided.');
  }

  return errors;
}

export function buildBootstrapEnvContent(options) {
  const lines = [
    `AITO_APP_NAME=${options.appName}`,
    `AITO_DISPLAY_NAME=${options.displayName}`,
    `AITO_PRIMARY_COLOR=${options.primaryColor}`,
    `AITO_ICON_URL=${options.iconUrl}`,
    `AITO_STAGE=${options.stage}`,
    `AITO_API_BASE_URL=${options.apiBaseUrl}`,
    `AITO_WORKSPACE_NAME=${options.workspaceName}`,
    'AITO_DEPLOY_API_KEY=',
    'AITO_MTLS_CERT_PATH=',
    'AITO_MTLS_KEY_PATH=',
  ];

  return `${lines.join('\n')}\n`;
}

async function updatePackageJson(packageJsonPath, appName) {
  const raw = await fs.readFile(packageJsonPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (parsed.name !== DEFAULT_ENV.appName) {
    return false;
  }

  parsed.name = appName;
  await fs.writeFile(packageJsonPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  return true;
}

async function updatePackageLockJson(packageLockPath, appName) {
  try {
    const raw = await fs.readFile(packageLockPath, 'utf8');
    const parsed = JSON.parse(raw);
    let changed = false;

    if (parsed.name === DEFAULT_ENV.appName) {
      parsed.name = appName;
      changed = true;
    }

    if (parsed.packages?.['']?.name === DEFAULT_ENV.appName) {
      parsed.packages[''].name = appName;
      changed = true;
    }

    if (!changed) {
      return false;
    }

    await fs.writeFile(packageLockPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

export async function bootstrapProject(cwd, options) {
  const errors = validateBootstrapOptions(options);

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  const envPath = path.join(cwd, '.env');

  if (!options.force) {
    try {
      await fs.access(envPath);
      throw new Error('`.env` already exists. Re-run bootstrap with `--force` if you want to overwrite it.');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  await fs.writeFile(envPath, buildBootstrapEnvContent(options), 'utf8');

  const packageJsonUpdated = await updatePackageJson(path.join(cwd, 'package.json'), options.appName);
  const packageLockUpdated = await updatePackageLockJson(path.join(cwd, 'package-lock.json'), options.appName);

  return {
    envPath,
    packageJsonUpdated,
    packageLockUpdated,
  };
}

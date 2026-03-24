import process from 'node:process';
import { appsInToss } from '@apps-in-toss/framework/plugins';
import { router } from '@granite-js/plugin-router';
import { hermes } from '@granite-js/plugin-hermes';
import { defineConfig } from '@granite-js/react-native/config';
import { env } from '@granite-js/plugin-env';

try {
  process.loadEnvFile?.();
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw error;
  }
}

const appName = process.env.AITO_APP_NAME ?? 'app-in-toss-by-gh';
const displayName = process.env.AITO_DISPLAY_NAME ?? '앱인토스 RN 앱';
const primaryColor = process.env.AITO_PRIMARY_COLOR ?? '#3182F6';
const icon = process.env.AITO_ICON_URL ?? '';
const apiBaseUrl = process.env.AITO_API_BASE_URL ?? 'https://api.example.com';
const stage = process.env.AITO_STAGE ?? 'local';

export default defineConfig({
  appName,
  scheme: 'intoss',
  plugins: [
    router(),
    hermes(),
    appsInToss({
      brand: {
        displayName,
        primaryColor,
        icon,
      },
      permissions: [],
    }),
    env({
      AITO_APP_NAME: appName,
      AITO_DISPLAY_NAME: displayName,
      AITO_PRIMARY_COLOR: primaryColor,
      AITO_ICON_URL: icon,
      AITO_API_BASE_URL: apiBaseUrl,
      AITO_STAGE: stage,
    }),
  ],
});

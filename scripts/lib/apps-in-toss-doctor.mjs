import fs from 'node:fs';
import {
  DEFAULT_ENV,
  getOrigins,
  isBlank,
  isHexColor,
  isHttpUrl,
  isHttpsUrl,
  isKebabCase,
} from './apps-in-toss-env.mjs';

function severityForMode(mode, warningSeverity, errorSeverity = 'error') {
  return mode === 'release' || mode === 'upload' ? errorSeverity : warningSeverity;
}

export function inspectAppsInTossConfig(mode, env) {
  const results = [];

  const push = (severity, message) => {
    results.push({ severity, message });
  };

  if (!isKebabCase(env.appName)) {
    push('error', 'AITO_APP_NAME must be kebab-case because it becomes the immutable console appName and intoss:// scheme id.');
  }

  if (isBlank(env.displayName)) {
    push('error', 'AITO_DISPLAY_NAME must not be empty.');
  }

  if (!isHexColor(env.primaryColor)) {
    push('error', 'AITO_PRIMARY_COLOR must be a 6-digit RGB hex value such as #3182F6.');
  }

  if (env.iconUrl !== '' && !isHttpUrl(env.iconUrl)) {
    push('error', 'AITO_ICON_URL must be an absolute http(s) URL or an empty string.');
  }

  if (!isHttpUrl(env.apiBaseUrl)) {
    push('error', 'AITO_API_BASE_URL must be an absolute http(s) URL.');
  } else if ((mode === 'release' || mode === 'upload') && !isHttpsUrl(env.apiBaseUrl)) {
    push('error', 'AITO_API_BASE_URL must use HTTPS for release and test-upload flows because live Apps in Toss traffic only allows HTTPS.');
  }

  if (env.appName === DEFAULT_ENV.appName) {
    push(
      severityForMode(mode, 'warning'),
      'AITO_APP_NAME is still the harness default. Replace it with the exact immutable console appName before build or upload.',
    );
  }

  if (env.apiBaseUrl === DEFAULT_ENV.apiBaseUrl) {
    push(
      severityForMode(mode, 'warning'),
      'AITO_API_BASE_URL is still the placeholder. Replace it with the real backend base URL before build or upload.',
    );
  }

  if (env.iconUrl === '') {
    push('warning', 'AITO_ICON_URL is empty. This is acceptable for early testing, but brand review is still required before release.');
  }

  if (env.deployApiKey === '') {
    push(
      'warning',
      'AITO_DEPLOY_API_KEY is empty. Local upload can still work with a previously registered ait token, but CI upload requires an API key secret.',
    );
  }

  if ((env.mtlsCertPath === '') !== (env.mtlsKeyPath === '')) {
    push('warning', 'mTLS certificate and key paths should either both be empty or both be set.');
  }

  if (env.mtlsCertPath !== '' && !fs.existsSync(env.mtlsCertPath)) {
    push('error', `AITO_MTLS_CERT_PATH does not exist: ${env.mtlsCertPath}`);
  }

  if (env.mtlsKeyPath !== '' && !fs.existsSync(env.mtlsKeyPath)) {
    push('error', `AITO_MTLS_KEY_PATH does not exist: ${env.mtlsKeyPath}`);
  }

  return {
    env,
    mode,
    origins: getOrigins(env.appName),
    results,
  };
}

export function hasDoctorErrors(inspection) {
  return inspection.results.some((result) => result.severity === 'error');
}

export function formatDoctorReport(inspection) {
  const lines = [
    'Apps in Toss doctor',
    `- mode: ${inspection.mode}`,
    `- appName: ${inspection.env.appName}`,
    `- displayName: ${inspection.env.displayName}`,
    `- stage: ${inspection.env.stage}`,
    `- apiBaseUrl: ${inspection.env.apiBaseUrl}`,
    `- liveOrigin: ${inspection.origins.live}`,
    `- qrTestOrigin: ${inspection.origins.qrTest}`,
  ];

  const errors = inspection.results.filter((result) => result.severity === 'error');
  const warnings = inspection.results.filter((result) => result.severity === 'warning');

  if (errors.length > 0) {
    lines.push('', 'Errors:');
    for (const error of errors) {
      lines.push(`- ${error.message}`);
    }
  }

  if (warnings.length > 0) {
    lines.push('', 'Warnings:');
    for (const warning of warnings) {
      lines.push(`- ${warning.message}`);
    }
  }

  if (errors.length === 0 && warnings.length === 0) {
    lines.push('', 'No issues found.');
  }

  return lines.join('\n');
}

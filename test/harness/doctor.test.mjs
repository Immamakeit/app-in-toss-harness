import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDoctorReport, hasDoctorErrors, inspectAppsInTossConfig } from '../../scripts/lib/apps-in-toss-doctor.mjs';
import { DEFAULT_ENV } from '../../scripts/lib/apps-in-toss-env.mjs';

test('local doctor keeps harness defaults as warnings', () => {
  const inspection = inspectAppsInTossConfig('local', { ...DEFAULT_ENV });

  assert.equal(hasDoctorErrors(inspection), false);
  assert.match(formatDoctorReport(inspection), /Warnings:/);
});

test('release doctor blocks placeholder app and backend values', () => {
  const inspection = inspectAppsInTossConfig('release', { ...DEFAULT_ENV });

  assert.equal(hasDoctorErrors(inspection), true);
  assert.equal(
    inspection.results.some(
      (result) =>
        result.severity === 'error' && result.message.includes('AITO_APP_NAME is still the harness default'),
    ),
    true,
  );
});

test('release doctor accepts a concrete production-ready configuration', () => {
  const inspection = inspectAppsInTossConfig('release', {
    ...DEFAULT_ENV,
    appName: 'meal-tracker',
    displayName: '식단 기록',
    apiBaseUrl: 'https://api.example.com/v1',
    iconUrl: 'https://static.example.com/icon.png',
  });

  assert.equal(hasDoctorErrors(inspection), false);
});

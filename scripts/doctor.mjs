import process from 'node:process';
import { formatDoctorReport, hasDoctorErrors, inspectAppsInTossConfig } from './lib/apps-in-toss-doctor.mjs';
import { readAppsInTossEnv, VALID_DOCTOR_MODES } from './lib/apps-in-toss-env.mjs';

function readMode(argv) {
  const index = argv.indexOf('--mode');
  if (index === -1) {
    return 'local';
  }

  return argv[index + 1] ?? 'local';
}

const mode = readMode(process.argv.slice(2));

if (!VALID_DOCTOR_MODES.has(mode)) {
  console.error(`Unsupported doctor mode: ${mode}`);
  console.error(`Valid modes: ${Array.from(VALID_DOCTOR_MODES).join(', ')}`);
  process.exit(1);
}

const inspection = inspectAppsInTossConfig(mode, readAppsInTossEnv());

console.log(formatDoctorReport(inspection));

if (hasDoctorErrors(inspection)) {
  process.exitCode = 1;
}

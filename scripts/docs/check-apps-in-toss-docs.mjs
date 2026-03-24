import process from 'node:process';
import { compareOfficialDocs, renderDocsFreshnessReport, writeDocsFreshnessReport } from './lib.mjs';

const strict = process.argv.includes('--strict');
const result = await compareOfficialDocs();
const report = renderDocsFreshnessReport(result);
const reportPath = await writeDocsFreshnessReport(report);
const changedCount = result.checks.filter((check) => check.changed).length;

console.log(report.trim());
console.log(`\nReport written to ${reportPath}`);

if (strict && changedCount > 0) {
  process.exitCode = 1;
}

import process from 'node:process';
import { bootstrapProject, parseBootstrapArgs } from './lib/bootstrap.mjs';

function printHelp() {
  console.log(`Apps in Toss bootstrap

Usage:
  npm run bootstrap -- --app-name my-miniapp --display-name "내 앱" --primary-color "#3182F6" --api-base-url "https://api.example.com"

Options:
  --app-name         Immutable Apps in Toss console appName (kebab-case)
  --display-name     Korean display name exposed in the navigation bar
  --primary-color    Brand primary color in #RRGGBB format
  --api-base-url     Backend base URL
  --stage            Optional stage value (default: local)
  --icon-url         Optional icon URL
  --workspace-name   Optional Apps in Toss workspace name
  --force            Overwrite an existing .env
  --help             Show this help
`);
}

try {
  const options = parseBootstrapArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  const result = await bootstrapProject(process.cwd(), options);

  console.log('Apps in Toss bootstrap completed');
  console.log(`- .env: ${result.envPath}`);
  console.log(`- package.json name synced: ${result.packageJsonUpdated ? 'yes' : 'no'}`);
  console.log(`- package-lock.json name synced: ${result.packageLockUpdated ? 'yes' : 'no'}`);
  console.log('- next: npm run doctor');
  console.log('- next: npm run dev');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

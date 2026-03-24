import { syncOfficialDocs } from './lib.mjs';

const manifest = await syncOfficialDocs();

console.log('Apps in Toss docs synced');
console.log(`- fetchedAt: ${manifest.fetchedAt}`);

for (const doc of manifest.docs) {
  console.log(`- ${doc.slug}: ${doc.hash}`);
}

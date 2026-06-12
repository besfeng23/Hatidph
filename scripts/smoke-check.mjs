import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/components/BottomNav.tsx',
  'src/components/DriverCard.tsx',
  'src/components/RouteMap.tsx',
  'src/lib/mockData.ts',
  'src/lib/tripState.ts',
  'public/manifest.json',
  'docs/PRODUCTION_READINESS.md',
  'docs/PHASE_STATUS.md',
  'docs/QA_CHECKLIST.md',
];

const requiredText = [
  ['src/App.tsx', 'Hatid preview'],
  ['src/App.tsx', 'Demo only'],
  ['src/App.tsx', 'Trusted contacts'],
  ['src/App.tsx', 'Support ticket'],
  ['docs/PRODUCTION_READINESS.md', 'No real ride booking'],
  ['docs/PRODUCTION_READINESS.md', 'No real payment processing'],
  ['docs/PHASE_STATUS.md', 'Phase 8A'],
  ['docs/PHASE_STATUS.md', 'Known limitations'],
  ['public/manifest.json', 'Hatid - Premium Mobility'],
];

let failed = false;

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.log(`Missing required file: ${file}`);
    failed = true;
  }
}

for (const [file, text] of requiredText) {
  if (!existsSync(file)) {
    continue;
  }

  const contents = readFileSync(file, 'utf8');
  if (!contents.includes(text)) {
    console.log(`Missing required text in ${file}: ${text}`);
    failed = true;
  }
}

if (failed) {
  console.log('Hatid smoke check failed.');
  process.exit(1);
}

console.log('Hatid smoke check passed.');

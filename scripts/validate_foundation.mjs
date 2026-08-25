import { readFileSync, existsSync } from 'node:fs';

const required = [
  'package.json',
  'apps/api/src/main.ts',
  'apps/api/src/health/health.controller.ts',
  'apps/admin-web/app/page.tsx',
  'apps/mobile/pubspec.yaml',
  'apps/mobile/lib/main.dart',
  'supabase/config.toml',
  'supabase/migrations/20260720000100_foundation.sql',
  'supabase/migrations/20260824000100_identity_tenancy_foundation.sql',
  'supabase/tests/identity_tenancy_rls.test.sql',
  'docs/baseline/StoreSync_Implementation_Roadmap_v1.0.docx'
];

for (const file of required) {
  if (!existsSync(file)) {
    throw new Error(`Missing foundation file: ${file}`);
  }
}

for (const file of [
  'package.json',
  'apps/api/package.json',
  'apps/admin-web/package.json',
  'packages/api-contracts/package.json',
]) {
  JSON.parse(readFileSync(file, 'utf-8'));
}

console.log('Monorepo and current M1 foundation structure is valid.');

import {existsSync} from "node:fs";
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resolve} from 'node:path';


test('admin web foundation files exist', () => {
  for (const file of [
    'app/layout.tsx',
    'app/page.tsx',
    'app/api/health/route.ts',
    'next.config.ts'
  ]) {
    assert.equal(existsSync(resolve(process.cwd(), file)), true, `Missing ${file}`);
  }
});

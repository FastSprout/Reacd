import { execFileSync } from 'node:child_process';

const checks = [
  'policy',
  'typecheck',
  'lint',
  'schema:check',
  'examples:check',
  'test:coverage',
  'build',
  'test:package',
  'docs:check',
  'test:browser',
];
for (const check of checks) execFileSync('npm', ['run', check], { stdio: 'inherit' });

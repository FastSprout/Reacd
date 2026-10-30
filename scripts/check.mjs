import { execFileSync } from 'node:child_process';

const checks = [
  'policy',
  'lint:layers',
  'typecheck',
  'lint',
  'schema:check',
  'fixtures:check',
  'test:coverage',
  'build',
  'test:package',
  'docs:check',
  'test:browser',
];
for (const check of checks) {
  try {
    execFileSync('npm', ['run', check], { stdio: 'inherit' });
  } catch (error) {
    if (process.env['GITHUB_ACTIONS'] === 'true') {
      console.error(`::error title=Check gate failed::${check}`);
    }
    throw error;
  }
}

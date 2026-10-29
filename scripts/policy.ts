import { globSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { inspectRepository } from '../tooling/policy/repository.js';

const root = process.cwd();
const files = globSync([
  'src/**/*.{ts,tsx,css}',
  'demo/**/*.{ts,tsx}',
  'tooling/**/*.{ts,tsx,txt,html}',
  'test-support/**/*.ts',
  'scripts/*.{ts,mjs}',
  '*.config.ts',
  '*.md',
  'docs/**/*.{md,tsx,json}',
  'specs/**/*.md',
  'package.json',
  'tsconfig*.json',
  'mkdocs.yml',
  '.github/**/*.yml',
  '.prettierrc.json',
  '.oxlintrc.json',
]).map((path) => ({ path: resolve(root, path), source: readFileSync(path, 'utf8') }));
if (files.length === 0) {
  throw new Error('No maintained files found. Run policy from the repository root.');
}
const issues = inspectRepository(files, root);
for (const issue of issues) {
  console.error(
    `${issue.file}:${issue.line}:${issue.column} ` + `[${issue.rule}] ${issue.message}`,
  );
}
if (issues.length > 0) process.exitCode = 1;

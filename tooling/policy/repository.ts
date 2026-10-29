import { relative, resolve } from 'node:path';
import { checkApplication } from './application.js';
import { checkArchitecture } from './architecture.js';
import { checkSource } from './source.js';
import { inspectSource } from './parse.js';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';

export interface SourceFile {
  path: string;
  source: string;
}
const PUBLIC_ENTRIES = new Set([
  'index.ts',
  'generative.ts',
  'contract.ts',
  'templates.ts',
  'renderer.tsx',
  'jsx-runtime.ts',
  'jsx-dev-runtime.ts',
]);
const GENERATED_RELEASE_TEXT = new Set(['docs/changelog.md']);

export function inspectRepository(files: readonly SourceFile[], root: string) {
  const issues: PolicyDiagnostic[] = [];
  for (const { path, source } of files) {
    const name = relative(root, path);
    if (name.startsWith('src/adapter/shadcn/vendor/')) continue;
    if (GENERATED_RELEASE_TEXT.has(name)) continue;
    issues.push(...checkSource(path, source));
    if (!/\.[cm]?[jt]sx?$/.test(name)) continue;
    const test = /(?:__tests__|test-support|e2e)\/|\.(?:test|spec)\./.test(name);
    if (test) continue;
    if (name.startsWith('src/')) {
      if (PUBLIC_ENTRIES.has(relative(resolve(root, 'src'), path))) {
        issues.push(
          ...inspectSource(path, source, {
            Program(program) {
              for (const statement of program.body) {
                if (
                  statement.type === 'ExpressionStatement' &&
                  statement.expression.type === 'Literal' &&
                  statement.expression.value === 'use client'
                )
                  continue;
                if (
                  (statement.type === 'ExportNamedDeclaration' && statement.source) ||
                  statement.type === 'ExportAllDeclaration'
                )
                  continue;
                issues.push(
                  diagnostic(
                    path,
                    source,
                    statement.start,
                    'facade',
                    'Public entry files may only re-export declared modules.',
                  ),
                );
              }
            },
          }),
        );
      } else issues.push(...checkArchitecture(path, source, root));
    }
    if (name.startsWith('demo/') || name.startsWith('docs/examples/')) {
      issues.push(...checkApplication(path, source));
    }
  }
  return issues;
}

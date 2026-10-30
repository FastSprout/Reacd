import { relative } from 'node:path';
import { checkApplication } from './application.js';
import { checkArchitecture, checkFacade } from './architecture.js';
import { checkSource } from './source.js';
import { isPublicEntry } from './layers.js';
import type { PolicyDiagnostic } from './diagnostic.js';

export interface SourceFile {
  path: string;
  source: string;
}
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
      if (isPublicEntry(path, root)) issues.push(...checkFacade(path, source));
      else issues.push(...checkArchitecture(path, source, root));
    }
    if (
      name.startsWith('tooling/conformance/') ||
      name.startsWith('docs/examples/') ||
      name.startsWith('examples/')
    ) {
      issues.push(...checkApplication(path, source));
    }
  }
  return issues;
}

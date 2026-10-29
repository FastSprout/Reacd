import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { diagnostic } from './diagnostic.js';
import type { PolicyDiagnostic } from './diagnostic.js';
import { importVisitor } from './imports.js';
import { inspectSource } from './parse.js';

export const LAYERS = [
  'core',
  'schema',
  'components',
  'renderer',
  'adapter',
  'state',
] as const;

function layerOf(file: string, root: string): number {
  const segment = relative(resolve(root, 'src'), file).split('/')[0];
  return LAYERS.findIndex((layer) => layer === segment);
}

function internalPath(value: string, file: string, root: string): string | null {
  if (value === 'reacd') return resolve(root, 'src/index.ts');
  if (value.startsWith('reacd/')) {
    return resolve(root, 'src', value.slice('reacd/'.length));
  }
  if (value.startsWith('@/')) return resolve(root, 'src', value.slice(2));
  if (value.startsWith('.') || isAbsolute(value)) {
    return resolve(dirname(file), value);
  }
  return null;
}

export function checkArchitecture(
  file: string,
  source: string,
  root: string,
): PolicyDiagnostic[] {
  const issues: PolicyDiagnostic[] = [];
  const layer = layerOf(file, root);
  const add = (offset: number, message: string) => {
    issues.push(diagnostic(file, source, offset, 'architecture', message));
  };
  if (layer < 0) {
    add(0, 'Owned implementation must belong to a declared layer.');
    return issues;
  }
  const visitor = importVisitor(({ value, offset }) => {
    if (value === null) {
      add(offset, 'Computed imports cannot be verified. Use a literal path.');
      return;
    }
    const target = internalPath(value, file, root);
    if (target === null) return;
    if (/(?:__tests__|test-support)\/|\.(?:test|spec)\./.test(target)) {
      add(offset, 'Production code cannot depend on tests.');
      return;
    }
    const dependency = layerOf(target, root);
    if (dependency < 0) {
      add(offset, `Import bypasses a declared layer: ${value}.`);
    } else if (dependency > layer) {
      add(offset, `Dependency points right: ${value}.`);
    }
  });
  const syntax = inspectSource(file, source, visitor);
  return [...issues, ...syntax];
}

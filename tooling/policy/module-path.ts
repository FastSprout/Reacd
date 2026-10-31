import { dirname, extname, isAbsolute, join, resolve } from 'node:path';
import { ADAPTER_RUNTIME_POLICY } from './adapter-runtime.js';

const PACKAGE_IMPORT = '@fastsprout/reacd';
const ADAPTER_RUNTIME = ADAPTER_RUNTIME_POLICY.prefix;

export function internalPath(value: string, file: string, root: string): string | null {
  if (value === PACKAGE_IMPORT || value === 'reacd') {
    return resolve(root, 'src/index.ts');
  }
  if (value.startsWith(ADAPTER_RUNTIME)) {
    return resolve(root, 'src', value.slice(ADAPTER_RUNTIME.length));
  }
  if (value.startsWith(`${PACKAGE_IMPORT}/`)) {
    return resolve(root, 'src', value.slice(PACKAGE_IMPORT.length + 1));
  }
  if (value.startsWith('@/')) return resolve(root, 'src', value.slice(2));
  if (value.startsWith('.') || isAbsolute(value)) {
    return resolve(dirname(file), value);
  }
  return null;
}

export function isCodeReference(target: string): boolean {
  return extname(target) === '' || /\.[cm]?[jt]sx?$/.test(target);
}

export function resolveModule<Value>(
  target: string,
  modules: ReadonlyMap<string, Value>,
): Value | undefined {
  const extension = extname(target);
  const stem = extension === '' ? target : target.slice(0, -extension.length);
  const candidates = [target];
  if (extension === '.js' || extension === '.jsx' || extension === '') {
    candidates.push(`${stem}.ts`, `${stem}.tsx`, `${stem}.d.ts`);
  } else if (extension === '.mjs') {
    candidates.push(`${stem}.mts`);
  } else if (extension === '.cjs') {
    candidates.push(`${stem}.cts`);
  }
  if (extension === '') {
    candidates.push(
      join(target, 'index.ts'),
      join(target, 'index.tsx'),
      join(target, 'index.d.ts'),
    );
  }
  for (const candidate of candidates) {
    const value = modules.get(candidate);
    if (value !== undefined) return value;
  }
  return undefined;
}

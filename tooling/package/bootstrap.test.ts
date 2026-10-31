import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildInstalledBootstrap } from './bootstrap.js';

const { execute } = vi.hoisted(() => ({ execute: vi.fn<() => void>() }));
vi.mock('node:child_process', () => ({ execFileSync: execute }));
const root = process.cwd();
let consumer: string;
beforeEach(() => {
  consumer = mkdtempSync(join(tmpdir(), 'reacd-browser-consumer-'));
  execute.mockReset().mockImplementation(() => {
    mkdirSync(join(consumer, 'dist/assets'), { recursive: true });
    writeFileSync(join(consumer, 'dist/assets/application.css'), '.ready{}');
    writeFileSync(join(consumer, 'dist/assets/application.js'), 'export {};');
  });
});
afterEach(() => rmSync(consumer, { recursive: true, force: true }));

describe('installed browser bootstrap acceptance', () => {
  it('builds the installed package without aliases and checks emitted CSS', () => {
    buildInstalledBootstrap(root, consumer);
    expect(execute).toHaveBeenNthCalledWith(
      1,
      process.execPath,
      [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'],
      { cwd: consumer, stdio: 'inherit' },
    );
    expect(execute).toHaveBeenNthCalledWith(
      2,
      process.execPath,
      [resolve(root, 'node_modules/vite/bin/vite.js'), 'build'],
      { cwd: consumer, stdio: 'inherit' },
    );
    expect(readFileSync(join(consumer, 'bootstrap.tsx'), 'utf8')).toContain(
      "from '@fastsprout/reacd/bootstrap'",
    );
    expect(readFileSync(join(consumer, 'index.html'), 'utf8')).toContain(
      'src="/bootstrap.tsx"',
    );
    expect(readFileSync(join(consumer, 'installation.tsx'))).toEqual(
      readFileSync(join(root, 'docs/examples/installation.tsx')),
    );
    const config: unknown = JSON.parse(
      readFileSync(join(consumer, 'tsconfig.json'), 'utf8'),
    );
    expect(config).toMatchObject({
      compilerOptions: {
        jsx: 'react-jsx',
        jsxImportSource: '@fastsprout/reacd',
        strict: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        skipLibCheck: false,
        noEmit: true,
      },
      files: ['bootstrap.tsx', 'installation.tsx'],
    });
  });

  it('compiles the independent Material installation example', () => {
    buildInstalledBootstrap(root, consumer, 'mui');
    expect(readFileSync(join(consumer, 'installation.tsx'))).toEqual(
      readFileSync(join(root, 'docs/examples/installation-mui.tsx')),
    );
  });

  it('rejects a build without any stylesheet artifact', () => {
    execute.mockImplementation(() => {
      mkdirSync(join(consumer, 'dist/assets'), { recursive: true });
      writeFileSync(join(consumer, 'dist/assets/application.js'), 'export {};');
    });
    expect(() => buildInstalledBootstrap(root, consumer)).toThrow('CSS');
  });

  it('rejects empty emitted stylesheets', () => {
    execute.mockImplementation(() => {
      mkdirSync(join(consumer, 'dist/assets'), { recursive: true });
      writeFileSync(join(consumer, 'dist/assets/empty.css'), '');
    });
    expect(() => buildInstalledBootstrap(root, consumer)).toThrow('empty');
  });

  it.each([1, 2])('propagates failed compiler or bundler stage %s', (stage) => {
    const failure = new Error('Installed compilation failed.');
    execute.mockImplementation(() => {
      if (execute.mock.calls.length === stage) throw failure;
    });
    expect(() => buildInstalledBootstrap(root, consumer)).toThrow(failure);
  });
});

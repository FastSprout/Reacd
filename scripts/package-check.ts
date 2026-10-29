import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { z } from 'zod';

const root = process.cwd();
const temporary = await mkdtemp(join(tmpdir(), 'reacd-package-'));
const manifestSchema = z.object({ dependencies: z.record(z.string(), z.string()) });
const compiler = resolve(root, 'node_modules/typescript/bin/tsc');
const fixtureRoot = resolve(root, 'tooling/package/fixtures');

async function fixture(name: string) {
  return readFile(join(fixtureRoot, name), 'utf8');
}
const options = {
  target: 'ES2022',
  lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  module: 'NodeNext',
  moduleResolution: 'NodeNext',
  jsx: 'react-jsx',
  jsxImportSource: 'reacd',
  strict: true,
  noUncheckedIndexedAccess: true,
  exactOptionalPropertyTypes: true,
  noPropertyAccessFromIndexSignature: true,
  noUncheckedSideEffectImports: true,
  skipLibCheck: false,
  noUnusedLocals: true,
  noUnusedParameters: true,
  noImplicitOverride: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
  noEmitOnError: true,
  types: ['node', 'react', 'react-dom'],
  outDir: 'dist',
};

try {
  const packed: unknown = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
      { cwd: root, encoding: 'utf8' },
    ),
  );
  const [archive] = z
    .tuple([
      z.object({
        filename: z.string(),
        files: z.array(z.object({ path: z.string() })),
      }),
    ])
    .parse(packed);
  for (const file of archive.files)
    assert.doesNotMatch(
      file.path,
      /(?:__tests__|test-support|fixtures|specs)\/|\.(?:test|spec)\.|\.map$/,
    );
  const modules = join(temporary, 'node_modules');
  const installed = join(modules, 'reacd');
  await mkdir(installed, { recursive: true });
  execFileSync('tar', [
    '-xf',
    join(temporary, archive.filename),
    '-C',
    installed,
    '--strip-components=1',
  ]);
  const manifest: unknown = JSON.parse(await readFile('package.json', 'utf8'));
  const dependencies = Object.keys(manifestSchema.parse(manifest).dependencies);
  for (const name of [...dependencies, '@types']) {
    const target = join(modules, name);
    await mkdir(dirname(target), { recursive: true });
    await symlink(resolve(root, 'node_modules', name), target, 'dir');
  }
  await writeFile(join(temporary, 'package.json'), '{"type":"module"}\n');
  await writeFile(join(temporary, 'consumer.tsx'), await fixture('consumer.tsx.txt'));
  await writeFile(
    join(temporary, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: options,
      files: ['consumer.tsx'],
    }),
  );
  execFileSync(process.execPath, [compiler, '-p', temporary], { stdio: 'inherit' });
  const negatives = [
    { name: 'native', diagnostic: /TS2745[\s\S]*never/ },
    { name: 'style', diagnostic: /TS2322[\s\S]*style/ },
    { name: 'value', diagnostic: /TS2322[\s\S]*number/ },
    { name: 'private', diagnostic: /TS2307[\s\S]*reacd\/dist/ },
  ];
  for (const { name, diagnostic } of negatives) {
    await writeFile(join(temporary, `${name}.tsx`), await fixture(`${name}.tsx.txt`));
    await writeFile(
      join(temporary, 'negative.json'),
      JSON.stringify({
        compilerOptions: { ...options, noEmit: true },
        files: [`${name}.tsx`],
      }),
    );
    const result = spawnSync(process.execPath, [compiler, '-p', 'negative.json'], {
      cwd: temporary,
      encoding: 'utf8',
    });
    assert.equal(result.status, 1, `${name} must fail compilation.`);
    assert.match(result.stdout + result.stderr, diagnostic);
  }
  await writeFile(join(temporary, 'runtime.mjs'), await fixture('runtime.mjs.txt'));
  execFileSync(process.execPath, ['runtime.mjs'], { cwd: temporary, stdio: 'inherit' });
} finally {
  await rm(temporary, { recursive: true, force: true });
}
console.log('Packed TSX, negative fixtures, SSR, state, and exports passed.');

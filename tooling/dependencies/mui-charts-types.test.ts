import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, expect, it, vi } from 'vitest';
import { MUI_CHARTS_DECLARATION_POLICY as P } from './mui-charts-policy.js';
import { patchMuiChartsDeclarations } from './mui-charts-types.js';

const roots: string[] = [];
const markers = 'isSinglePhase|eventType|mutableOptionsType|mutableStateType';
const digest = (source: string) => createHash('sha256').update(source).digest('hex');
afterEach(() => {
  vi.restoreAllMocks();
  for (const path of roots.splice(0)) rmSync(path, { recursive: true, force: true });
});

function original(source: string, file: (typeof P.files)[number]): string {
  if (digest(source) === file.original) return source;
  if (file.package === 'x-internal-gestures')
    return source.replace(
      new RegExp(`^(  )((?:abstract )?readonly (?:${markers}):)`, 'gm'),
      '$1protected $2',
    );
  return source
    .replace(' | keyof ChartsSurfaceProps | keyof GaugeProviderProps', '')
    .replace("'data' | 'highlighted'", "'data' | 'faded' | 'highlighted'")
    .replace(
      new RegExp(
        'Omit<React.SVGAttributes<(SVG(?:Circle|Path)Element)>, ' +
          'keyof CommonRadarSeriesPlotProps>',
        'g',
      ),
      'React.SVGAttributes<$1>',
    )
    .replace("import type FlatQueue from 'flatqueue';\n", '')
    .replace("import type FlatQueue from '@mui/x-charts-vendor/flatqueue';\n", '')
    .replace('export { default } from "flatqueue";\n', '')
    .replace('export type { default as FlatQueue } from "flatqueue";\n', '')
    .replace("import type { FlatQueue } from '@mui/x-charts-vendor/flatqueue';\n", '')
    .replace(
      'import type { ChartsAxisProps } from "../../../../models/axis.',
      'import type { ChartsAxisProps } from "../../../../ChartsAxis/index.',
    )
    .replace(
      /ChartsTypeFeatureFlags\[Extract<'(\w+)', keyof ChartsTypeFeatureFlags>\]/g,
      "ChartsTypeFeatureFlags['$1']",
    )
    .replace(
      /ChartsSeriesConfig\[Extract<'(\w+)', keyof ChartsSeriesConfig>\]/g,
      "ChartsSeriesConfig['$1']",
    );
}

function fixture(sourceRoot = pathToFileURL(process.cwd() + '/')) {
  const path = mkdtempSync(join(tmpdir(), 'reacd-chart-declarations-'));
  roots.push(path);
  const root = pathToFileURL(path + '/');
  for (const { name, version } of P.packages) {
    const sdk = new URL(`node_modules/@mui/${name}/`, root);
    mkdirSync(sdk, { recursive: true });
    writeFileSync(
      new URL('package.json', sdk),
      JSON.stringify({
        name: `@mui/${name}`,
        version,
      }),
    );
    writeFileSync(new URL('runtime.js', sdk), 'untouched();');
  }
  for (const file of P.files) {
    const target = new URL(`node_modules/@mui/${file.package}/${file.name}`, root);
    mkdirSync(new URL('.', target), { recursive: true });
    const installed = readFileSync(
      new URL(`node_modules/@mui/${file.package}/${file.name}`, sourceRoot),
      'utf8',
    );
    const source = original(installed, file);
    expect(digest(source)).toBe(file.original);
    writeFileSync(target, source);
  }
  return root;
}

it('verifies exact corrections, leaves runtime untouched and is idempotent', () => {
  const root = fixture();
  expect(patchMuiChartsDeclarations(root)).toBe(P.files.length);
  for (const file of P.files) {
    const source = readFileSync(
      new URL(`node_modules/@mui/${file.package}/${file.name}`, root),
      'utf8',
    );
    expect(digest(source)).toBe(file.patched);
  }
  for (const { name } of P.packages)
    expect(
      readFileSync(new URL(`node_modules/@mui/${name}/runtime.js`, root), 'utf8'),
    ).toBe('untouched();');
  expect(patchMuiChartsDeclarations(root)).toBe(0);
  expect(patchMuiChartsDeclarations(fixture(root))).toBe(P.files.length);
});

it('rejects drift in the last declaration before writing the first', () => {
  const root = fixture();
  const last = P.files.at(-1);
  if (!last) throw new Error('Missing guarded declaration');
  writeFileSync(
    new URL(`node_modules/@mui/${last.package}/${last.name}`, root),
    'unexpected declarations',
  );
  expect(() => patchMuiChartsDeclarations(root)).toThrow('Unexpected MUI Charts');
  const first = P.files[0];
  const source = readFileSync(
    new URL(`node_modules/@mui/${first.package}/${first.name}`, root),
    'utf8',
  );
  expect(digest(source)).toBe(first.original);
});

it.each(P.packages)('rejects unknown $name package versions', ({ name }) => {
  const root = fixture();
  writeFileSync(
    new URL(`node_modules/@mui/${name}/package.json`, root),
    JSON.stringify({ name: `@mui/${name}`, version: '9.18.0' }),
  );
  expect(() => patchMuiChartsDeclarations(root)).toThrow();
});

it('rejects nonregular declaration paths', () => {
  const root = fixture();
  const first = P.files[0];
  const target = new URL(`node_modules/@mui/${first.package}/${first.name}`, root);
  rmSync(target);
  mkdirSync(target);
  expect(() => patchMuiChartsDeclarations(root)).toThrow('regular file');
});

it('rejects a failed transform before any declaration write', () => {
  const root = fixture();
  vi.spyOn(String.prototype, 'replace').mockReturnValueOnce('invalid transform');
  expect(() => patchMuiChartsDeclarations(root)).toThrow('transformed hash');
});

it('restores the vendor default type export rather than assuming hoisted types', () => {
  const root = fixture();
  const sdk = new URL('node_modules/@mui/x-charts-vendor/', root);
  mkdirSync(sdk, { recursive: true });
  writeFileSync(
    new URL('package.json', sdk),
    JSON.stringify({
      name: '@mui/x-charts-vendor',
      version: '9.15.0',
    }),
  );
  const source = readFileSync(
    new URL(
      'node_modules/@mui/x-charts-vendor/flatqueue.d.ts',
      pathToFileURL(process.cwd() + '/'),
    ),
    'utf8',
  );
  writeFileSync(new URL('flatqueue.d.ts', sdk), source);
  patchMuiChartsDeclarations(root);
  expect(readFileSync(new URL('flatqueue.d.ts', sdk), 'utf8')).toContain(
    'export type { default as FlatQueue } from "flatqueue";',
  );
});

it.each(['direct', 'vendor'] as const)(
  'migrates the exact earlier %s correction without force writes',
  (kind) => {
    const root = fixture();
    for (const file of P.files.filter((entry) =>
      entry.name.startsWith('internals/Flatbush.'),
    )) {
      const target = new URL(`node_modules/@mui/${file.package}/${file.name}`, root);
      const source = readFileSync(target, 'utf8');
      writeFileSync(
        target,
        (kind === 'direct'
          ? "import type FlatQueue from 'flatqueue';\n"
          : "import type FlatQueue from '@mui/x-charts-vendor/flatqueue';\n") + source,
      );
    }
    if (kind === 'vendor') {
      const target = new URL('node_modules/@mui/x-charts-vendor/flatqueue.d.ts', root);
      writeFileSync(
        target,
        readFileSync(target, 'utf8') + 'export { default } from "flatqueue";\n',
      );
    }
    expect(patchMuiChartsDeclarations(root)).toBe(P.files.length);
  },
);

it('rejects unknown migration bytes rather than trusting their import prefix', () => {
  const root = fixture();
  const target = new URL('node_modules/@mui/x-charts/internals/Flatbush.d.mts', root);
  writeFileSync(target, "import type FlatQueue from 'flatqueue';\ncorrupted");
  expect(() => patchMuiChartsDeclarations(root)).toThrow('Unexpected MUI Charts');
});

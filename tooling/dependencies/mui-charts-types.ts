import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { MUI_CHARTS_DECLARATION_POLICY as P } from './mui-charts-policy.js';

type GuardedFile = (typeof P.files)[number];
const markers = 'isSinglePhase|eventType|mutableOptionsType|mutableStateType';
const digest = (source: string) => createHash('sha256').update(source).digest('hex');

function correct(source: string, file: GuardedFile): string {
  if (file.package === 'x-charts-vendor') {
    return (
      source.replace('export { default } from "flatqueue";\n', '') +
      'export type { default as FlatQueue } from "flatqueue";\n'
    );
  }
  if (file.package === 'x-internal-gestures')
    return source.replace(
      new RegExp(`protected ((?:abstract )?readonly (?:${markers}):)`, 'g'),
      '$1',
    );
  if (file.name.startsWith('Gauge/'))
    return source.replace(
      "Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>",
      "Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | " +
        'keyof ChartsSurfaceProps | keyof GaugeProviderProps>',
    );
  if (file.name.startsWith('PieChart/')) return source.replace("'faded' | ", '');
  if (file.name.startsWith('RadarChart/'))
    return source.replace(
      /React.SVGAttributes<(SVG(?:Circle|Path)Element)>/g,
      'Omit<React.SVGAttributes<$1>, keyof CommonRadarSeriesPlotProps>',
    );
  if (file.name.startsWith('internals/Flatbush.')) {
    return (
      "import type { FlatQueue } from '@mui/x-charts-vendor/flatqueue';\n" +
      source
        .replace("import type FlatQueue from 'flatqueue';\n", '')
        .replace("import type FlatQueue from '@mui/x-charts-vendor/flatqueue';\n", '')
    );
  }
  if (file.name.startsWith('internals/plugins/'))
    return source.replace('../../../../ChartsAxis/index.', '../../../../models/axis.');
  if (file.name.startsWith('models/axis.'))
    return source.replace(
      "ChartsTypeFeatureFlags['seriesValuesOverride']",
      "ChartsTypeFeatureFlags[Extract<'seriesValuesOverride', " +
        'keyof ChartsTypeFeatureFlags>]',
    );
  if (file.name.startsWith('models/events.'))
    return source.replace(
      "ChartsTypeFeatureFlags['keyboardActivationOverride']",
      "ChartsTypeFeatureFlags[Extract<'keyboardActivationOverride', " +
        'keyof ChartsTypeFeatureFlags>]',
    );
  return source
    .replaceAll(
      "ChartsSeriesConfig['rangeBar']",
      "ChartsSeriesConfig[Extract<'rangeBar', keyof ChartsSeriesConfig>]",
    )
    .replaceAll(
      "ChartsSeriesConfig['ohlc']",
      "ChartsSeriesConfig[Extract<'ohlc', keyof ChartsSeriesConfig>]",
    );
}

export function patchMuiChartsDeclarations(root: URL): number {
  for (const { name, version } of P.packages) {
    const metadata: unknown = JSON.parse(
      readFileSync(new URL(`node_modules/@mui/${name}/package.json`, root), 'utf8'),
    );
    z.object({ name: z.literal(`@mui/${name}`), version: z.literal(version) }).parse(
      metadata,
    );
  }
  const plan = P.files.map((file) => {
    const path = new URL(`node_modules/@mui/${file.package}/${file.name}`, root);
    if (!lstatSync(path).isFile()) {
      throw new Error('MUI Charts declarations must be a regular file.');
    }
    const source = readFileSync(path, 'utf8');
    const hash = digest(source);
    if (hash === file.patched) return null;
    if (
      hash !== file.original &&
      (!('previous' in file) || !file.previous.some((accepted) => accepted === hash))
    ) {
      throw new Error('Unexpected MUI Charts declarations; refusing to patch.');
    }
    const next = correct(source, file);
    if (digest(next) !== file.patched) {
      throw new Error('MUI Charts transformed hash did not match; refusing to patch.');
    }
    return { path, source: next };
  });
  let changed = 0;
  for (const entry of plan) {
    if (entry === null) continue;
    writeFileSync(entry.path, entry.source);
    changed++;
  }
  return changed;
}

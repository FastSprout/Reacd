import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { chartSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chart/chart.schema.js';
import { ShadcnChart } from '../chart/chart.adapter.js';

export const nativeChartEntries = {
  Chart: renderEntry('Chart', chartSchema, ShadcnChart),
};

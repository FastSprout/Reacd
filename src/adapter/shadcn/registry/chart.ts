import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { chartSchema } from '@fastsprout/reacd/adapter-runtime/schema/chart/index.js';
import { ShadcnChart } from '../chart/chart.adapter.js';
export const chartEntries = { Chart: renderEntry('Chart', chartSchema, ShadcnChart) };

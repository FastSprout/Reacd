import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { chartSchema } from '../../../schema/chart/index.js';
import { ShadcnChart } from '../chart/chart.adapter.js';
export const chartEntries = { Chart: renderEntry('Chart', chartSchema, ShadcnChart) };

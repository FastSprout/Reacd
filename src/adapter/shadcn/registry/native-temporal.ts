import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { inputDateSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-date/index.js';
import { inputTimeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-time/index.js';
import { ShadcnInputDate } from '../input-date/input-date.adapter.js';
import { ShadcnInputTime } from '../input-time/input-time.adapter.js';

export const nativeTemporalEntries = {
  InputDate: renderEntry('InputDate', inputDateSchema, ShadcnInputDate),
  InputTime: renderEntry('InputTime', inputTimeSchema, ShadcnInputTime),
};

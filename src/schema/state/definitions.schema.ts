import { z } from 'zod';
import { richDocumentStateSchema } from './rich-document/rich-document.schema.js';
import { numberRangeStateSchema } from './number-range/number-range.schema.js';
import { fileListStateSchema } from './file-list/file-list.schema.js';
import { dateStateSchema } from './date/date.schema.js';
import { timeStateSchema } from './time/time.schema.js';
import { dateRangeStateSchema } from './date-range/date-range.schema.js';
import { timeRangeStateSchema } from './time-range/time-range.schema.js';
import { panelLayoutStateSchema } from './panel-layout/index.js';
import { STATE_POLICY } from '../../core/state-policy.js';
import { textStateSchema } from './text/text.schema.js';
import { numberStateSchema } from './number/number.schema.js';
import { nullableNumberStateSchema } from './nullable-number/nullable-number.schema.js';
import { booleanStateSchema } from './boolean/boolean.schema.js';
import { tableRowsStateSchema } from './table-rows/table-rows.schema.js';
import { selectionStateSchema } from './selection/selection.schema.js';
import { sortingStateSchema } from './sorting/sorting.schema.js';
import { filtersStateSchema } from './filters/filters.schema.js';
import { paginationStateSchema } from './pagination/pagination.schema.js';

export const stateDefinitionSchema = z.discriminatedUnion('kind', [
  richDocumentStateSchema,
  numberRangeStateSchema,
  fileListStateSchema,
  panelLayoutStateSchema,
  textStateSchema,
  numberStateSchema,
  nullableNumberStateSchema,
  booleanStateSchema,
  tableRowsStateSchema,
  selectionStateSchema,
  sortingStateSchema,
  filtersStateSchema,
  paginationStateSchema,
  dateStateSchema,
  timeStateSchema,
  dateRangeStateSchema,
  timeRangeStateSchema,
]);
export const stateDefinitionsSchema = z
  .array(stateDefinitionSchema)
  .max(STATE_POLICY.maxDefinitions)
  .refine(
    (definitions) =>
      new Set(definitions.map((item) => item.key)).size === definitions.length,
    'State keys must be unique.',
  )
  .readonly()
  .brand<'StateDefinitions'>();

export type StateDefinition = z.infer<typeof stateDefinitionSchema>;
export type StateDefinitions = z.infer<typeof stateDefinitionsSchema>;
export type StateValue = StateDefinition['initial'];
export type StateSnapshot = {
  [Definition in StateDefinition as Definition['kind']]: Readonly<{
    key: string;
    kind: Definition['kind'];
    value: Definition['initial'];
  }>;
}[StateDefinition['kind']];

import type { StateDefinition } from '../../schema/state/definitions.schema.js';
import { editorDocumentSchema } from '../../schema/editor/document/index.js';
import { numberRangeSchema } from '../../schema/number-range/index.js';
import { fileListValueSchema } from '../../schema/file-upload/index.js';
import {
  dateValueSchema,
  timeValueSchema,
  dateRangeValueSchema,
  timeRangeValueSchema,
} from '../../schema/date-time/index.js';
import { textSchema } from '../../schema/shared/values.js';
import { numberValueSchema } from '../../schema/state/number/number.schema.js';
import { nullableNumberValueSchema } from '../../schema/state/nullable-number/index.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { tableRowsValueSchema } from '../../schema/state/table-rows/index.js';
import { selectionValueSchema } from '../../schema/state/selection/selection.schema.js';
import { sortingValueSchema } from '../../schema/state/sorting/sorting.schema.js';
import { filtersValueSchema } from '../../schema/state/filters/filters.schema.js';
import { paginationValueSchema } from '../../schema/state/pagination/index.js';
import { createRegistryEntry } from './registry-entry.js';
import { panelLayoutValueSchema } from '../../schema/state/panel-layout/index.js';
import type { RegistryEntry } from './registry.types.js';

export function createEntry(definition: StateDefinition): RegistryEntry {
  switch (definition.kind) {
    case 'richDocument':
      return createRegistryEntry(definition, editorDocumentSchema, (value) => ({
        key: definition.key, kind: 'richDocument', value,
      }));
    case 'numberRange':
      return createRegistryEntry(definition, numberRangeSchema, (value) => ({
        key: definition.key, kind: 'numberRange', value,
      }));
    case 'fileList':
      return createRegistryEntry(definition, fileListValueSchema, (value) => ({
        key: definition.key, kind: 'fileList', value,
      }));
    case 'date':
      return createRegistryEntry(definition, dateValueSchema, (value) => ({
        key: definition.key, kind: 'date', value,
      }));
    case 'time':
      return createRegistryEntry(definition, timeValueSchema, (value) => ({
        key: definition.key, kind: 'time', value,
      }));
    case 'dateRange':
      return createRegistryEntry(definition, dateRangeValueSchema(), (value) => ({
        key: definition.key, kind: 'dateRange', value,
      }));
    case 'timeRange':
      return createRegistryEntry(definition, timeRangeValueSchema(), (value) => ({
        key: definition.key, kind: 'timeRange', value,
      }));
    case 'panelLayout':
      return createRegistryEntry(definition, panelLayoutValueSchema, (value) => ({
        key: definition.key,
        kind: 'panelLayout',
        value,
      }));
    case 'text':
      return createRegistryEntry(definition, textSchema, (value) => ({
        key: definition.key,
        kind: 'text',
        value,
      }));
    case 'number':
      return createRegistryEntry(definition, numberValueSchema, (value) => ({
        key: definition.key,
        kind: 'number',
        value,
      }));
    case 'nullableNumber':
      return createRegistryEntry(definition, nullableNumberValueSchema, (value) => ({
        key: definition.key,
        kind: 'nullableNumber',
        value,
      }));
    case 'boolean':
      return createRegistryEntry(definition, booleanValueSchema, (value) => ({
        key: definition.key,
        kind: 'boolean',
        value,
      }));
    case 'tableRows':
      return createRegistryEntry(definition, tableRowsValueSchema, (value) => ({
        key: definition.key,
        kind: 'tableRows',
        value,
      }));
    case 'selection':
      return createRegistryEntry(definition, selectionValueSchema, (value) => ({
        key: definition.key,
        kind: 'selection',
        value,
      }));
    case 'sorting':
      return createRegistryEntry(definition, sortingValueSchema, (value) => ({
        key: definition.key,
        kind: 'sorting',
        value,
      }));
    case 'filters':
      return createRegistryEntry(definition, filtersValueSchema, (value) => ({
        key: definition.key,
        kind: 'filters',
        value,
      }));
    case 'pagination':
      return createRegistryEntry(definition, paginationValueSchema, (value) => ({
        key: definition.key,
        kind: 'pagination',
        value,
      }));
  }
}

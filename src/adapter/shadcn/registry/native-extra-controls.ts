import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { collapsibleSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/collapsible/collapsible.schema.js';
import { paginationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pagination/pagination.schema.js';
import { inputNumberSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-number/index.js';
import { ShadcnCollapsible } from '../collapsible/collapsible.adapter.js';
import { ShadcnPagination } from '../pagination/pagination.adapter.js';
import { ShadcnInputNumber } from '../input-number/input-number.adapter.js';
import { pinInputSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pin-input/pin-input.schema.js';
import { ShadcnPinInput } from '../pin-input/pin-input.adapter.js';

export const nativeExtraControlsEntries = {
  Collapsible: renderEntry('Collapsible', collapsibleSchema, ShadcnCollapsible),
  Pagination: renderEntry('Pagination', paginationSchema, ShadcnPagination),
  InputNumber: renderEntry('InputNumber', inputNumberSchema, ShadcnInputNumber),
  PinInput: renderEntry('PinInput', pinInputSchema, ShadcnPinInput),
};

import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import {
  selectionKeySchema,
  selectionOptionsSchema,
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../selection/index.js';
import { listboxProperties } from './properties.schema.js';

export const listboxSingleChangeSchema = z.custom<(value: string) => boolean | void>(
  (value) => typeof value === 'function',
  FRAMEWORK_ERRORS.invalidCallback,
);
export const listboxMultipleChangeSchema = z.custom<
  (value: readonly string[]) => boolean | void
>((value) => typeof value === 'function', FRAMEWORK_ERRORS.invalidCallback);

const singleSchema = z
  .strictObject({
    ...listboxProperties,
    mode: z.literal('single').optional(),
    value: z.union([z.literal(SELECTION_POLICY.emptySingleValue), selectionKeySchema]),
    onValueChange: listboxSingleChangeSchema,
  })
  .refine(
    (props) =>
      selectionOptionsSchema.safeParse(props.items).success &&
      singleSelectionValueSchema(props.items).safeParse(props.value).success,
    'Selected value must belong to the Listbox catalog.',
  );

const multipleSchema = z
  .strictObject({
    ...listboxProperties,
    mode: z.literal('multiple'),
    value: z.array(selectionKeySchema).max(SELECTION_POLICY.maximumOptions).readonly(),
    onValueChange: listboxMultipleChangeSchema,
  })
  .refine(
    (props) =>
      selectionOptionsSchema.safeParse(props.items).success &&
      multipleSelectionValueSchema(props.items).safeParse(props.value).success,
    'Selected values must be unique Listbox catalog options.',
  );

export const listboxSchema = z.discriminatedUnion('mode', [
  singleSchema,
  multipleSchema,
]);

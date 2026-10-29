import { z } from 'zod';
import { ACCORDION_DEFAULTS, ACCORDION_MODES } from '../../core/accordion-policy.js';
import { CONTENT_POLICY } from '../../core/policy.js';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { labelSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const accordionValuesSchema = z
  .array(stateKeySchema)
  .max(CONTENT_POLICY.maxOptions)
  .refine(
    (values) => new Set(values).size === values.length,
    'Open values must be unique.',
  )
  .readonly();
export const accordionItemsSchema = z
  .array(
    z.strictObject({
      value: stateKeySchema,
      label: labelSchema,
      content: childrenSchema,
      disabled: z.boolean().optional(),
    }),
  )
  .min(1)
  .max(CONTENT_POLICY.maxOptions)
  .refine(
    (items) => new Set(items.map((item) => item.value)).size === items.length,
    'Accordion item values must be unique.',
  );

export function validAccordionSelection(properties: {
  items: readonly { value: string }[];
  value: readonly string[];
  mode?: 'single' | 'multiple' | undefined;
  collapsible?: boolean | undefined;
}): boolean {
  const mode = properties.mode ?? ACCORDION_DEFAULTS.mode;
  const collapsible = properties.collapsible ?? ACCORDION_DEFAULTS.collapsible;
  return (
    properties.value.every((value) =>
      properties.items.some((item) => item.value === value),
    ) &&
    (mode === 'multiple' ||
      (properties.value.length <= ACCORDION_DEFAULTS.singleLimit &&
        (collapsible || properties.value.length === ACCORDION_DEFAULTS.singleLimit)))
  );
}
export const accordionSchema = z
  .strictObject({
    label: labelSchema,
    items: accordionItemsSchema,
    value: accordionValuesSchema,
    mode: z.enum(ACCORDION_MODES).optional(),
    collapsible: z.boolean().optional(),
    retainContent: z.boolean().optional(),
    disabled: z.boolean().optional(),
    onValueChange: z.custom<(value: readonly string[]) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
  })
  .refine(validAccordionSelection, 'Invalid accordion selection.');

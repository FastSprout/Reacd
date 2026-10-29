import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import {
  NAVIGATION_COMPOSITION_POLICY,
} from '../../core/navigation-composition-policy.js';
import { footerColumnsSchema } from './footer-columns.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { labelSchema } from '../shared/values.js';
import {
  navigationTransportTargetSchema,
  uniqueNavigationKeys,
} from '../navigation-shared/target.schema.js';

const columns = z
  .array(
    z.strictObject({
      key: stateKeySchema,
      label: labelSchema,
      children: z
        .array(navigationTransportTargetSchema)
        .max(NAVIGATION_COMPOSITION_POLICY.maximumLinks)
        .refine(uniqueNavigationKeys, 'Link keys must be unique.')
        .readonly(),
    }),
  )
  .max(NAVIGATION_COMPOSITION_POLICY.maximumColumns)
  .refine(uniqueNavigationKeys, 'Column keys must be unique.')
  .readonly();

export interface FooterColumnsNode<Content> {
  type: 'FooterColumns';
  label: string;
  columns: z.infer<typeof columns>;
  left?: Content[] | undefined;
  right?: Content[] | undefined;
}

export function footerColumnsNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren).optional();
  return z.strictObject({
    ...footerColumnsSchema.shape,
    type: z.literal('FooterColumns'),
    columns,
    left: slot,
    right: slot,
  });
}

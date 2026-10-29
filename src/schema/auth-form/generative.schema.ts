import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { readStateBindingSchema } from '../state/binding.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import {
  authFormShape,
  authProviderSchema,
  uniqueAuthProviders,
} from './auth-form.schema.js';

const providerNodeSchema = authProviderSchema
  .omit({ onPress: true })
  .extend({ action: stateKeySchema });
const flagSchema = z.union([z.boolean(), readStateBindingSchema]).optional();

export interface AuthFormNode<Content> extends Omit<
  z.infer<ReturnType<typeof authFormNodeSchema<Content>>>,
  'children' | 'leading' | 'header' | 'footer'
> {
  children: Content[];
  leading?: Content[] | undefined;
  header?: Content[] | undefined;
  footer?: Content[] | undefined;
}

export function authFormNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    ...authFormShape,
    type: z.literal('AuthForm'),
    submitAction: stateKeySchema,
    loading: flagSchema,
    disabled: flagSchema,
    children: slot,
    leading: slot.optional(),
    header: slot.optional(),
    footer: slot.optional(),
    providers: z
      .array(providerNodeSchema)
      .max(DOCUMENT_POLICY.maxChildren)
      .refine(uniqueAuthProviders, 'Provider keys must be unique.')
      .readonly()
      .optional(),
  });
}

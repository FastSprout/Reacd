import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { formFieldPropertiesSchema, fieldErrorSchema } from './form-field.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';

export interface FormFieldNode<Child> extends Omit<
  z.infer<typeof formFieldPropertiesSchema>,
  'error'
> {
  readonly type: 'FormField';
  readonly error?: string | z.infer<typeof readStateBindingSchema> | undefined;
  readonly children: readonly Child[];
}

export function createFormFieldNodeSchema<Child extends z.ZodType>(child: Child) {
  return formFieldPropertiesSchema.extend({
    type: z.literal('FormField'),
    error: z.union([fieldErrorSchema, readStateBindingSchema]).optional(),
    children: z.array(child).max(DOCUMENT_POLICY.maxChildren).readonly(),
  });
}

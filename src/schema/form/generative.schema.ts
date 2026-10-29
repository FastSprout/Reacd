import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { readStateBindingSchema } from '../state/binding.schema.js';
import { formSchema } from './form.schema.js';

type ReadFlag = boolean | z.infer<typeof readStateBindingSchema>;

export interface FormNode<Child> extends Omit<
  z.infer<typeof formSchema>,
  'children' | 'onSubmit' | 'disabled' | 'submitting'
> {
  readonly type: 'Form';
  readonly submitAction: string;
  readonly disabled?: ReadFlag | undefined;
  readonly submitting?: ReadFlag | undefined;
  readonly children: readonly Child[];
}

export function createFormNodeSchema<Child extends z.ZodType>(child: Child) {
  const flag = z.union([z.boolean(), readStateBindingSchema]).optional();
  return formSchema
    .omit({ children: true, onSubmit: true, disabled: true, submitting: true })
    .extend({
      type: z.literal('Form'),
      submitAction: stateKeySchema,
      disabled: flag,
      submitting: flag,
      children: z.array(child).max(DOCUMENT_POLICY.maxChildren).readonly(),
    });
}

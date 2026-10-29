import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { editorialShape } from './editorial.js';

export function editorialTransportShape<Content>(content: z.ZodType<Content>) {
  const { onPress: _onPress, ...shape } = editorialShape;
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  return {
    ...shape,
    action: stateKeySchema.optional(),
    children: slot,
    header: slot.optional(),
    badge: slot.optional(),
    authors: slot.optional(),
    footer: slot.optional(),
    actions: slot.optional(),
  };
}

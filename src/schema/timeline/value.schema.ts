import { labelSchema } from '../shared/values.js';
export function timelineValueSchema(items: readonly { id: string }[]) {
  return labelSchema.refine(
    (value) => items.some((item) => item.id === value),
    'Timeline value must identify an event.',
  );
}

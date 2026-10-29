import { labelSchema } from '../shared/values.js';
import { enabledTabValue } from './tabs.schema.js';

export function tabValueSchema(
  items: readonly { value: string; disabled?: boolean | undefined }[],
) {
  return labelSchema.refine(
    (value) => enabledTabValue(items, value),
    'Selected tab must exist and be enabled.',
  );
}

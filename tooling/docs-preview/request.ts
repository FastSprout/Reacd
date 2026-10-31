import { z } from 'zod';
import { DOCS_PREVIEW_POLICY } from '../../src/core/docs-preview-policy.js';
import { COMPONENT_NAMES } from '../../src/components/component-names.js';

const previewRequestSchema = z.strictObject({
  component: z.enum(COMPONENT_NAMES),
  adapter: z.enum(['shadcn', 'mui']).optional(),
  template: z
    .enum(['saas-modern-light', 'erp-compact'])
    .default(DOCS_PREVIEW_POLICY.defaultTemplate),
  direction: z.enum(['ltr', 'rtl']).default(DOCS_PREVIEW_POLICY.defaultDirection),
});
export type PreviewRequest = z.infer<typeof previewRequestSchema>;

export function readPreviewRequest(search: string): PreviewRequest | null {
  if (search.length > DOCS_PREVIEW_POLICY.maximumQueryLength) return null;
  const parameters = new URLSearchParams(search);
  const keys = [...parameters.keys()];
  if (new Set(keys).size !== keys.length) return null;
  const result = previewRequestSchema.safeParse(Object.fromEntries(parameters));
  return result.success ? result.data : null;
}

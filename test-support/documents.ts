import type { ReacdDocument, ReacdNode } from '../src/index.js';

export function documentWith(root: ReacdNode): ReacdDocument {
  return { schemaVersion: '0.1', templateId: 'saas-modern-light', root };
}

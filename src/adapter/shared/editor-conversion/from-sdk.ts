import type { Node } from '@tiptap/pm/model';
import type { EditorDocument } from
  '@fastsprout/reacd/adapter-runtime/core/editor-document.js';
import {
  EDITOR_ERRORS,
  EDITOR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import type { Result } from '@fastsprout/reacd/adapter-runtime/core/result.js';
import { editorDocumentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/editor/document/index.js';
import { boundedSdkDocument } from './budget.js';
import { blockFromSdk, sdkChildren } from './from-sdk-block.js';
import { createSdkIdAllocator } from './id-allocator.js';

function failure(): Result<never> {
  return {
    success: false,
    issues: [{ path: 'Editor.value', message: EDITOR_ERRORS.projection }],
  };
}

export function editorDocumentFromSdk(document: Node): Result<EditorDocument> {
  if (!boundedSdkDocument(document)) return failure();
  try {
    document.check();
    const identify = createSdkIdAllocator(document);
    const parsed = editorDocumentSchema.safeParse({
      version: EDITOR_POLICY.version,
      blocks: sdkChildren(document, (node) => blockFromSdk(node, identify)),
    });
    return parsed.success
      ? { success: true, data: parsed.data }
      : {
          success: false,
          issues: parsed.error.issues.map((issue) => ({
            path: ['Editor', 'value', ...issue.path].map(String).join('.'),
            message: issue.message,
          })),
        };
  } catch {
    return failure();
  }
}

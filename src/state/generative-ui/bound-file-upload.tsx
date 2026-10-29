import { useMemo } from 'react';
import type { z } from 'zod';
import { FileUpload } from '../../components/file-upload/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { fileUploadValueSchema } from '../../schema/file-upload/index.js';
import type { fileUploadNodeSchema } from '../../schema/file-upload/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';
export function BoundFileUpload({
  node,
  registry,
}: {
  node: z.infer<typeof fileUploadNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['fileList'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () =>
      fileUploadValueSchema({
        multiple: node.multiple,
        maxFiles: node.maxFiles,
        accept: node.accept,
      }),
    [node.multiple, node.maxFiles, node.accept],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <FileUpload
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

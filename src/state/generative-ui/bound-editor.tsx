import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Editor } from '../../components/editor/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { EditorNode } from '../../schema/editor/generative.schema.js';
import { editorDocumentSchema } from '../../schema/editor/document/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

interface BoundEditorProps {
  readonly node: Omit<EditorNode<unknown>, 'toolbar' | 'children'>;
  readonly registry: StateRegistry;
  readonly toolbar?: ReactNode;
  readonly children?: ReactNode;
}

export function BoundEditor({ node, registry, toolbar, children }: BoundEditorProps) {
  const target = useMemo(
    () => ({ kinds: ['richDocument'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const result = useBoundValue(registry, node.value, target, editorDocumentSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly: literalReadOnly, ...properties } = node;
  const readOnly = literalReadOnly || node.value.mode === 'read';
  return (
    <Editor
      {...properties}
      value={result.data.value}
      readOnly={readOnly}
      onValueChange={(document) => {
        if (readOnly || node.disabled) return;
        result.data.write(document);
      }}
      toolbar={toolbar}
    >
      {children}
    </Editor>
  );
}

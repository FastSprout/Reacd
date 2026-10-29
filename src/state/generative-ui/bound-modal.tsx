import type { ReactNode } from 'react';
import { Modal } from '../../components/modal/modal.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
export function BoundModal({
  node,
  registry,
  children,
  footer,
}: {
  node: Extract<GenerativeNode, { type: 'Modal' }>;
  registry: StateRegistry;
  children: ReactNode;
  footer: ReactNode;
}) {
  const result = useBoundValue(registry, node.open, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Modal
      title={node.title}
      description={node.description}
      open={result.data.value}
      onOpenChange={result.data.write}
      triggerLabel={node.triggerLabel}
      closeLabel={node.closeLabel}
      disabled={node.disabled}
      dismissible={node.dismissible}
      modal={node.modal}
      overlay={node.overlay}
      fullscreen={node.fullscreen}
      retainContent={node.retainContent}
      footer={footer}
    >
      {children}
    </Modal>
  );
}

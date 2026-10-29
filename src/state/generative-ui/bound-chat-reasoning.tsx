import { ChatReasoning } from '../../components/chat-reasoning/index.js';
import { chatReasoningSchema } from '../../schema/chat-reasoning/index.js';
import type { ChatFeedbackNode } from '../../schema/chat-tool/feedback-contracts.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { ResolveReadValue } from './resolve-read-value.js';
import { useBoundValue } from './use-bound-value.js';

const TARGETS = {
  read: { kinds: ['boolean'], mode: 'read' },
  readWrite: { kinds: ['boolean'], mode: 'readWrite' },
} as const;
const TEXT_KINDS = ['text'] as const;

export function BoundChatReasoning({
  node,
  registry,
}: {
  node: Extract<ChatFeedbackNode, { type: 'ChatReasoning' }>;
  registry: StateRegistry;
}) {
  const value = useBoundValue(
    registry,
    node.open,
    TARGETS[node.open.mode],
    booleanValueSchema,
  );
  if (!value.success) return <Issues issues={value.issues} />;
  const { type: _type, text, open: _open, ...properties } = node;
  return (
    <ResolveReadValue
      registry={registry}
      kinds={TEXT_KINDS}
      reference={typeof text === 'object' ? text : undefined}
      literal={typeof text === 'string' ? text : ''}
      schema={chatReasoningSchema.shape.text}
    >
      {(content) => (
        <ChatReasoning
          {...properties}
          text={content}
          open={value.data.value}
          onOpenChange={value.data.write}
          disabled={node.disabled === true || node.open.mode === 'read'}
        />
      )}
    </ResolveReadValue>
  );
}

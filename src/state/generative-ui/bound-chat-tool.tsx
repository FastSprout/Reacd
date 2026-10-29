import { ChatTool } from '../../components/chat-tool/index.js';
import type { ChatFeedbackNode } from '../../schema/chat-tool/feedback-contracts.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';

const TARGETS = {
  read: { kinds: ['boolean'], mode: 'read' },
  readWrite: { kinds: ['boolean'], mode: 'readWrite' },
} as const;

export function BoundChatTool({
  node,
  registry,
  actions,
}: {
  node: Extract<ChatFeedbackNode, { type: 'ChatTool' }>;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const value = useBoundValue(
    registry,
    node.open,
    TARGETS[node.open.mode],
    booleanValueSchema,
  );
  if (!value.success) return <Issues issues={value.issues} />;
  const {
    type: _type,
    open: _open,
    approveAction,
    rejectAction,
    retryAction,
    ...properties
  } = node;
  function callback(key: string | undefined) {
    if (key === undefined) return undefined;
    return () => {
      const handler = Object.hasOwn(actions, key) ? actions[key] : undefined;
      if (typeof handler === 'function') handler({ state: registry });
    };
  }
  return (
    <ChatTool
      {...properties}
      open={value.data.value}
      onOpenChange={value.data.write}
      onApprove={callback(approveAction)}
      onReject={callback(rejectAction)}
      onRetry={callback(retryAction)}
      disabled={node.disabled === true || node.open.mode === 'read'}
    />
  );
}

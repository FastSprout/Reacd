import { ChatShimmer } from '../../components/chat-shimmer/index.js';
import { CHAT_FEEDBACK_DEFAULTS } from '../../core/chat-feedback-policy.js';
import type { ChatFeedbackNode } from '../../schema/chat-tool/feedback-contracts.js';
import { chatShimmerSchema } from '../../schema/chat-shimmer/index.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { ResolveReadValue } from './resolve-read-value.js';
import { BoundChatReasoning } from './bound-chat-reasoning.js';
import { BoundChatTool } from './bound-chat-tool.js';

const TEXT_KINDS = ['text'] as const;
const BOOLEAN_KINDS = ['boolean'] as const;

export function ChatFeedbackNodeView({
  node,
  registry,
  actions,
}: {
  node: ChatFeedbackNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  if (node.type === 'ChatReasoning')
    return <BoundChatReasoning node={node} registry={registry} />;
  if (node.type === 'ChatTool')
    return <BoundChatTool node={node} registry={registry} actions={actions} />;
  return (
    <ResolveReadValue
      registry={registry}
      kinds={TEXT_KINDS}
      reference={typeof node.text === 'object' ? node.text : undefined}
      literal={typeof node.text === 'string' ? node.text : ''}
      schema={chatShimmerSchema.shape.text}
    >
      {(text) => (
        <ResolveReadValue
          registry={registry}
          kinds={BOOLEAN_KINDS}
          reference={typeof node.active === 'object' ? node.active : undefined}
          literal={
            typeof node.active === 'boolean'
              ? node.active
              : CHAT_FEEDBACK_DEFAULTS.active
          }
          schema={booleanValueSchema}
        >
          {(active) => <ChatShimmer text={text} active={active} />}
        </ResolveReadValue>
      )}
    </ResolveReadValue>
  );
}

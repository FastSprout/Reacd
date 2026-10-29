import type { ReactNode } from 'react';
import { ChatPrompt } from '../../components/chat-prompt/index.js';
import { CHAT_COMPOSER_DEFAULTS } from '../../core/chat-composer-policy.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { ChatPromptNode } from '../../schema/chat-prompt/index.js';
import { promptDraftSchema } from '../../schema/chat-prompt/index.js';
import { promptStatusSchema } from '../../schema/chat-prompt/composer-contracts.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { ResolveReadValue } from './resolve-read-value.js';
import { useBoundValue } from './use-bound-value.js';
import { composerAction } from './composer-action.js';

const TARGETS = {
  read: { kinds: ['text'], mode: 'read' },
  readWrite: { kinds: ['text'], mode: 'readWrite' },
} as const;
const TEXT_KINDS = ['text'] as const;

export function BoundChatPrompt<Child>({
  node,
  registry,
  actions,
  footer,
}: {
  node: ChatPromptNode<Child>;
  registry: StateRegistry;
  actions: GenerativeActions;
  footer: ReactNode;
}) {
  const result = useBoundValue(
    registry,
    node.value,
    TARGETS[node.value.mode],
    promptDraftSchema,
  );
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type: _type,
    value: _value,
    footer: _footer,
    status,
    submitAction,
    stopAction,
    retryAction,
    closeAction,
    attachments,
    ...properties
  } = node;
  const submit = composerAction(submitAction, actions, registry);
  return (
    <ResolveReadValue
      registry={registry}
      kinds={TEXT_KINDS}
      reference={typeof status === 'object' ? status : undefined}
      literal={typeof status === 'string' ? status : CHAT_COMPOSER_DEFAULTS.status}
      schema={promptStatusSchema}
    >
      {(resolvedStatus) => (
        <ChatPrompt
          {...properties}
          value={result.data.value}
          onValueChange={result.data.write}
          onSubmit={() => submit?.()}
          readOnly={node.readOnly === true || node.value.mode === 'read'}
          status={resolvedStatus}
          footer={footer}
          onStop={composerAction(stopAction, actions, registry)}
          onRetry={composerAction(retryAction, actions, registry)}
          onClose={composerAction(closeAction, actions, registry)}
          attachments={attachments?.map(({ removeAction, ...file }) => ({
            ...file,
            removable: removeAction !== undefined,
          }))}
          onRemoveAttachment={
            attachments?.some((file) => file.removeAction !== undefined)
              ? (id) => {
                  const file = attachments.find((candidate) => candidate.id === id);
                  composerAction(file?.removeAction, actions, registry)?.();
                }
              : undefined
          }
        />
      )}
    </ResolveReadValue>
  );
}

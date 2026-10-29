import type { ReactNode } from 'react';
import type { z } from 'zod';
import { ChatAttachment } from '../../components/chat-attachment/index.js';
import { ChatMessage } from '../../components/chat-message/index.js';
import { ChatMessages } from '../../components/chat-messages/index.js';
import type { ChatNode } from '../../schema/chat-messages/action-references.js';
import type { chatMessageLiteralSchema } from '../../schema/chat-message/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function ChatNodeView({
  node,
  registry,
  actions,
}: {
  node: ChatNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}): ReactNode {
  function callback(key: string | undefined) {
    if (key === undefined) return undefined;
    return () => {
      const handler = Object.hasOwn(actions, key) ? actions[key] : undefined;
      if (typeof handler === 'function') handler({ state: registry });
    };
  }

  function messageProperties(message: z.infer<typeof chatMessageLiteralSchema>) {
    const { actions: controls, ...properties } = message;
    return {
      ...properties,
      actions: controls?.map(({ action, ...control }) => ({
        ...control,
        onPress() {
          const handler = Object.hasOwn(actions, action) ? actions[action] : undefined;
          if (typeof handler === 'function') handler({ state: registry });
        },
      })),
    };
  }

  switch (node.type) {
    case 'ChatAttachment': {
      const { type: _type, removeAction, ...properties } = node;
      return <ChatAttachment {...properties} onRemove={callback(removeAction)} />;
    }
    case 'ChatMessage': {
      const { type: _type, ...message } = node;
      return <ChatMessage {...messageProperties(message)} />;
    }
    case 'ChatMessages': {
      const { type: _type, messages, retryAction, ...properties } = node;
      return (
        <ChatMessages
          {...properties}
          messages={messages.map(messageProperties)}
          onRetry={callback(retryAction)}
        />
      );
    }
  }
}

import type { ReactNode } from 'react';
import { ChatPalette } from '../../components/chat-palette/index.js';
import { ChatPromptSubmit } from '../../components/chat-prompt-submit/index.js';
import type { ChatPromptNode } from '../../schema/chat-prompt/index.js';
import type { ChatPaletteNode } from '../../schema/chat-palette/index.js';
import type { ChatComposerLeaf } from '../../schema/chat-prompt/composer-contracts.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundChatPrompt } from './bound-chat-prompt.js';
import { composerAction } from './composer-action.js';

export function ChatComposerNodeView<Child>({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: ChatPromptNode<Child> | ChatPaletteNode<Child> | ChatComposerLeaf;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: Child, index: number) => ReactNode;
}) {
  if (node.type === 'ChatPrompt')
    return (
      <BoundChatPrompt
        node={node}
        registry={registry}
        actions={actions}
        footer={node.footer?.map(renderChild)}
      />
    );
  if (node.type === 'ChatPalette')
    return (
      <ChatPalette label={node.label} prompt={node.prompt?.map(renderChild)}>
        {node.children.map(renderChild)}
      </ChatPalette>
    );
  const { type: _type, submitAction, stopAction, retryAction, ...properties } = node;
  return (
    <ChatPromptSubmit
      {...properties}
      onSubmit={composerAction(submitAction, actions, registry)}
      onStop={composerAction(stopAction, actions, registry)}
      onRetry={composerAction(retryAction, actions, registry)}
    />
  );
}

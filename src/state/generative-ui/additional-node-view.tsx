import { BoundEditor } from './bound-editor.js';
import { EditorMenuNodeView } from './editor-menu-node-view.js';
import { EditorToolbar } from '../../components/editor-toolbar/index.js';
import { EditorDragHandle } from '../../components/editor-drag-handle/index.js';
import type { ReactNode } from 'react';
import { Card, FieldGroup, Progress } from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundCalendar } from './bound-calendar.js';
import { BoundInputTime } from './bound-input-time.js';
import { BoundInputDate } from './bound-input-date.js';
import { BoundProgress } from './bound-progress.js';
import { GenerativeAlert } from './generative-alert.js';
import { GenerativeIcon } from './generative-icon.js';
import { ChatFeedbackNodeView } from './chat-feedback-node-view.js';

export type AdditionalNode = Extract<
  GenerativeNode,
  {
    type:
      | 'Editor'
      | 'EditorToolbar'
      | 'EditorDragHandle'
      | 'EditorSuggestionMenu'
      | 'EditorMentionMenu'
      | 'EditorEmojiMenu'
      | 'Card'
      | 'FieldGroup'
      | 'Calendar'
      | 'InputTime'
      | 'InputDate'
      | 'Progress'
      | 'Alert'
      | 'Icon'
      | 'ChatReasoning'
      | 'ChatTool'
      | 'ChatShimmer';
  }
>;

const ADDITIONAL_TYPES = new Set<GenerativeNode['type']>([
  'Editor', 'EditorToolbar', 'EditorDragHandle',
  'EditorSuggestionMenu', 'EditorMentionMenu', 'EditorEmojiMenu',
  'Card', 'FieldGroup', 'Calendar', 'InputTime', 'InputDate', 'Progress',
  'Alert', 'Icon', 'ChatReasoning', 'ChatTool', 'ChatShimmer',
]);

export function isAdditionalNode(node: GenerativeNode): node is AdditionalNode {
  return ADDITIONAL_TYPES.has(node.type);
}

export function AdditionalNodeView({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: AdditionalNode;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  switch (node.type) {
    case 'EditorSuggestionMenu':
    case 'EditorMentionMenu':
    case 'EditorEmojiMenu':
      return <EditorMenuNodeView node={node} />;
    case 'Editor': {
      const { toolbar, children, ...properties } = node;
      return (
        <BoundEditor node={properties} registry={registry}
          toolbar={toolbar?.map(renderChild)}>
          {children?.map(renderChild)}
        </BoundEditor>
      );
    }
    case 'EditorToolbar': {
      const { type: _type, ...properties } = node;
      return <EditorToolbar {...properties} />;
    }
    case 'EditorDragHandle': {
      const { type: _type, ...properties } = node;
      return <EditorDragHandle {...properties} />;
    }
    case 'ChatReasoning':
    case 'ChatTool':
    case 'ChatShimmer':
      return <ChatFeedbackNodeView node={node} registry={registry} actions={actions} />;
    case 'Alert':
      return <GenerativeAlert node={node} registry={registry} actions={actions} />;
    case 'Icon':
      return <GenerativeIcon node={node} />;
    case 'Calendar':
      return <BoundCalendar node={node} registry={registry} />;
    case 'InputTime':
      return <BoundInputTime node={node} registry={registry} />;
    case 'InputDate':
      return <BoundInputDate node={node} registry={registry} />;
    case 'FieldGroup': {
      const { type: _type, children, ...properties } = node;
      return <FieldGroup {...properties}>{children.map(renderChild)}</FieldGroup>;
    }
    case 'Card': {
      const { type: _type, children, header, footer, ...properties } = node;
      return (
        <Card
          {...properties}
          header={header?.map(renderChild)}
          footer={footer?.map(renderChild)}
        >
          {children.map(renderChild)}
        </Card>
      );
    }
    case 'Progress': {
      const { type: _type, value, ...properties } = node;
      return value !== null && typeof value === 'object' ? (
        <BoundProgress {...properties} reference={value} registry={registry} />
      ) : (
        <Progress {...properties} value={value} />
      );
    }
  }
}

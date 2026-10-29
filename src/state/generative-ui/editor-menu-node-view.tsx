import {
  EditorEmojiMenu,
  EditorMentionMenu,
  EditorSuggestionMenu,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';

type MenuNode = Extract<
  GenerativeNode,
  { type: 'EditorSuggestionMenu' | 'EditorMentionMenu' | 'EditorEmojiMenu' }
>;

export function EditorMenuNodeView({ node }: { readonly node: MenuNode }) {
  switch (node.type) {
    case 'EditorSuggestionMenu': {
      const { type: _type, ...properties } = node;
      return <EditorSuggestionMenu {...properties} />;
    }
    case 'EditorMentionMenu': {
      const { type: _type, ...properties } = node;
      return <EditorMentionMenu {...properties} />;
    }
    case 'EditorEmojiMenu': {
      const { type: _type, ...properties } = node;
      return <EditorEmojiMenu {...properties} />;
    }
  }
}

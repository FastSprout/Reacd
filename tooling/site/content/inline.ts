import type { Definition, PhrasingContent } from 'mdast';
import type { ProseInline } from '../../../src/core/prose.js';

export function inlineNodes(
  nodes: readonly PhrasingContent[],
  definitions: ReadonlyMap<string, Definition>,
): ProseInline[] {
  return nodes.map((node): ProseInline => {
    switch (node.type) {
      case 'text':
        return { type: 'text', text: node.value };
      case 'inlineCode':
        return { type: 'code', text: node.value };
      case 'break':
        return { type: 'break' };
      case 'strong':
      case 'emphasis':
      case 'delete':
        return { type: node.type, children: inlineNodes(node.children, definitions) };
      case 'link':
        return {
          type: 'link',
          href: node.url,
          children: inlineNodes(node.children, definitions),
        };
      case 'linkReference': {
        const reference = definitions.get(node.identifier.toLowerCase());
        if (!reference) throw new Error(`Unknown link reference: ${node.identifier}`);
        return {
          type: 'link',
          href: reference.url,
          children: inlineNodes(node.children, definitions),
        };
      }
      default:
        throw new Error(`Unsupported inline Markdown node: ${node.type}`);
    }
  });
}

export function inlineText(nodes: readonly ProseInline[]): string {
  return nodes
    .map((node): string => {
      if ('text' in node) return node.text;
      return 'children' in node ? inlineText(node.children) : '\n';
    })
    .join('');
}

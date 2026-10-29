import type { Node } from '@tiptap/pm/model';
import { z } from 'zod';
import { EDITOR_SDK_BLOCK_TYPES } from '../editor-sdk/block-types.js';
import { sdkAttribute } from './attribute.js';
import { inlineContentFromSdk } from './from-sdk-inline.js';

type Allocator = (node: Node) => string;
const blockType = z.enum(EDITOR_SDK_BLOCK_TYPES);

export function sdkChildren(node: Node, project: (child: Node) => unknown): unknown[] {
  const children: unknown[] = [];
  node.forEach((child) => {
    children.push(project(child));
  });
  return children;
}
const projectors = {
  paragraph(node: Node, identify: Allocator): unknown {
    return {
      type: 'paragraph',
      id: identify(node),
      content: inlineContentFromSdk(node),
    };
  },
  heading(node: Node, identify: Allocator): unknown {
    return {
      type: 'heading',
      id: identify(node),
      level: sdkAttribute(node, 'level'),
      content: inlineContentFromSdk(node),
    };
  },
  blockquote(node: Node, identify: Allocator): unknown {
    return {
      type: 'quote',
      id: identify(node),
      children: sdkChildren(node, (child) => blockFromSdk(child, identify)),
    };
  },
  codeBlock(node: Node, identify: Allocator): unknown {
    const language = sdkAttribute(node, 'language');
    return {
      type: 'codeBlock',
      id: identify(node),
      text: node.textContent,
      ...(language == null ? {} : { language }),
    };
  },
  bulletList(node: Node, identify: Allocator): unknown {
    return {
      type: 'bulletList',
      id: identify(node),
      items: sdkChildren(node, (child) => blockFromSdk(child, identify)),
    };
  },
  orderedList(node: Node, identify: Allocator): unknown {
    return {
      type: 'orderedList',
      id: identify(node),
      start: sdkAttribute(node, 'start'),
      items: sdkChildren(node, (child) => blockFromSdk(child, identify)),
    };
  },
  listItem(node: Node, identify: Allocator): unknown {
    return {
      type: 'listItem',
      id: identify(node),
      children: sdkChildren(node, (child) => blockFromSdk(child, identify)),
    };
  },
  horizontalRule(node: Node, identify: Allocator): unknown {
    return { type: 'separator', id: identify(node) };
  },
};

export function blockFromSdk(node: Node, identify: Allocator): unknown {
  return projectors[blockType.parse(node.type.name)](node, identify);
}

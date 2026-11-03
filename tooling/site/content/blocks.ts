import type { Definition, RootContent } from 'mdast';
import type { ProseBlock } from '../../../src/core/prose.js';
import type { SiteHeading } from './model.js';
import { highlightCode } from './highlight.js';
import { inlineNodes, inlineText } from './inline.js';

export interface MarkdownContext {
  readonly definitions: ReadonlyMap<string, Definition>;
  readonly headings: SiteHeading[];
  readonly anchors: Set<string>;
}

export function headingAnchor(title: string, anchors: Set<string>): string {
  const base =
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/^-+/, '') || 'section';
  let id = base;
  let suffix = 1;
  while (anchors.has(id)) id = `${base}-${suffix++}`;
  anchors.add(id);
  return id;
}

export async function proseBlocks(
  nodes: readonly RootContent[],
  context: MarkdownContext,
): Promise<ProseBlock[]> {
  const { definitions } = context;
  const result: ProseBlock[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'definition':
        break;
      case 'paragraph': {
        const image = node.children.find((child) => child.type === 'image');
        if (node.children.length === 1 && image) {
          result.push({
            type: 'image',
            src: image.url,
            alt: image.alt ?? '',
            ...(image.title ? { title: image.title } : {}),
          });
        } else
          result.push({
            type: 'paragraph',
            children: inlineNodes(node.children, definitions),
          });
        break;
      }
      case 'heading': {
        const children = inlineNodes(node.children, definitions);
        const title = inlineText(children);
        const id = headingAnchor(title, context.anchors);
        context.headings.push({ id, level: node.depth, title });
        result.push({ type: 'heading', level: node.depth, id, children });
        break;
      }
      case 'code':
        result.push(await highlightCode(node.value, node.lang ?? 'text'));
        break;
      case 'thematicBreak':
        result.push({ type: 'thematicBreak' });
        break;
      case 'blockquote':
        result.push({
          type: 'quote',
          children: await proseBlocks(node.children, context),
        });
        break;
      case 'list':
        result.push({
          type: 'list',
          ordered: node.ordered === true,
          ...(typeof node.start === 'number' ? { start: node.start } : {}),
          items: await Promise.all(
            node.children.map(async (item) => ({
              children: await proseBlocks(item.children, context),
              ...(typeof item.checked === 'boolean' ? { checked: item.checked } : {}),
            })),
          ),
        });
        break;
      case 'table': {
        const [first, ...rows] = node.children;
        if (!first) throw new Error('Markdown tables must contain a header');
        const cells = (row: typeof first) =>
          row.children.map((cell) => inlineNodes(cell.children, definitions));
        result.push({ type: 'table', header: cells(first), rows: rows.map(cells) });
        break;
      }
      default:
        throw new Error(`Unsupported block Markdown node: ${node.type}`);
    }
  }
  return result;
}

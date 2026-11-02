import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';
import type { Definition, Nodes, RootContent } from 'mdast';
import type { ProseDocument } from '../../../src/core/prose.js';
import type { SiteSection } from './model.js';
import { headingAnchor, proseBlocks } from './blocks.js';
import type { MarkdownContext } from './blocks.js';
import { inlineNodes, inlineText } from './inline.js';
import type { Frontmatter } from './frontmatter.js';

const processor = unified().use(remarkParse).use(remarkGfm);
const previewMarker = '<!-- reacd-live-preview -->';
const sourcePosition = z.object({ start: z.object({ offset: z.number().int() }) });

function findDefinitions(nodes: readonly Nodes[], result: Map<string, Definition>) {
  for (const node of nodes) {
    if (node.type === 'definition') {
      const key = node.identifier.toLowerCase();
      if (result.has(key)) throw new Error(`Duplicate link definition: ${key}`);
      result.set(key, node);
    }
    if ('children' in node) findDefinitions(node.children, result);
  }
}

export async function parseMarkdown(source: string, preview?: Frontmatter['preview']) {
  const root = processor.parse(source);
  const definitions = new Map<string, Definition>();
  findDefinitions(root.children, definitions);
  const context: MarkdownContext = { definitions, headings: [], anchors: new Set() };
  const sections: SiteSection[] = [];
  let title: string | undefined;
  let titleAnchor = 'page-title';
  let pending: RootContent[] = [];
  let pendingKey = '';
  let previewSeen = false;
  async function flush() {
    const document: ProseDocument = await proseBlocks(pending, context);
    if (document.length) sections.push({ type: 'prose', key: pendingKey, document });
    pending = [];
  }
  for (const node of root.children) {
    const offset = sourcePosition.parse(node.position).start.offset;
    if (node.type === 'heading' && node.depth === 1 && title === undefined) {
      title = inlineText(inlineNodes(node.children, definitions));
      titleAnchor = headingAnchor(title, context.anchors);
    } else if (node.type === 'html' && node.value === previewMarker) {
      if (!preview || previewSeen) {
        throw new Error('Preview marker requires one unique validated preview');
      }
      await flush();
      sections.push({ ...preview, key: `preview:${offset}` });
      previewSeen = true;
    } else {
      if (!pending.length) pendingKey = `prose:${offset}`;
      pending.push(node);
    }
  }
  await flush();
  return {
    ...(title === undefined ? {} : { title }),
    titleAnchor,
    headings: context.headings,
    sections,
  };
}

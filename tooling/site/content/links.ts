import { posix } from 'node:path';
import type { ProseBlock, ProseInline } from '../../../src/core/prose.js';
import type { SitePage } from './model.js';
import { publicFile } from './files.js';
import { SITE_POLICY } from '../policy.js';

export async function resolveDestination(
  root: string,
  sourcePath: string,
  href: string,
  pages: readonly SitePage[],
  origin: string = SITE_POLICY.canonicalOrigin,
): Promise<string> {
  if (/[\\\s\p{Cc}]/u.test(href) || href.startsWith('//')) {
    throw new Error(`Unsafe documentation URL: ${href}`);
  }
  if (/^https?:/i.test(href)) {
    const absolute = new URL(href);
    if (absolute.origin !== new URL(origin).origin) return href;
    href = `${absolute.pathname}${absolute.search}${absolute.hash}`;
  }
  if (/^(?:mailto:|tel:)/i.test(href)) return href;
  if (/^[a-z][\w+.-]*:/i.test(href)) {
    throw new Error(`Unsupported documentation URL protocol: ${href}`);
  }
  const address = new URL(href, `https://reacd.invalid/${sourcePath}`);
  const boundary = href.search(/[?#]/);
  const pathPart = href.slice(0, boundary < 0 ? href.length : boundary);
  const target =
    pathPart === ''
      ? sourcePath
      : posix
          .normalize(
            posix.join(
              pathPart.startsWith('/') ? '' : posix.dirname(sourcePath),
              decodeURIComponent(pathPart),
            ),
          )
          .replace(/^\//, '');
  if (target.startsWith('../') || target === '..') {
    throw new Error(`Documentation URL escapes source: ${href}`);
  }
  const page = pages.find(
    (candidate) =>
      candidate.sourcePath === target || candidate.route === address.pathname,
  );
  if (page) {
    const id = decodeURIComponent(address.hash.slice(1));
    if (
      id &&
      id !== page.titleAnchor &&
      !page.headings.some((entry) => entry.id === id)
    ) {
      throw new Error(`Unknown documentation anchor: ${sourcePath} -> ${href}`);
    }
    return `${page.route}${address.search}${address.hash}`;
  }
  if (target.endsWith('.md') || !posix.extname(target)) {
    throw new Error(`Unknown documentation page: ${sourcePath} -> ${href}`);
  }
  await publicFile(root, target);
  return `/${target}${address.search}${address.hash}`;
}

async function resolveInline(
  root: string,
  page: SitePage,
  pages: readonly SitePage[],
  nodes: readonly ProseInline[],
  origin: string,
): Promise<ProseInline[]> {
  return Promise.all(
    nodes.map(async (node): Promise<ProseInline> => {
      if (node.type === 'link')
        return {
          ...node,
          href: await resolveDestination(
            root,
            page.sourcePath,
            node.href,
            pages,
            origin,
          ),
          children: await resolveInline(root, page, pages, node.children, origin),
        };
      if ('children' in node)
        return {
          ...node,
          children: await resolveInline(root, page, pages, node.children, origin),
        };
      return node;
    }),
  );
}

export async function resolveBlocks(
  root: string,
  page: SitePage,
  pages: readonly SitePage[],
  blocks: readonly ProseBlock[],
  origin: string = SITE_POLICY.canonicalOrigin,
): Promise<ProseBlock[]> {
  return Promise.all(
    blocks.map(async (block): Promise<ProseBlock> => {
      switch (block.type) {
        case 'paragraph':
        case 'heading':
          return {
            ...block,
            children: await resolveInline(root, page, pages, block.children, origin),
          };
        case 'image':
          return {
            ...block,
            src: await resolveDestination(
              root,
              page.sourcePath,
              block.src,
              pages,
              origin,
            ),
          };
        case 'quote':
          return {
            ...block,
            children: await resolveBlocks(root, page, pages, block.children, origin),
          };
        case 'list':
          return {
            ...block,
            items: await Promise.all(
              block.items.map(async (item) => ({
                ...item,
                children: await resolveBlocks(root, page, pages, item.children, origin),
              })),
            ),
          };
        case 'table': {
          const cells = (row: readonly (readonly ProseInline[])[]) =>
            Promise.all(
              row.map((cell) => resolveInline(root, page, pages, cell, origin)),
            );
          return {
            ...block,
            header: await cells(block.header),
            rows: await Promise.all(block.rows.map(cells)),
          };
        }
        default:
          return block;
      }
    }),
  );
}

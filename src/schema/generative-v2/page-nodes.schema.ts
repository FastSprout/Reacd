import type { z } from 'zod';
import { pageAsideNodeSchema } from '../page-aside/generative.schema.js';
import type { PageAsideNode } from '../page-aside/generative.schema.js';
import { pageBodyNodeSchema } from '../page-body/generative.schema.js';
import type { PageBodyNode } from '../page-body/generative.schema.js';
import { pageColumnsNodeSchema } from '../page-columns/generative.schema.js';
import type { PageColumnsNode } from '../page-columns/generative.schema.js';
import { pageGridNodeSchema } from '../page-grid/generative.schema.js';
import type { PageGridNode } from '../page-grid/generative.schema.js';
import { pageListNodeSchema } from '../page-list/generative.schema.js';
import type { PageListNode } from '../page-list/generative.schema.js';

export type PageCompositionNode<Content> =
  | PageAsideNode<Content>
  | PageBodyNode<Content>
  | PageColumnsNode<Content>
  | PageGridNode<Content>
  | PageListNode<Content>;

export function pageNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    pageAsideNodeSchema(content),
    pageBodyNodeSchema(content),
    pageColumnsNodeSchema(content),
    pageGridNodeSchema(content),
    pageListNodeSchema(content),
  ] as const;
}

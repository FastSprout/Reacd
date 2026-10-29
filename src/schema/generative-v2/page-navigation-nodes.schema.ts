import type { z } from 'zod';
import { pageAnchorsNodeSchema } from '../page-anchors/generative.schema.js';
import type { PageAnchorsNode } from '../page-anchors/generative.schema.js';
import { pageLinksNodeSchema } from '../page-links/generative.schema.js';
import type { PageLinksNode } from '../page-links/generative.schema.js';
import { pageCTANodeSchema } from '../page-cta/generative.schema.js';
import type { PageCTANode } from '../page-cta/generative.schema.js';
import { pageNodeSchema } from '../page/generative.schema.js';
import type { PageNode } from '../page/generative.schema.js';
import { sectionNodeSchema } from '../section/generative.schema.js';
import type { SectionNode } from '../section/generative.schema.js';

export type PageNavigationNode<Content> =
  | PageAnchorsNode<Content>
  | PageLinksNode<Content>
  | PageCTANode<Content>
  | PageNode<Content>
  | SectionNode<Content>;

export function pageNavigationNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    pageAnchorsNodeSchema(content),
    pageLinksNodeSchema(content),
    pageCTANodeSchema(content),
    pageNodeSchema(content),
    sectionNodeSchema(content),
  ] as const;
}

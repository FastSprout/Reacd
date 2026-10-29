import type { z } from 'zod';
import { pageHeaderNodeSchema } from '../page-header/generative.schema.js';
import type { PageHeaderNode } from '../page-header/generative.schema.js';
import { pageFeatureNodeSchema } from '../page-feature/generative.schema.js';
import type { PageFeatureNode } from '../page-feature/generative.schema.js';
import { pageCardNodeSchema } from '../page-card/generative.schema.js';
import type { PageCardNode } from '../page-card/generative.schema.js';
import { pageHeroNodeSchema } from '../page-hero/generative.schema.js';
import type { PageHeroNode } from '../page-hero/generative.schema.js';
import { pageSectionNodeSchema } from '../page-section/generative.schema.js';
import type { PageSectionNode } from '../page-section/generative.schema.js';

export type PagePresentationNode<Content> =
  | PageHeaderNode<Content>
  | PageFeatureNode<Content>
  | PageCardNode<Content>
  | PageHeroNode<Content>
  | PageSectionNode<Content>;

export function pagePresentationNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    pageHeaderNodeSchema(content),
    pageFeatureNodeSchema(content),
    pageCardNodeSchema(content),
    pageHeroNodeSchema(content),
    pageSectionNodeSchema(content),
  ] as const;
}

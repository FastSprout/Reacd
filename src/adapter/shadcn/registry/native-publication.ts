import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { blogPostSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/blog-post/blog-post.schema.js';
import { ShadcnBlogPost } from '../blog-post/blog-post.adapter.js';
import { blogPostsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/blog-posts/blog-posts.schema.js';
import { ShadcnBlogPosts } from '../blog-posts/blog-posts.adapter.js';
import { changelogVersionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/changelog-version/index.js';
import { ShadcnChangelogVersion } from
  '../changelog-version/changelog-version.adapter.js';
import { changelogVersionsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/changelog-versions/index.js';
import { ShadcnChangelogVersions } from
  '../changelog-versions/changelog-versions.adapter.js';
import { contentSurroundSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-surround/index.js';
import { ShadcnContentSurround } from '../content-surround/content-surround.adapter.js';
import { footerColumnsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/footer-columns/footer-columns.schema.js';
import { ShadcnFooterColumns } from '../footer-columns/footer-columns.adapter.js';
import { pricingPlanSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pricing-plan/pricing-plan.schema.js';
import { ShadcnPricingPlan } from '../pricing-plan/pricing-plan.adapter.js';
import { pricingPlansSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pricing-plans/pricing-plans.schema.js';
import { ShadcnPricingPlans } from '../pricing-plans/pricing-plans.adapter.js';
import { pricingTableSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pricing-table/pricing-table.schema.js';
import { ShadcnPricingTable } from '../pricing-table/pricing-table.adapter.js';

export const nativePublicationEntries = {
  BlogPost: renderEntry('BlogPost', blogPostSchema, ShadcnBlogPost),
  BlogPosts: renderEntry('BlogPosts', blogPostsSchema, ShadcnBlogPosts),
  ChangelogVersion: renderEntry(
    'ChangelogVersion',
    changelogVersionSchema,
    ShadcnChangelogVersion,
  ),
  ChangelogVersions: renderEntry(
    'ChangelogVersions',
    changelogVersionsSchema,
    ShadcnChangelogVersions,
  ),
  ContentSurround: renderEntry(
    'ContentSurround',
    contentSurroundSchema,
    ShadcnContentSurround,
  ),
  FooterColumns: renderEntry('FooterColumns', footerColumnsSchema, ShadcnFooterColumns),
  PricingPlan: renderEntry('PricingPlan', pricingPlanSchema, ShadcnPricingPlan),
  PricingPlans: renderEntry('PricingPlans', pricingPlansSchema, ShadcnPricingPlans),
  PricingTable: renderEntry('PricingTable', pricingTableSchema, ShadcnPricingTable),
};

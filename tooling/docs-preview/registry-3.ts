import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup3 = {
  AuthForm: previewEntry('examples/auth-form.tsx', () =>
    import('../../docs/examples/auth-form.js').then((module) => ({
      default: module.AuthFormExample,
    })),
  ),
  PageLogos: previewEntry('examples/page-logos.tsx', () =>
    import('../../docs/examples/page-logos.js').then((module) => ({
      default: module.PageLogosExample,
    })),
  ),
  ContentSurround: previewEntry('examples/content-surround.tsx', () =>
    import('../../docs/examples/content-surround.js').then((module) => ({
      default: module.ContentSurroundExample,
    })),
  ),
  ContentSearch: previewEntry('examples/content-search.tsx', () =>
    import('../../docs/examples/content-search.js').then((module) => ({
      default: module.ContentSearchExample,
    })),
  ),
  ContentSearchButton: previewEntry('examples/content-search-button.tsx', () =>
    import('../../docs/examples/content-search-button.js').then((module) => ({
      default: module.ContentSearchButtonExample,
    })),
  ),
  PricingPlan: previewEntry('examples/pricing-plan.tsx', () =>
    import('../../docs/examples/pricing-plan.js').then((module) => ({
      default: module.PricingPlanExample,
    })),
  ),
  PricingPlans: previewEntry('examples/pricing-plans.tsx', () =>
    import('../../docs/examples/pricing-plans.js').then((module) => ({
      default: module.PricingPlansExample,
    })),
  ),
  PricingTable: previewEntry('examples/pricing-table.tsx', () =>
    import('../../docs/examples/pricing-table.js').then((module) => ({
      default: module.PricingTableExample,
    })),
  ),
  DashboardGroup: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardSidebar: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardPanel: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardNavbar: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardToolbar: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardSidebarCollapse: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardSidebarToggle: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardResizeHandle: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardSearch: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  DashboardSearchButton: previewEntry('examples/dashboard.tsx', () =>
    import('../../docs/examples/dashboard.js').then((module) => ({
      default: module.DashboardExample,
    })),
  ),
  BlogPost: previewEntry('examples/blog-post.tsx', () =>
    import('../../docs/examples/blog-post.js').then((module) => ({
      default: module.BlogPostExample,
    })),
  ),
  BlogPosts: previewEntry('examples/blog-posts.tsx', () =>
    import('../../docs/examples/blog-posts.js').then((module) => ({
      default: module.BlogPostsExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;

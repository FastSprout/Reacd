import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';
import type { RECIPE_NAMES } from './recipe-names.js';

export const recipeRegistry = {
  QuickStart: previewEntry('examples/quick-start.tsx', () =>
    import('../../../docs/examples/quick-start.js').then((module) => ({
      default: module.QuickStartExample,
    })),
  ),
  Showcase: previewEntry('examples/showcase.tsx', () =>
    import('../../../docs/examples/showcase.js').then((module) => ({
      default: module.ShowcaseExample,
    })),
  ),
  Counter: previewEntry('examples/recipe-counter.tsx', () =>
    import('../../../docs/examples/recipe-counter.js').then((module) => ({
      default: module.CounterExample,
    })),
  ),
  ContactForm: previewEntry('examples/recipe-contact-form.tsx', () =>
    import('../../../docs/examples/recipe-contact-form.js').then((module) => ({
      default: module.ContactFormExample,
    })),
  ),
  OrdersDashboard: previewEntry('examples/recipe-orders-dashboard.tsx', () =>
    import('../../../docs/examples/recipe-orders-dashboard.js').then((module) => ({
      default: module.OrdersDashboardExample,
    })),
  ),
} satisfies Record<(typeof RECIPE_NAMES)[number], PreviewEntry>;

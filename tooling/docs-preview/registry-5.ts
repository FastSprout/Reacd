import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup5 = {
  PageHero: previewEntry('examples/page-hero.tsx', () =>
    import('../../docs/examples/page-hero.js').then((module) => ({
      default: module.PageHeroExample,
    })),
  ),
  PageSection: previewEntry('examples/page-section.tsx', () =>
    import('../../docs/examples/page-section.js').then((module) => ({
      default: module.PageSectionExample,
    })),
  ),
  PageAside: previewEntry('examples/page-aside.tsx', () =>
    import('../../docs/examples/page-aside.js').then((module) => ({
      default: module.PageAsideExample,
    })),
  ),
  PageBody: previewEntry('examples/page-body.tsx', () =>
    import('../../docs/examples/page-body.js').then((module) => ({
      default: module.PageBodyExample,
    })),
  ),
  PageColumns: previewEntry('examples/page-columns.tsx', () =>
    import('../../docs/examples/page-columns.js').then((module) => ({
      default: module.PageColumnsExample,
    })),
  ),
  PageGrid: previewEntry('examples/page-grid.tsx', () =>
    import('../../docs/examples/page-grid.js').then((module) => ({
      default: module.PageGridExample,
    })),
  ),
  PageList: previewEntry('examples/page-list.tsx', () =>
    import('../../docs/examples/page-list.js').then((module) => ({
      default: module.PageListExample,
    })),
  ),
  InputRating: previewEntry('examples/input-rating.tsx', () =>
    import('../../docs/examples/input-rating.js').then((module) => ({
      default: module.InputRatingExample,
    })),
  ),
  App: previewEntry('examples/app.tsx', () =>
    import('../../docs/examples/app.js').then((module) => ({
      default: module.AppExample,
    })),
  ),
  Error: previewEntry('examples/error.tsx', () =>
    import('../../docs/examples/error.js').then((module) => ({
      default: module.ErrorExample,
    })),
  ),
  Theme: previewEntry('examples/theme.tsx', () =>
    import('../../docs/examples/theme.js').then((module) => ({
      default: module.ThemeExample,
    })),
  ),
  Timeline: previewEntry('examples/timeline.tsx', () =>
    import('../../docs/examples/timeline.js').then((module) => ({
      default: module.TimelineExample,
    })),
  ),
  ScrollArea: previewEntry('examples/scroll-area.tsx', () =>
    import('../../docs/examples/scroll-area.js').then((module) => ({
      default: module.ScrollAreaExample,
    })),
  ),
  Container: previewEntry('examples/container.tsx', () =>
    import('../../docs/examples/container.js').then((module) => ({
      default: module.ContainerExample,
    })),
  ),
  Main: previewEntry('examples/main.tsx', () =>
    import('../../docs/examples/main.js').then((module) => ({
      default: module.MainExample,
    })),
  ),
  Header: previewEntry('examples/header.tsx', () =>
    import('../../docs/examples/header.js').then((module) => ({
      default: module.HeaderExample,
    })),
  ),
  Footer: previewEntry('examples/footer.tsx', () =>
    import('../../docs/examples/footer.js').then((module) => ({
      default: module.FooterExample,
    })),
  ),
  Separator: previewEntry('examples/separator.tsx', () =>
    import('../../docs/examples/separator.js').then((module) => ({
      default: module.SeparatorExample,
    })),
  ),
  User: previewEntry('examples/user.tsx', () =>
    import('../../docs/examples/user.js').then((module) => ({
      default: module.UserExample,
    })),
  ),
  ProgressGroup: previewEntry('examples/progress-group.tsx', () =>
    import('../../docs/examples/progress-group.js').then((module) => ({
      default: module.ProgressGroupExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;

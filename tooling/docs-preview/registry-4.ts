import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

export const previewGroup4 = {
  ChangelogVersion: previewEntry('examples/changelog-version.tsx', () =>
    import('../../docs/examples/changelog-version.js').then((module) => ({
      default: module.ChangelogVersionExample,
    })),
  ),
  ChangelogVersions: previewEntry('examples/changelog-versions.tsx', () =>
    import('../../docs/examples/changelog-versions.js').then((module) => ({
      default: module.ChangelogVersionsExample,
    })),
  ),
  Drawer: previewEntry('examples/drawer.tsx', () =>
    import('../../docs/examples/drawer.js').then((module) => ({
      default: module.DrawerExample,
    })),
  ),
  Slideover: previewEntry('examples/slideover.tsx', () =>
    import('../../docs/examples/slideover.js').then((module) => ({
      default: module.SlideoverExample,
    })),
  ),
  ContextMenu: previewEntry('examples/context-menu.tsx', () =>
    import('../../docs/examples/context-menu.js').then((module) => ({
      default: module.ContextMenuExample,
    })),
  ),
  DropdownMenu: previewEntry('examples/dropdown-menu.tsx', () =>
    import('../../docs/examples/dropdown-menu.js').then((module) => ({
      default: module.DropdownMenuExample,
    })),
  ),
  Sidebar: previewEntry('examples/sidebar.tsx', () =>
    import('../../docs/examples/sidebar.js').then((module) => ({
      default: module.SidebarExample,
    })),
  ),
  Splitter: previewEntry('examples/splitter.tsx', () =>
    import('../../docs/examples/splitter.js').then((module) => ({
      default: module.SplitterExample,
    })),
  ),
  PageAnchors: previewEntry('examples/page-anchors.tsx', () =>
    import('../../docs/examples/page-anchors.js').then((module) => ({
      default: module.PageAnchorsExample,
    })),
  ),
  PageLinks: previewEntry('examples/page-links.tsx', () =>
    import('../../docs/examples/page-links.js').then((module) => ({
      default: module.PageLinksExample,
    })),
  ),
  PageCTA: previewEntry('examples/page-cta.tsx', () =>
    import('../../docs/examples/page-cta.js').then((module) => ({
      default: module.PageCTAExample,
    })),
  ),
  CommandPalette: previewEntry('examples/command-palette.tsx', () =>
    import('../../docs/examples/command-palette.js').then((module) => ({
      default: module.CommandPaletteExample,
    })),
  ),
  InputTags: previewEntry('examples/input-tags.tsx', () =>
    import('../../docs/examples/input-tags.js').then((module) => ({
      default: module.InputTagsExample,
    })),
  ),
  Tree: previewEntry('examples/tree.tsx', () =>
    import('../../docs/examples/tree.js').then((module) => ({
      default: module.TreeExample,
    })),
  ),
  FooterColumns: previewEntry('examples/footer-columns.tsx', () =>
    import('../../docs/examples/footer-columns.js').then((module) => ({
      default: module.FooterColumnsExample,
    })),
  ),
  NavigationMenu: previewEntry('examples/navigation-menu.tsx', () =>
    import('../../docs/examples/navigation-menu.js').then((module) => ({
      default: module.NavigationMenuExample,
    })),
  ),
  Stepper: previewEntry('examples/stepper.tsx', () =>
    import('../../docs/examples/stepper.js').then((module) => ({
      default: module.StepperExample,
    })),
  ),
  PageHeader: previewEntry('examples/page-header.tsx', () =>
    import('../../docs/examples/page-header.js').then((module) => ({
      default: module.PageHeaderExample,
    })),
  ),
  PageFeature: previewEntry('examples/page-feature.tsx', () =>
    import('../../docs/examples/page-feature.js').then((module) => ({
      default: module.PageFeatureExample,
    })),
  ),
  PageCard: previewEntry('examples/page-card.tsx', () =>
    import('../../docs/examples/page-card.js').then((module) => ({
      default: module.PageCardExample,
    })),
  ),
} satisfies Record<string, PreviewEntry>;

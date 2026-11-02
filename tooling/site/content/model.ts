import type { ProseDocument, ComponentCatalog } from '@fastsprout/reacd';
import type { RECIPE_NAMES } from '../previews/recipe-names.js';

export type ComponentName = keyof ComponentCatalog;
export type RecipeName = (typeof RECIPE_NAMES)[number];

export interface SiteHeading {
  readonly id: string;
  readonly level: 1 | 2 | 3 | 4 | 5 | 6;
  readonly title: string;
}

export type SiteSection =
  | {
      readonly type: 'prose';
      readonly key: string;
      readonly document: ProseDocument;
    }
  | {
      readonly type: 'preview';
      readonly key: string;
      readonly component?: ComponentName;
      readonly example?: RecipeName;
    };

export interface SitePage {
  readonly route: string;
  readonly sourcePath: string;
  readonly title: string;
  readonly titleAnchor: string;
  readonly description: string;
  readonly headings: readonly SiteHeading[];
  readonly sections: readonly SiteSection[];
  readonly source: string;
}

export interface SiteNavigation {
  readonly key: string;
  readonly label: string;
  readonly href?: string;
  readonly children?: readonly SiteNavigation[];
}

export interface SiteManifest {
  readonly origin: string;
  readonly title: string;
  readonly description: string;
  readonly navigation: readonly SiteNavigation[];
  readonly pages: readonly SitePage[];
}

import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { breadcrumbSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/breadcrumb/breadcrumb.schema.js';
import { kbdSchema } from '@fastsprout/reacd/adapter-runtime/schema/kbd/kbd.schema.js';
import { separatorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/separator/separator.schema.js';
import { ShadcnBreadcrumb } from '../breadcrumb/breadcrumb.adapter.js';
import { ShadcnKbd } from '../kbd/kbd.adapter.js';
import { ShadcnSeparator } from '../separator/separator.adapter.js';

export const nativeNavigationContentEntries = {
  Breadcrumb: renderEntry('Breadcrumb', breadcrumbSchema, ShadcnBreadcrumb),
  Kbd: renderEntry('Kbd', kbdSchema, ShadcnKbd),
  Separator: renderEntry('Separator', separatorSchema, ShadcnSeparator),
};

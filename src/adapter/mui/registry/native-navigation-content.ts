import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { breadcrumbSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/breadcrumb/breadcrumb.schema.js';
import { kbdSchema } from '@fastsprout/reacd/adapter-runtime/schema/kbd/kbd.schema.js';
import { separatorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/separator/separator.schema.js';
import { MuiBreadcrumb } from '../breadcrumb/breadcrumb.adapter.js';
import { MuiKbd } from '../kbd/kbd.adapter.js';
import { MuiSeparator } from '../separator/separator.adapter.js';

export const nativeNavigationContentEntries = {
  Breadcrumb: renderEntry('Breadcrumb', breadcrumbSchema, MuiBreadcrumb),
  Kbd: renderEntry('Kbd', kbdSchema, MuiKbd),
  Separator: renderEntry('Separator', separatorSchema, MuiSeparator),
};

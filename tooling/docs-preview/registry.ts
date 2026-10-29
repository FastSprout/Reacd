import type { ComponentCatalog } from '../../src/components/catalog.js';
import type { PreviewEntry } from './entry.js';
import { previewGroup1 } from './registry-1.js';
import { previewGroup2 } from './registry-2.js';
import { previewGroup3 } from './registry-3.js';
import { previewGroup4 } from './registry-4.js';
import { previewGroup5 } from './registry-5.js';
import { previewGroup6 } from './registry-6.js';
import { previewGroup7 } from './registry-7.js';
import { previewGroup8 } from './registry-8.js';

export const previewRegistry = {
  ...previewGroup1,
  ...previewGroup2,
  ...previewGroup3,
  ...previewGroup4,
  ...previewGroup5,
  ...previewGroup6,
  ...previewGroup7,
  ...previewGroup8,
} satisfies Record<keyof ComponentCatalog, PreviewEntry>;

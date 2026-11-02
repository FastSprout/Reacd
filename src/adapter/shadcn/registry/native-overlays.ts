import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { popoverSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/popover/popover.schema.js';
import { drawerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/drawer/drawer.schema.js';
import { slideoverSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/slideover/slideover.schema.js';
import { ShadcnPopover } from '../popover/popover.adapter.js';
import { ShadcnDrawer } from '../drawer/drawer.adapter.js';
import { ShadcnSlideover } from '../slideover/slideover.adapter.js';

export const nativeOverlayEntries = {
  Popover: renderEntry('Popover', popoverSchema, ShadcnPopover),
  Drawer: renderEntry('Drawer', drawerSchema, ShadcnDrawer),
  Slideover: renderEntry('Slideover', slideoverSchema, ShadcnSlideover),
};

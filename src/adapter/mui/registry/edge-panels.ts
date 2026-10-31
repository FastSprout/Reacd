import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { drawerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/drawer/drawer.schema.js';
import { slideoverSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/slideover/slideover.schema.js';
import { MuiDrawer } from '../drawer/drawer.adapter.js';
import { MuiSlideover } from '../slideover/slideover.adapter.js';
export const edgePanelEntries = {
  Drawer: renderEntry('Drawer', drawerSchema, MuiDrawer),
  Slideover: renderEntry('Slideover', slideoverSchema, MuiSlideover),
};

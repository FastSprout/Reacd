import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { drawerSchema } from '../../../schema/drawer/drawer.schema.js';
import { slideoverSchema } from '../../../schema/slideover/slideover.schema.js';
import { ShadcnDrawer } from '../drawer/drawer.adapter.js';
import { ShadcnSlideover } from '../slideover/slideover.adapter.js';
export const edgePanelEntries = {
  Drawer: renderEntry('Drawer', drawerSchema, ShadcnDrawer),
  Slideover: renderEntry('Slideover', slideoverSchema, ShadcnSlideover),
};

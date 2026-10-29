import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { sidebarSchema } from '../../../schema/sidebar/sidebar.schema.js';
import { splitterSchema } from '../../../schema/splitter/splitter.schema.js';
import { ShadcnSidebar } from '../sidebar/sidebar.adapter.js';
import { ShadcnSplitter } from '../splitter/splitter.adapter.js';

export const sidebarSplitterEntries = {
  Sidebar: renderEntry('Sidebar', sidebarSchema, ShadcnSidebar),
  Splitter: renderEntry('Splitter', splitterSchema, ShadcnSplitter),
};

import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { sidebarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/sidebar/sidebar.schema.js';
import { splitterSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/splitter/splitter.schema.js';
import { MuiSidebar } from '../sidebar/sidebar.adapter.js';
import { MuiSplitter } from '../splitter/splitter.adapter.js';

export const sidebarSplitterEntries = {
  Sidebar: renderEntry('Sidebar', sidebarSchema, MuiSidebar),
  Splitter: renderEntry('Splitter', splitterSchema, MuiSplitter),
};

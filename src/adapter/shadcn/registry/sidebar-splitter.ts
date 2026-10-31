import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { sidebarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/sidebar/sidebar.schema.js';
import { splitterSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/splitter/splitter.schema.js';
import { ShadcnSidebar } from '../sidebar/sidebar.adapter.js';
import { ShadcnSplitter } from '../splitter/splitter.adapter.js';

export const sidebarSplitterEntries = {
  Sidebar: renderEntry('Sidebar', sidebarSchema, ShadcnSidebar),
  Splitter: renderEntry('Splitter', splitterSchema, ShadcnSplitter),
};

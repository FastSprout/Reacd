import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { mainSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/main/main.schema.js';
import { ShadcnMain } from '../main/main.adapter.js';
import { footerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/footer/footer.schema.js';
import { ShadcnFooter } from '../footer/footer.adapter.js';
import { spacerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/spacer/spacer.schema.js';
import { ShadcnSpacer } from '../spacer/spacer.adapter.js';
import { splitViewSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/split-view/split-view.schema.js';
import { ShadcnSplitView } from '../split-view/split-view.adapter.js';
import { viewportSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/viewport/viewport.schema.js';
import { ShadcnViewport } from '../viewport/viewport.adapter.js';
import { pageHeaderSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-header/page-header.schema.js';
import { ShadcnPageHeader } from '../page-header/page-header.adapter.js';

export const nativeStructureEntries = {
  Main: renderEntry('Main', mainSchema, ShadcnMain),
  Footer: renderEntry('Footer', footerSchema, ShadcnFooter),
  Spacer: renderEntry('Spacer', spacerSchema, ShadcnSpacer),
  SplitView: renderEntry('SplitView', splitViewSchema, ShadcnSplitView),
  Viewport: renderEntry('Viewport', viewportSchema, ShadcnViewport),
  PageHeader: renderEntry('PageHeader', pageHeaderSchema, ShadcnPageHeader),
};

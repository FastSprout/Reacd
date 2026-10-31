import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { formSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/form/form.schema.js';
import { sectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/section/section.schema.js';
import { pageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page/page.schema.js';
import { toolbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/toolbar/toolbar.schema.js';
import { dividerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/divider/divider.schema.js';
import { spacerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/spacer/spacer.schema.js';
import { splitViewSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/split-view/split-view.schema.js';
import { viewportSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/viewport/viewport.schema.js';
import { FormSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form.renderer.js';
import { SectionSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/section/section.renderer.js';
import { PageSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/page/page.renderer.js';
import { ToolbarSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/toolbar/toolbar.renderer.js';
import { SpacerSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/spacer/spacer.renderer.js';
import { SplitViewSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/split-view/split-view.renderer.js';
import { ViewportSurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/viewport/viewport.renderer.js';
import { ShadcnDivider } from '../divider/divider.adapter.js';

export const structureEntries = {
  Form: renderEntry('Form', formSchema, FormSurface),
  Section: renderEntry('Section', sectionSchema, SectionSurface),
  Page: renderEntry('Page', pageSchema, PageSurface),
  Toolbar: renderEntry('Toolbar', toolbarSchema, ToolbarSurface),
  Divider: renderEntry('Divider', dividerSchema, ShadcnDivider),
  Spacer: renderEntry('Spacer', spacerSchema, SpacerSurface),
  SplitView: renderEntry('SplitView', splitViewSchema, SplitViewSurface),
  Viewport: renderEntry('Viewport', viewportSchema, ViewportSurface),
};

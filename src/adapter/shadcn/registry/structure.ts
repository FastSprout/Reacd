import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { formSchema } from '../../../schema/form/form.schema.js';
import { sectionSchema } from '../../../schema/section/section.schema.js';
import { pageSchema } from '../../../schema/page/page.schema.js';
import { toolbarSchema } from '../../../schema/toolbar/toolbar.schema.js';
import { dividerSchema } from '../../../schema/divider/divider.schema.js';
import { spacerSchema } from '../../../schema/spacer/spacer.schema.js';
import { splitViewSchema } from '../../../schema/split-view/split-view.schema.js';
import { viewportSchema } from '../../../schema/viewport/viewport.schema.js';
import { FormSurface } from '../../../renderer/form/form.renderer.js';
import { SectionSurface } from '../../../renderer/section/section.renderer.js';
import { PageSurface } from '../../../renderer/page/page.renderer.js';
import { ToolbarSurface } from '../../../renderer/toolbar/toolbar.renderer.js';
import { SpacerSurface } from '../../../renderer/spacer/spacer.renderer.js';
import { SplitViewSurface } from '../../../renderer/split-view/split-view.renderer.js';
import { ViewportSurface } from '../../../renderer/viewport/viewport.renderer.js';
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

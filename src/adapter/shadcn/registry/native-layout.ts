import { renderEntry } from
'@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { vStackSchema } from
'@fastsprout/reacd/adapter-runtime/schema/v-stack/v-stack.schema.js';
import { ShadcnVStack } from '../v-stack/v-stack.adapter.js';
import { hStackSchema } from
'@fastsprout/reacd/adapter-runtime/schema/h-stack/h-stack.schema.js';
import { ShadcnHStack } from '../h-stack/h-stack.adapter.js';
import { gridSchema } from
'@fastsprout/reacd/adapter-runtime/schema/grid/grid.schema.js';
import { ShadcnGrid } from '../grid/grid.adapter.js';
import { textComponentSchema } from
'@fastsprout/reacd/adapter-runtime/schema/text/text.schema.js';
import { ShadcnText } from '../text/text.adapter.js';
import { appSchema } from
'@fastsprout/reacd/adapter-runtime/schema/app/app.schema.js';
import { ShadcnApp } from '../app/app.adapter.js';
import { containerSchema } from
'@fastsprout/reacd/adapter-runtime/schema/container/container.schema.js';
import { ShadcnContainer } from '../container/container.adapter.js';
import { pageSchema } from
'@fastsprout/reacd/adapter-runtime/schema/page/page.schema.js';
import { ShadcnPage } from '../page/page.adapter.js';
import { sectionSchema } from
'@fastsprout/reacd/adapter-runtime/schema/section/section.schema.js';
import { ShadcnSection } from '../section/section.adapter.js';
import { toolbarSchema } from
'@fastsprout/reacd/adapter-runtime/schema/toolbar/toolbar.schema.js';
import { ShadcnToolbar } from '../toolbar/toolbar.adapter.js';
import { themeSchema } from
'@fastsprout/reacd/adapter-runtime/schema/theme/theme.schema.js';
import { ShadcnTheme } from '../theme/theme.adapter.js';

export const nativeLayoutEntries = {
  VStack: renderEntry('VStack', vStackSchema, ShadcnVStack),
  HStack: renderEntry('HStack', hStackSchema, ShadcnHStack),
  Grid: renderEntry('Grid', gridSchema, ShadcnGrid),
  Text: renderEntry('Text', textComponentSchema, ShadcnText),
  App: renderEntry('App', appSchema, ShadcnApp),
  Container: renderEntry('Container', containerSchema, ShadcnContainer),
  Page: renderEntry('Page', pageSchema, ShadcnPage),
  Section: renderEntry('Section', sectionSchema, ShadcnSection),
  Toolbar: renderEntry('Toolbar', toolbarSchema, ShadcnToolbar),
  Theme: renderEntry('Theme', themeSchema, ShadcnTheme),
};

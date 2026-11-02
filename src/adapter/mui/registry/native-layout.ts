import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { vStackSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/v-stack/v-stack.schema.js';
import { MuiVStack } from '../v-stack/v-stack.adapter.js';
import { hStackSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/h-stack/h-stack.schema.js';
import { MuiHStack } from '../h-stack/h-stack.adapter.js';
import { gridSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/grid/grid.schema.js';
import { MuiGrid } from '../grid/grid.adapter.js';
import { textComponentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/text/text.schema.js';
import { MuiText } from '../text/text.adapter.js';
import { appSchema } from '@fastsprout/reacd/adapter-runtime/schema/app/app.schema.js';
import { MuiApp } from '../app/app.adapter.js';
import { containerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/container/container.schema.js';
import { MuiContainer } from '../container/container.adapter.js';
import { pageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page/page.schema.js';
import { MuiPage } from '../page/page.adapter.js';
import { sectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/section/section.schema.js';
import { MuiSection } from '../section/section.adapter.js';
import { toolbarSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/toolbar/toolbar.schema.js';
import { MuiToolbar } from '../toolbar/toolbar.adapter.js';
import { themeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/theme/theme.schema.js';
import { MuiTheme } from '../theme/theme.adapter.js';
import { iconSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/icon/icon.schema.js';
import { MuiIcon } from '../icon/icon.adapter.js';

export const nativeLayoutEntries = {
  VStack: renderEntry('VStack', vStackSchema, MuiVStack),
  HStack: renderEntry('HStack', hStackSchema, MuiHStack),
  Grid: renderEntry('Grid', gridSchema, MuiGrid),
  Text: renderEntry('Text', textComponentSchema, MuiText),
  App: renderEntry('App', appSchema, MuiApp),
  Container: renderEntry('Container', containerSchema, MuiContainer),
  Page: renderEntry('Page', pageSchema, MuiPage),
  Section: renderEntry('Section', sectionSchema, MuiSection),
  Toolbar: renderEntry('Toolbar', toolbarSchema, MuiToolbar),
  Theme: renderEntry('Theme', themeSchema, MuiTheme),
  Icon: renderEntry('Icon', iconSchema, MuiIcon),
};

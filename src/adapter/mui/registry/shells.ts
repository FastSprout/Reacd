import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { containerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/container/container.schema.js';
import { mainSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/main/main.schema.js';
import { headerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/header/header.schema.js';
import { footerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/footer/footer.schema.js';
import { separatorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/separator/separator.schema.js';
import { MuiContainer } from '../container/container.adapter.js';
import { MuiMain } from '../main/main.adapter.js';
import { MuiHeader } from '../header/header.adapter.js';
import { MuiFooter } from '../footer/footer.adapter.js';
import { MuiSeparator } from '../separator/separator.adapter.js';
import { appSchema } from '@fastsprout/reacd/adapter-runtime/schema/app/app.schema.js';
import { errorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/error/error.schema.js';
import { themeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/theme/theme.schema.js';
import { MuiApp } from '../app/app.adapter.js';
import { MuiError } from '../error/error.adapter.js';
import { MuiTheme } from '../theme/theme.adapter.js';
export const shellEntries = {
  App: renderEntry('App', appSchema, MuiApp),
  Error: renderEntry('Error', errorSchema, MuiError),
  Theme: renderEntry('Theme', themeSchema, MuiTheme),
  Container: renderEntry('Container', containerSchema, MuiContainer),
  Main: renderEntry('Main', mainSchema, MuiMain),
  Header: renderEntry('Header', headerSchema, MuiHeader),
  Footer: renderEntry('Footer', footerSchema, MuiFooter),
  Separator: renderEntry('Separator', separatorSchema, MuiSeparator),
};

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
import { ShadcnContainer } from '../container/container.adapter.js';
import { ShadcnMain } from '../main/main.adapter.js';
import { ShadcnHeader } from '../header/header.adapter.js';
import { ShadcnFooter } from '../footer/footer.adapter.js';
import { ShadcnSeparator } from '../separator/separator.adapter.js';
import { appSchema } from '@fastsprout/reacd/adapter-runtime/schema/app/app.schema.js';
import { errorSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/error/error.schema.js';
import { themeSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/theme/theme.schema.js';
import { ShadcnApp } from '../app/app.adapter.js';
import { ShadcnError } from '../error/error.adapter.js';
import { ShadcnTheme } from '../theme/theme.adapter.js';
export const shellEntries = {
  App: renderEntry('App', appSchema, ShadcnApp),
  Error: renderEntry('Error', errorSchema, ShadcnError),
  Theme: renderEntry('Theme', themeSchema, ShadcnTheme),
  Container: renderEntry('Container', containerSchema, ShadcnContainer),
  Main: renderEntry('Main', mainSchema, ShadcnMain),
  Header: renderEntry('Header', headerSchema, ShadcnHeader),
  Footer: renderEntry('Footer', footerSchema, ShadcnFooter),
  Separator: renderEntry('Separator', separatorSchema, ShadcnSeparator),
};

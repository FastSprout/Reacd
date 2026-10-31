import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { footerColumnsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/footer-columns/footer-columns.schema.js';
import { navigationMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/navigation-menu/navigation-menu.schema.js';
import { stepperSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/stepper/stepper.schema.js';
import { MuiFooterColumns } from '../footer-columns/footer-columns.adapter.js';
import { MuiNavigationMenu } from '../navigation-menu/navigation-menu.adapter.js';
import { MuiStepper } from '../stepper/stepper.adapter.js';

export const navigationCompositionEntries = {
  FooterColumns: renderEntry('FooterColumns', footerColumnsSchema, MuiFooterColumns),
  NavigationMenu: renderEntry(
    'NavigationMenu',
    navigationMenuSchema,
    MuiNavigationMenu,
  ),
  Stepper: renderEntry('Stepper', stepperSchema, MuiStepper),
};

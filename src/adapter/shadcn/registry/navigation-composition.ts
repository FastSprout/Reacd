import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import {
  footerColumnsSchema,
} from '../../../schema/footer-columns/footer-columns.schema.js';
import {
  navigationMenuSchema,
} from '../../../schema/navigation-menu/navigation-menu.schema.js';
import { stepperSchema } from '../../../schema/stepper/stepper.schema.js';
import { ShadcnFooterColumns } from '../footer-columns/footer-columns.adapter.js';
import { ShadcnNavigationMenu } from '../navigation-menu/navigation-menu.adapter.js';
import { ShadcnStepper } from '../stepper/stepper.adapter.js';

export const navigationCompositionEntries = {
  FooterColumns: renderEntry('FooterColumns', footerColumnsSchema, ShadcnFooterColumns),
  NavigationMenu: renderEntry(
    'NavigationMenu',
    navigationMenuSchema,
    ShadcnNavigationMenu,
  ),
  Stepper: renderEntry('Stepper', stepperSchema, ShadcnStepper),
};

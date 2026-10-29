import { ACTION_MENU_POLICY } from '../../core/action-menu-policy.js';
export function actionMenuVariables() {
  return {
    '--reacd-action-width': `${ACTION_MENU_POLICY.widthRem}rem`,
    '--reacd-action-block': `${ACTION_MENU_POLICY.maximumBlockViewportPercent}dvh`,
    '--reacd-action-indicator': `${ACTION_MENU_POLICY.indicatorWidthEm}em`,
  };
}

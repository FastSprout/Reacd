import { ICON_POLICY } from '../../core/icon-policy.js';
import { ELEMENT_POLICY } from '../../core/element-policy.js';

export function elementVariables() {
  return {
    '--reacd-icon-small': `${ICON_POLICY.dimensionsRem.small}rem`,
    '--reacd-icon-medium': `${ICON_POLICY.dimensionsRem.medium}rem`,
    '--reacd-icon-large': `${ICON_POLICY.dimensionsRem.large}rem`,
    '--reacd-badge-small': `${ELEMENT_POLICY.badgeScales.small}em`,
    '--reacd-badge-medium': `${ELEMENT_POLICY.badgeScales.medium}em`,
    '--reacd-badge-large': `${ELEMENT_POLICY.badgeScales.large}em`,
  };
}

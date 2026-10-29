import { SIDEBAR_POLICY } from '../../core/sidebar-policy.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';

export function sidebarSplitterVariables() {
  return {
    '--reacd-sidebar-inline': `${SIDEBAR_POLICY.inlineRem}rem`,
    '--reacd-sidebar-icon-inline': `${SIDEBAR_POLICY.iconInlineRem}rem`,
    '--reacd-sidebar-layer': SIDEBAR_POLICY.layer,
    '--reacd-splitter-track': `${SPLITTER_POLICY.panelTrackRem}rem`,
    '--reacd-splitter-extent': `${SPLITTER_POLICY.verticalExtentRem}rem`,
  };
}

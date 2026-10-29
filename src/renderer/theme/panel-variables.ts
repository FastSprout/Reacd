import { PANEL_POLICY } from '../../core/panel-policy.js';
export function panelVariables() {
  return {
    '--reacd-panel-width': `${PANEL_POLICY.widthRem}rem`,
    '--reacd-panel-max-block': `${PANEL_POLICY.maximumBlockViewportPercent}dvh`,
    '--reacd-panel-handle-width': `${PANEL_POLICY.handleWidthRem}rem`,
    '--reacd-panel-handle-block': `${PANEL_POLICY.handleBlockPx}px`,
  };
}

import { TOAST_POLICY } from '../../core/toast-policy.js';
export function toastVariables() {
  return {
    '--reacd-toast-width': `${TOAST_POLICY.widthRem}rem`,
    '--reacd-toast-layer': TOAST_POLICY.layer,
    '--reacd-toast-grip-width': `${TOAST_POLICY.gripWidthRem}rem`,
    '--reacd-toast-grip-block': `${TOAST_POLICY.gripBlockPx}px`,
    '--reacd-toast-block': `${TOAST_POLICY.maximumBlockViewportPercent}dvh`,
  };
}

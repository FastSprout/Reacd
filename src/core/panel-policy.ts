export const PANEL_PLACEMENTS = ['top', 'bottom', 'start', 'end'] as const;
export const PANEL_DEFAULTS = {
  drawer: 'bottom',
  slideover: 'end',
  handle: true,
} as const;
export const PANEL_POLICY = {
  widthRem: 32,
  maximumBlockViewportPercent: 85,
  handleWidthRem: 3,
  handleBlockPx: 4,
} as const;
export const PANEL_SWIPE = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right',
} as const;

export function resolvePanelEdge(
  placement: (typeof PANEL_PLACEMENTS)[number],
  direction: 'ltr' | 'rtl',
): 'top' | 'bottom' | 'left' | 'right' {
  if (placement === 'start') return direction === 'rtl' ? 'right' : 'left';
  if (placement === 'end') return direction === 'rtl' ? 'left' : 'right';
  return placement;
}

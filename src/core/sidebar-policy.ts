export const SIDEBAR_SIDES = ['start', 'end'] as const;
export const SIDEBAR_VARIANTS = ['sidebar', 'floating', 'inset'] as const;
export const SIDEBAR_COLLAPSIBLE = ['offcanvas', 'icon', 'none'] as const;

export const SIDEBAR_DEFAULTS = {
  side: 'start',
  variant: 'sidebar',
  collapsible: 'offcanvas',
  toggleLabel: 'Toggle navigation',
  closeLabel: 'Close navigation',
  description: 'Application navigation',
} as const;

export const SIDEBAR_POLICY = {
  narrowWidthPx: 768,
  inlineRem: 18,
  iconInlineRem: 5,
  layer: 60,
  backdropPercent: 40,
} as const;

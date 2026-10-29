export const SHELL_DEFAULTS = {
  menuMode: 'modal',
  toggleLabel: 'Open navigation',
  closeLabel: 'Close navigation',
  menuDescription: 'Application navigation',
} as const;

export const SHELL_POLICY = {
  menuWidthRem: 24,
  menuBlockPercent: 85,
  menuLayer: 60,
  slotTrackRem: 12,
} as const;

export const HEADER_MENU_MODES = ['modal', 'slideover', 'drawer'] as const;
export const SEPARATOR_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const SEPARATOR_POSITIONS = ['start', 'center', 'end'] as const;
export const SEPARATOR_LINE_STYLES = ['solid', 'dashed', 'dotted'] as const;
export const SEPARATOR_INTENTS = ['neutral', 'primary', 'danger'] as const;
export const SEPARATOR_SIZES = ['small', 'medium', 'large'] as const;

export const SEPARATOR_DEFAULTS = {
  orientation: 'horizontal',
  position: 'center',
  lineStyle: 'solid',
  intent: 'neutral',
  size: 'small',
  decorative: false,
} as const;

export const SEPARATOR_POLICY = {
  verticalExtentRem: 3,
  smallWidthPx: 1,
  mediumWidthPx: 2,
  largeWidthPx: 3,
} as const;

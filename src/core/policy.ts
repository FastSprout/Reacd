export const SOURCE_POLICY = {
  maxLines: 300,
  maxColumns: 88,
  indentation: 2,
} as const;

export const DOCUMENT_POLICY = {
  version: '0.1',
  schemaId: 'https://reacd.dev/schema/0.1.json',
  maxDepth: 48,
  maxValues: 10_000,
  maxCharacters: 1_000_000,
  maxChildren: 100,
} as const;

export const CONTENT_POLICY = {
  maxLabelLength: 1_000,
  maxTextLength: 10_000,
  maxCodeLength: 50_000,
  maxOptions: 100,
  maxTableColumns: 12,
  maxTableRows: 200,
  maxVisibleLines: 6,
  minTextAreaRows: 2,
  maxTextAreaRows: 30,
  defaultTextAreaRows: 4,
  codeEditorRows: 24,
  maxIdentifierLength: 80,
  maxLinkLength: 2_000,
} as const;

export const LAYOUT_POLICY = {
  minGridColumns: 1,
  maxGridColumns: 6,
  controlTargetPx: 44,
  gridTrackRem: 13,
  stackTrackRem: 12,
  tableColumnRem: 8,
  compactViewportPx: 360,
  maxPaddingPercent: 6,
  focusOutlinePx: 3,
  borderWidthPx: 1,
  pageWidthRem: 90,
  splitTrackRem: 24,
} as const;

export const DESIGN_POLICY = {
  minTextContrast: 4.5,
  minControlContrast: 3,
  maxSpaceRem: 4,
  minFontSizeRem: 0.875,
  maxFontSizeRem: 1.25,
  defaultTemplate: 'saas-modern-light',
} as const;

export const SPACING = ['small', 'medium', 'large'] as const;
export const TEXT_ROLES = [
  'headline',
  'subheadline',
  'body',
  'caption',
  'display',
] as const;
export const TEXT_WEIGHTS = ['normal', 'medium', 'bold'] as const;
export const BUTTON_INTENTS = ['primary', 'secondary', 'danger'] as const;
export const ALERT_INTENTS = ['info', 'success', 'warning', 'error'] as const;
export const INPUT_TYPES = ['text', 'email', 'password', 'search'] as const;
export const DATA_STATES = ['ready', 'loading', 'error'] as const;

export const DEFAULTS = {
  spacing: 'medium',
  textRole: 'body',
  buttonIntent: 'primary',
  badgeIntent: 'secondary',
  inputType: 'text',
  progressMax: 100,
} as const;

export type Spacing = (typeof SPACING)[number];
export type TextRole = (typeof TEXT_ROLES)[number];
export type TextWeight = (typeof TEXT_WEIGHTS)[number];
export type ButtonIntent = (typeof BUTTON_INTENTS)[number];
export type AlertIntent = (typeof ALERT_INTENTS)[number];
export type InputType = (typeof INPUT_TYPES)[number];
export type DataState = (typeof DATA_STATES)[number];

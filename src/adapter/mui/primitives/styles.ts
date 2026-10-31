export const MUI_BUTTON_STYLE = {
  '&.Mui-disabled': { pointerEvents: 'auto', cursor: 'not-allowed' },
} as const;

export const MUI_ICON_BUTTON_STYLE = {
  minInlineSize: 'var(--reacd-control-target)',
  inlineSize: 'var(--reacd-control-target)',
  padding: 0,
} as const;

export const MUI_CHECKBOX_STYLE = {
  border: 'var(--reacd-border-width) solid var(--reacd-border)',
  borderRadius: 'var(--reacd-radius)',
  color: 'var(--reacd-text)',
  backgroundColor: 'var(--reacd-surface)',
  '&[data-state=checked], &[data-state=indeterminate]': {
    color: 'var(--reacd-onPrimary)',
    backgroundColor: 'var(--reacd-primary)',
  },
} as const;

export const MUI_SWITCH_STYLE = {
  borderRadius: 'var(--reacd-control-target)',
  '& > span': { borderRadius: 'var(--reacd-control-target)' },
} as const;

export const MUI_SELECT_TRIGGER_STYLE = {
  justifyContent: 'space-between',
  gap: 'var(--reacd-small)',
  padding: 'var(--reacd-small)',
  border: 'var(--reacd-border-width) solid var(--reacd-border)',
  borderRadius: 'var(--reacd-radius)',
  backgroundColor: 'var(--reacd-surface)',
  color: 'var(--reacd-text)',
} as const;

export const MUI_SELECT_ITEM_STYLE = {
  gap: 'var(--reacd-small)',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  color: 'var(--reacd-text)',
  '&[data-state=checked]': { backgroundColor: 'var(--reacd-canvas)' },
} as const;

export const MUI_TABS_TRIGGER_STYLE = {
  padding: 'var(--reacd-small)',
  color: 'var(--reacd-text)',
  '&[data-state=active]': {
    color: 'var(--reacd-primary)',
    borderBlockEnd: 'var(--reacd-focus-width) solid var(--reacd-primary)',
  },
} as const;

export const MUI_SCROLL_BUTTON_STYLE = {
  display: 'flex',
  justifyContent: 'center',
} as const;

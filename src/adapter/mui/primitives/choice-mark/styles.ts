const choice = {
  color: 'primary.main',
  borderColor: 'primary.main',
  backgroundColor: 'background.paper',
  '&[data-checked]': {
    color: 'primary.contrastText',
    backgroundColor: 'primary.main',
  },
} as const;

export const MUI_CHOICE_STYLES = {
  radio: choice,
  checkbox: choice,
  rating: { color: 'primary.main' },
} as const;

export const MUI_PRIMITIVE_DEFAULTS = {
  buttonVariant: 'default',
  badgeVariant: 'default',
  buttonSize: 'default',
  flatElevation: 0,
} as const;

export const MUI_BUTTON_VARIANTS = {
  default: { variant: 'contained', color: 'primary' },
  destructive: { variant: 'contained', color: 'error' },
  outline: { variant: 'outlined', color: 'primary' },
  secondary: { variant: 'contained', color: 'secondary' },
  ghost: { variant: 'text', color: 'inherit' },
  link: { variant: 'text', color: 'primary' },
} as const;

export const MUI_BUTTON_SIZES = {
  default: undefined,
  sm: 'small',
  lg: 'large',
  icon: undefined,
} as const;

export const MUI_BADGE_APPEARANCE = {
  default: { variant: 'filled', color: 'primary' },
  destructive: { variant: 'filled', color: 'error' },
  outline: { variant: 'outlined', color: 'default' },
  secondary: { variant: 'filled', color: 'secondary' },
} as const;

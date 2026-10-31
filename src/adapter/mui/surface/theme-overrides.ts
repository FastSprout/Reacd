import type { Components, Theme } from '@mui/material/styles';

export const materialOverrides: Components<Theme> = {
  MuiButtonBase: { defaultProps: { disableRipple: true } },
  MuiButton: {
    styleOverrides: {
      root: {
        minWidth: 0,
        maxWidth: '100%',
        minHeight: 'var(--reacd-control-target)',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
        textTransform: 'none',
        borderRadius: 'var(--reacd-radius)',
        gap: 'var(--reacd-small)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        color: 'var(--reacd-text)',
        backgroundColor: 'var(--reacd-surface)',
        borderColor: 'var(--reacd-border)',
        borderRadius: 'var(--reacd-radius)',
        backgroundImage: 'none',
      },
    },
  },
  MuiCard: { styleOverrides: { root: { boxShadow: 'var(--reacd-shadow)' } } },
  MuiChip: {
    styleOverrides: {
      root: { height: 'auto', maxWidth: '100%', borderRadius: 'var(--reacd-radius)' },
      label: { whiteSpace: 'normal', overflowWrap: 'anywhere' },
    },
  },
  MuiFormLabel: { styleOverrides: { root: { color: 'var(--reacd-text)' } } },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        color: 'var(--reacd-text)',
        backgroundColor: 'var(--reacd-surface)',
        borderRadius: 'var(--reacd-radius)',
      },
      notchedOutline: { borderColor: 'var(--reacd-border)' },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: { color: 'var(--reacd-text)', backgroundColor: 'var(--reacd-surface)' },
      message: { minWidth: 0, width: '100%', overflowWrap: 'anywhere' },
    },
  },
};

import type { CSSProperties } from 'react';
import type { PageCardProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-card/page-card.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { useShadcnTheme } from '../surface/theme-context.js';

const surfaces = {
  solid: 'border-transparent bg-card text-card-foreground',
  outline: 'bg-card text-card-foreground',
  soft: 'border-transparent bg-muted shadow-none',
  subtle: 'bg-muted shadow-none',
  ghost: 'border-transparent bg-transparent shadow-none',
  naked: 'rounded-none border-0 bg-transparent shadow-none',
} as const;
const colors = {
  neutral: ['--foreground', '--background'],
  primary: ['--primary', '--primary-foreground'],
  danger: ['--destructive', '--destructive-foreground'],
} as const;
const borders = {
  neutral: 'border-foreground',
  primary: 'border-primary',
  danger: 'border-destructive',
} as const;
function color(theme: CSSProperties | undefined, key: string, fallback: string) {
  const descriptor =
    theme === undefined ? undefined : Object.getOwnPropertyDescriptor(theme, key);
  const value: unknown = descriptor?.value;
  return typeof value === 'string' ? value : fallback;
}
export function usePageSurface(
  variant: NonNullable<PageCardProps['variant']>,
  intent: NonNullable<PageCardProps['intent']>,
  highlight = false,
  spotlight = false,
) {
  const theme = useShadcnTheme();
  const [background, foreground] = colors[intent];
  const variables =
    variant === 'solid'
      ? {
          ...theme,
          '--background': color(theme, background, 'var(--primary)'),
          '--card': color(theme, background, 'var(--primary)'),
          '--card-foreground': color(theme, foreground, 'var(--primary-foreground)'),
          '--foreground': color(theme, foreground, 'var(--primary-foreground)'),
          '--muted': color(theme, background, 'var(--primary)'),
          '--muted-foreground': color(theme, foreground, 'var(--primary-foreground)'),
        }
      : theme;
  return {
    variables,
    className: [
      surfaces[variant],
      highlight ? borders[intent] : '',
      spotlight ? 'hover:outline focus-within:outline outline-ring' : '',
    ].join(' '),
    style: {
      ...variables,
      overflowWrap: 'anywhere' as const,
      borderWidth: highlight
        ? PAGE_PRESENTATION_POLICY.emphasisBorderMultiplier *
          LAYOUT_POLICY.borderWidthPx
        : undefined,
      outlineWidth: spotlight ? LAYOUT_POLICY.focusOutlinePx : undefined,
    },
  };
}

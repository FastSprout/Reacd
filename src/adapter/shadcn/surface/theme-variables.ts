import type { CSSProperties } from 'react';
import type { DesignTemplate } from
  '@fastsprout/reacd/adapter-runtime/schema/design/templates.schema.js';
import { SHADCN_THEME_POLICY } from './theme-policy.js';

export function shadcnThemeVariables(
  template: DesignTemplate,
): CSSProperties & Record<`--${string}`, string> {
  return {
    '--background': template.colors.canvas,
    '--foreground': template.colors.text,
    '--card': template.colors.surface,
    '--card-foreground': template.colors.text,
    '--primary': template.colors.primary,
    '--primary-foreground': template.colors.onPrimary,
    '--secondary': template.colors.canvas,
    '--secondary-foreground': template.colors.text,
    '--muted': template.colors.canvas,
    '--muted-foreground': template.colors.muted,
    '--accent': template.colors.canvas,
    '--accent-foreground': template.colors.text,
    '--destructive': template.colors.danger,
    '--destructive-foreground': template.colors.onDanger,
    '--popover': template.colors.surface,
    '--popover-foreground': template.colors.text,
    '--input': template.colors.border,
    '--border': template.colors.border,
    '--ring': template.colors.focus,
    '--radius': `${template.radius}rem`,
    '--sdk-shadow': SHADCN_THEME_POLICY.shadow[template.shadow],
    '--space-small': `${template.spacing.small}rem`,
    '--space-medium': `${template.spacing.medium}rem`,
    '--space-large': `${template.spacing.large}rem`,
    '--font-sans': SHADCN_THEME_POLICY.fonts[template.font],
    '--text-base': `${template.fontSize}rem`,
  };
}

import type { KbdProps } from
  '@fastsprout/reacd/adapter-runtime/components/kbd/kbd.props.js';
import {
  KBD_DEFAULTS,
  KBD_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/kbd-policy.js';
import { keyboardKey } from '@fastsprout/reacd/adapter-runtime/core/keyboard-key.js';
import { Kbd } from '../vendor/ui/kbd.js';

export type ShadcnKbdProps = KbdProps;
const variantClasses = {
  secondary: {
    outline: 'border-border text-foreground',
    soft: 'bg-secondary text-secondary-foreground',
    subtle: 'bg-transparent text-muted-foreground',
    solid: 'bg-secondary text-secondary-foreground',
  },
  primary: {
    outline: 'border-primary text-foreground',
    soft: 'bg-primary/10 text-foreground',
    subtle: 'bg-transparent text-foreground',
    solid: 'bg-primary text-primary-foreground',
  },
  danger: {
    outline: 'border-destructive text-foreground',
    soft: 'bg-destructive/10 text-foreground',
    subtle: 'bg-transparent text-foreground',
    solid: 'bg-destructive text-destructive-foreground',
  },
} as const;

export function ShadcnKbd({
  value,
  label,
  platform = KBD_DEFAULTS.platform,
  size = KBD_DEFAULTS.size,
  variant = KBD_DEFAULTS.variant,
  intent = KBD_DEFAULTS.intent,
}: KbdProps) {
  const key = keyboardKey(value, platform);
  return (
    <Kbd
      role="img"
      aria-label={label ?? key.label}
      className={
        `h-auto min-w-0 max-w-full whitespace-normal ` +
        `[overflow-wrap:anywhere] ` +
        `${variant === 'outline' ? 'border bg-background' : ''} ` +
        variantClasses[intent][variant]
      }
      style={{ fontSize: `${KBD_POLICY.textScale[size]}em` }}
    >
      {key.display}
    </Kbd>
  );
}

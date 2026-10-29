import type { KbdProps } from '../../../components/kbd/kbd.js';
import type { KeyPresentation } from '../../../core/keyboard-key.js';
import { KBD_DEFAULTS } from '../../../core/kbd-policy.js';
type KbdKeyProps = KeyPresentation & Pick<KbdProps, 'size' | 'variant' | 'intent'>;
export function KbdKey({
  display,
  label,
  size = KBD_DEFAULTS.size,
  variant = KBD_DEFAULTS.variant,
  intent = KBD_DEFAULTS.intent,
}: KbdKeyProps) {
  return (
    <kbd
      className="reacd-node reacd-kbd"
      data-slot="kbd"
      data-size={size}
      data-variant={variant}
      data-intent={intent}
      title={label}
    >
      <span role="img" aria-label={label}>
        {display}
      </span>
    </kbd>
  );
}

import type { KbdProps } from '../../../components/kbd/kbd.js';
import { keyboardKey } from '../../../core/keyboard-key.js';
import { KBD_DEFAULTS } from '../../../core/kbd-policy.js';
import { KbdKey } from './kbd-key.adapter.js';
export function ShadcnKbd({
  value,
  label,
  platform = KBD_DEFAULTS.platform,
  ...properties
}: KbdProps) {
  const presentation = keyboardKey(value, platform);
  return (
    <KbdKey
      {...properties}
      display={presentation.display}
      label={label ?? presentation.label}
    />
  );
}

import type { KbdProps } from '@fastsprout/reacd/adapter-runtime/components/kbd/kbd.js';
import { keyboardKey } from '@fastsprout/reacd/adapter-runtime/core/keyboard-key.js';
import { KBD_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/kbd-policy.js';
import { KbdKey } from './kbd-key.adapter.js';
export function SharedKbd({
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

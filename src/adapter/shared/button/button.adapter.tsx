import type { ButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/button/button.js';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Button } from '../primitives/button.js';
import { SharedIcon } from '../icon/icon.adapter.js';
import { ELEMENT_BUTTON_VARIANTS } from '../element/variants.js';

export function SharedButton({
  label,
  onPress,
  intent,
  disabled,
  leadingIcon,
  trailingIcon,
  loading,
  loadingLabel,
}: ButtonProps) {
  return (
    <Button
      className="reacd-node reacd-button"
      variant={ELEMENT_BUTTON_VARIANTS[intent ?? DEFAULTS.buttonIntent]}
      type="button"
      data-intent={intent ?? DEFAULTS.buttonIntent}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={() => onPress()}
    >
      {loading ? (
        <SharedIcon name="loading" decorative />
      ) : leadingIcon === undefined ? null : (
        <SharedIcon name={leadingIcon} decorative />
      )}
      <span className="reacd-button-label">
        {loading ? (loadingLabel ?? label) : label}
      </span>
      {trailingIcon === undefined ? null : (
        <SharedIcon name={trailingIcon} decorative />
      )}
    </Button>
  );
}

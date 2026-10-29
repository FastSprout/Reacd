import { useId } from 'react';
import type {
  ColorModeButtonProps,
} from '../../../components/color-mode-button/index.js';
import { oppositeColorMode } from '../../../core/color-mode.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnColorModeButton({
  label,
  value: _value,
  resolvedMode,
  onValueChange,
  disabled,
  readOnly,
  description,
}: ColorModeButtonProps) {
  const id = useId();
  return (
    <div className="reacd-node reacd-field">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-pressed={resolvedMode === 'dark'}
        aria-disabled={readOnly || undefined}
        aria-describedby={description === undefined ? undefined : id}
        className="reacd-color-mode-button"
        onClick={() => {
          if (!readOnly) onValueChange(oppositeColorMode(resolvedMode));
        }}
      >
        {label}
      </Button>
      {description === undefined ? null : <p id={id}>{description}</p>}
    </div>
  );
}

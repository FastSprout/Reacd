import { useId } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import type { ColorModeButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-button/index.js';
import { oppositeColorMode } from
  '@fastsprout/reacd/adapter-runtime/core/color-mode.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { LAYOUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/policy.js';

export type ShadcnColorModeButtonProps = ColorModeButtonProps;
export function ShadcnColorModeButton({
  label,
  description,
  disabled,
  readOnly,
  resolvedMode,
  onValueChange,
}: ColorModeButtonProps) {
  const id = useId();
  const metadata = useNativeField({ disabled }, description ? [id] : []);
  const Icon = resolvedMode === 'dark' ? MoonIcon : SunIcon;
  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className={WRAPPING_BUTTON_CLASSES}
        style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
        aria-label={label}
        aria-pressed={resolvedMode === 'dark'}
        aria-describedby={metadata.descriptionIds.join(' ') || undefined}
        disabled={metadata.blocked || readOnly}
        onClick={() => onValueChange(oppositeColorMode(resolvedMode))}
      >
        <Icon aria-hidden="true" />
        {label}
      </Button>
      {description && <p id={id}>{description}</p>}
    </div>
  );
}

import type { SubmitButtonProps } from '../../../components/submit-button/index.js';
import { DEFAULTS } from '../../../core/policy.js';
import { Button } from '../vendor/ui/button.js';

const VARIANTS = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;

export function ShadcnSubmitButton({ label, intent, disabled }: SubmitButtonProps) {
  return (
    <Button
      className="reacd-node reacd-button"
      type="submit"
      data-intent={intent ?? DEFAULTS.buttonIntent}
      disabled={disabled}
      variant={VARIANTS[intent ?? DEFAULTS.buttonIntent]}
    >
      {label}
    </Button>
  );
}

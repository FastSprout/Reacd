import type { SubmitButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/submit-button/submit-button.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Button } from '../vendor/ui/button.js';

export type ShadcnSubmitButtonProps = SubmitButtonProps;
const variants = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;
export function ShadcnSubmitButton({
  label,
  intent = 'primary',
  disabled,
}: SubmitButtonProps) {
  const metadata = useNativeField({ disabled });
  return (
    <Button
      type="submit"
      variant={variants[intent]}
      disabled={metadata.blocked}
      className={
        'h-auto min-h-9 min-w-0 max-w-full whitespace-normal ' +
        '[overflow-wrap:anywhere]'
      }
    >
      {label}
    </Button>
  );
}

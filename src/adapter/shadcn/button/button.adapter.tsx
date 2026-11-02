import type { ButtonProps } from
  '@fastsprout/reacd/adapter-runtime/components/button/button.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Button } from '../vendor/ui/button.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';

import { useNativeField } from '../form-field/use-native-field.js';

export type ShadcnButtonProps = ButtonProps;
const variants = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;
export function ShadcnButton({
  label,
  onPress,
  intent = 'primary',
  disabled,
  pressed,
  loading,
  loadingLabel,
  leadingIcon,
  trailingIcon,
  iconOnly,
}: ButtonProps) {
  const metadata = useNativeField({ disabled });
  return (
    <Button
      type="button"
      variant={variants[intent]}
      size={iconOnly ? 'icon' : 'default'}
      disabled={metadata.blocked || loading}
      aria-busy={loading}
      aria-pressed={pressed}
      onClick={() => onPress()}
      className="min-w-0 max-w-full whitespace-normal break-words"
      style={{
        height: 'auto',
        minBlockSize: LAYOUT_POLICY.controlTargetPx,
        minInlineSize: iconOnly ? LAYOUT_POLICY.controlTargetPx : undefined,
        overflowWrap: 'anywhere',
      }}
    >
      {leadingIcon && <ShadcnIcon name={leadingIcon} decorative />}
      <span className={iconOnly ? 'sr-only' : undefined}>
        {loading && loadingLabel ? loadingLabel : label}
      </span>
      {trailingIcon && <ShadcnIcon name={trailingIcon} decorative />}
    </Button>
  );
}

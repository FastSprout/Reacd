import type { PopoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/popover/popover.props.js';
import { POPOVER_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/popover-policy.js';
import { ShadcnClickPopover } from './click-popover.js';
import { ShadcnHoverPopover } from './hover-popover.js';

export function ShadcnPopover(props: PopoverProps) {
  return (props.mode ?? POPOVER_DEFAULTS.mode) === 'hover' ? (
    <ShadcnHoverPopover {...props} />
  ) : (
    <ShadcnClickPopover {...props} />
  );
}

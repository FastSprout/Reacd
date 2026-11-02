import { resolvePanelEdge } from
  '@fastsprout/reacd/adapter-runtime/core/panel-policy.js';
import type { PopoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/popover/popover.props.js';

const edges = {
  top: 'top',
  bottom: 'bottom',
  'inline-start': 'start',
  'inline-end': 'end',
} as const;
export function popoverSide(
  placement: NonNullable<PopoverProps['placement']>,
  direction: 'ltr' | 'rtl',
) {
  return resolvePanelEdge(edges[placement], direction);
}

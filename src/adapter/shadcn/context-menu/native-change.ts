import type { ContextMenu } from '@base-ui/react/context-menu';

type Details = Pick<ContextMenu.Root.ChangeEventDetails, 'reason' | 'cancel'>;

export function requestContextChange(
  open: boolean,
  details: Details,
  change: (open: boolean) => void,
) {
  if (details.reason === 'escape-key' || details.reason === 'outside-press') {
    details.cancel();
  } else change(open);
}

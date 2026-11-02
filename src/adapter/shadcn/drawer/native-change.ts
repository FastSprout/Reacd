import type { Drawer } from '@base-ui/react/drawer';

type ChangeDetails = Pick<Drawer.Root.ChangeEventDetails, 'reason' | 'cancel'>;

export function requestDrawerChange(
  open: boolean,
  details: ChangeDetails,
  dismissible: boolean,
  change: (open: boolean) => void,
): void {
  if (
    details.reason === 'escape-key' ||
    (!open && !dismissible && details.reason === 'swipe')
  )
    details.cancel();
  else change(open);
}

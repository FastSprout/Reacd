import type { MouseEvent } from 'react';
import type { BaseUIEvent } from '@base-ui/react/types';
import { selectMenuItem } from '../dropdown-menu/selection.js';

type SelectionEvent = Pick<
  BaseUIEvent<MouseEvent>,
  'preventDefault' | 'preventBaseUIHandler'
>;

export function selectContextItem(
  event: SelectionEvent,
  action: () => unknown,
  report: (message: string) => void,
) {
  selectMenuItem(
    {
      preventDefault: () => {
        event.preventDefault();
        event.preventBaseUIHandler();
      },
    },
    action,
    true,
    report,
  );
}

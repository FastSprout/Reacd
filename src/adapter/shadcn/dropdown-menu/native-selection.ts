import type { MouseEvent } from 'react';
import type { BaseUIEvent } from '@base-ui/react/types';
import { selectMenuItem } from './selection.js';

export function selectNativeMenuItem(
  event: Pick<BaseUIEvent<MouseEvent>, 'preventDefault' | 'preventBaseUIHandler'>,
  action: () => unknown,
  close: boolean,
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
    close,
    report,
  );
}

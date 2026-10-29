import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { SIDEBAR_POLICY } from '../../core/sidebar-policy.js';

export function useNarrowContainer(reference: RefObject<HTMLElement | null>): boolean {
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const element = reference.current;
    if (!element) return;
    const update = (width: number) => setNarrow(width < SIDEBAR_POLICY.narrowWidthPx);
    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver((entries) => {
      const first = entries[0];
      if (first) update(first.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reference]);
  return narrow;
}

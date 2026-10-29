import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';
import { LAYOUT_POLICY } from '../../core/policy.js';

export function useSplitterReflow(
  reference: RefObject<HTMLElement | null>,
  track: RefObject<HTMLElement | null>,
  panelCount: number,
): boolean {
  const [reflow, setReflow] = useState(false);
  useLayoutEffect(() => {
    const element = reference.current;
    const measure = track.current;
    if (!element || !measure) return;
    const update = () => {
      const panels = panelCount * measure.getBoundingClientRect().width;
      const handles = (panelCount - 1) * LAYOUT_POLICY.controlTargetPx;
      const minimum = Math.max(SPLITTER_POLICY.narrowWidthPx, panels + handles);
      setReflow(element.getBoundingClientRect().width < minimum);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [reference, track, panelCount]);
  return reflow;
}

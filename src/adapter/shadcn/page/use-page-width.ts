import { useEffect, useState } from 'react';
import { DOCUMENTATION_LAYOUT_POLICY as POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/documentation-layout-policy.js';

export function usePageWidth() {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [widthRem, setWidthRem] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (element === null) return;
    const measure = () => {
      const font =
        Number.parseFloat(getComputedStyle(element).fontSize) || POLICY.fontUnitPx;
      setWidthRem(element.getBoundingClientRect().width / font);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return {
    setElement,
    widthRem: widthRem ?? 0,
    measured: widthRem !== undefined,
  };
}

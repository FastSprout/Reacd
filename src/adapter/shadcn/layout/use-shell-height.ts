import { useContext, useEffect, useState } from 'react';
import { ShellLayoutContext } from './shell-layout-context.js';

export function useShellHeight() {
  const { reportHeight } = useContext(ShellLayoutContext);
  const [element, setElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (element === null || reportHeight === undefined) return;
    const measure = () => reportHeight(element.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      reportHeight(0);
    };
  }, [element, reportHeight]);
  return setElement;
}

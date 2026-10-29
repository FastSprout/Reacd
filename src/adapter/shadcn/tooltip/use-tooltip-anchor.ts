import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const ANCHOR_POLICY = {
  initialFocusable: false,
  selector: 'button,input,select,textarea,a[href],summary,[tabindex]',
  excluded: ':disabled,[type="hidden"]',
  hidden: '[hidden],[inert]',
  attributes: ['disabled', 'tabindex', 'hidden', 'inert'],
} as const;
export function useTooltipAnchor(children: ReactNode) {
  const ref = useRef<HTMLDivElement>(null);
  const [focusable, setFocusable] = useState<boolean>(ANCHOR_POLICY.initialFocusable);
  useLayoutEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const update = () => {
      const descendants = element.querySelectorAll<HTMLElement>(ANCHOR_POLICY.selector);
      setFocusable(
        !Array.from(descendants).some((child) => {
          const hidden = child.closest(ANCHOR_POLICY.hidden);
          return (
            child.tabIndex >= 0 &&
            !child.matches(ANCHOR_POLICY.excluded) &&
            (hidden === null || !element.contains(hidden))
          );
        }),
      );
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(element, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [...ANCHOR_POLICY.attributes],
    });
    return () => observer.disconnect();
  }, [children]);
  return { ref, tabIndex: focusable ? 0 : -1 };
}

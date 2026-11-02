import type { Locator } from '@playwright/test';

export function measureControlEscapes(
  region: Locator,
  tolerance: number,
  selectors: string,
) {
  return region.evaluate((element, { boundaryTolerance, selectors }) => {
    const SDK_MIRROR = {
      dimension: '1px',
      position: 'fixed',
      clipping: 'inset(50%)',
      hidden: 'true',
      tabIndex: -1,
    } as const;
    const outer = element.getBoundingClientRect();
    return Array.from(
      element.querySelectorAll(selectors),
    ).flatMap((item) => {
      const style = getComputedStyle(item);
      const unpaintedMirror =
        item instanceof HTMLInputElement &&
        item.getAttribute('aria-hidden') === SDK_MIRROR.hidden &&
        item.tabIndex === SDK_MIRROR.tabIndex &&
        style.position === SDK_MIRROR.position &&
        style.width === SDK_MIRROR.dimension &&
        style.height === SDK_MIRROR.dimension &&
        style.clipPath === SDK_MIRROR.clipping;
      if (unpaintedMirror) return [];
      const box = item.getBoundingClientRect();
      let left = box.left;
      let right = box.right;
      for (
        let parent = item.parentElement;
        parent !== null && parent !== element;
        parent = parent.parentElement
      ) {
        if (getComputedStyle(parent).overflowX !== 'visible') {
          const clip = parent.getBoundingClientRect();
          left = Math.max(left, clip.left);
          right = Math.min(right, clip.right);
        }
      }
      if (
        right > left && box.height > 0 &&
        (left < outer.left - boundaryTolerance ||
          right > outer.right + boundaryTolerance)
      ) {
        return [
          {
            tag: item.tagName,
            label: item.getAttribute('aria-label'),
            className: item.className,
            width: style.width,
            height: style.height,
            clipPath: style.clipPath,
            position: style.position,
            left: box.left,
            right: box.right,
            outerLeft: outer.left,
            outerRight: outer.right,
          },
        ];
      }
      return [];
    });
  }, { boundaryTolerance: tolerance, selectors });
}

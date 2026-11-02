export function hasInlineOverflow(
  element: Element,
  policy: { selectors: string; tolerance: number },
): boolean {
  const outer = element.getBoundingClientRect();
  return Array.from(element.querySelectorAll(policy.selectors)).some(child => {
    const box = child.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return false;
    let left = box.left;
    let right = box.right;
    for (
      let parent = child.parentElement;
      parent !== null && parent !== element;
      parent = parent.parentElement
    ) {
      const style = getComputedStyle(parent);
      if (style.visibility === 'hidden') return false;
      if (style.overflowX !== 'visible') {
        const clip = parent.getBoundingClientRect();
        left = Math.max(left, clip.left);
        right = Math.min(right, clip.right);
      }
    }
    return right > left && (
      left < outer.left - policy.tolerance ||
      right > outer.right + policy.tolerance
    );
  });
}

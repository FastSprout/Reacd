export function scrollOverflowDiagnostic(tolerance: number) {
  const limits = { text: 80, elements: 24, pseudos: 24, ancestors: 6 };
  function identity(element: Element) {
    return {
      tag: element.tagName,
      id: element.id,
      role: element.getAttribute('role'),
      label: element.getAttribute('aria-label'),
      classes: element.getAttribute('class'),
      text: element.textContent?.trim().slice(0, limits.text),
    };
  }
  function dimensions(element: Element) {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      width: box.width,
      height: box.height,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      visibility: style.visibility,
      display: style.display,
      position: style.position,
      transform: style.transform,
      paddingInline: style.paddingInline,
      borderInlineWidth: style.borderInlineWidth,
      marginInline: style.marginInline,
      boxSizing: style.boxSizing,
    };
  }
  function ancestors(element: Element) {
    const result = [];
    for (
      let parent = element.parentElement;
      parent && result.length < limits.ancestors;
      parent = parent.parentElement
    ) {
      result.push({ ...identity(parent), ...dimensions(parent) });
    }
    return result;
  }
  function pseudo(element: Element, selector: '::before' | '::after') {
    const style = getComputedStyle(element, selector);
    if (
      style.display === 'none' ||
      style.content === 'none' ||
      style.content === 'normal'
    ) return [];
    return [{
      selector,
      owner: identity(element),
      ownerDimensions: dimensions(element),
      content: style.content,
      display: style.display,
      visibility: style.visibility,
      position: style.position,
      width: style.width,
      minWidth: style.minWidth,
      maxWidth: style.maxWidth,
      height: style.height,
      inset: style.inset,
      margin: style.margin,
      padding: style.padding,
      border: style.border,
      boxSizing: style.boxSizing,
      transform: style.transform,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      ancestors: ancestors(element),
    }];
  }
  const elements = [...document.querySelectorAll('*')];
  const outside = elements.flatMap((element) => {
    const box = element.getBoundingClientRect();
    const rawOutside =
      box.width > 0 &&
      box.height > 0 &&
      Math.max(-box.left, box.right - innerWidth) > tolerance;
    const scrolls = element.scrollWidth > element.clientWidth + tolerance;
    if (!rawOutside && !scrolls) return [];
    return [{
      ...identity(element),
      ...dimensions(element),
      rawOutside,
      scrolls,
      ancestors: ancestors(element),
    }];
  });
  const pseudos = elements.flatMap((element) => [
    ...pseudo(element, '::before'),
    ...pseudo(element, '::after'),
  ]);
  return {
    viewport: innerWidth,
    scrollX,
    devicePixelRatio,
    roots: [document.documentElement, document.body].map((element) => ({
      ...identity(element),
      ...dimensions(element),
    })),
    outsideCount: outside.length,
    outside: outside.slice(0, limits.elements),
    pseudoCount: pseudos.length,
    pseudos: pseudos.slice(0, limits.pseudos),
  };
}

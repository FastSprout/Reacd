// JSDOM range rectangles support semantic SDK tests, not browser layout assertions.
export function installEditorGeometry(): () => void {
  const rectangle = new DOMRect(0, 0, 1, 1);
  const list: DOMRectList = {
    0: rectangle,
    length: 1,
    item: (index) => (index === 0 ? rectangle : null),
    [Symbol.iterator]: () => [rectangle][Symbol.iterator](),
  };
  const bounds = Object.getOwnPropertyDescriptor(
    Range.prototype,
    'getBoundingClientRect',
  );
  const rectangles = Object.getOwnPropertyDescriptor(Range.prototype, 'getClientRects');
  Object.defineProperties(Range.prototype, {
    getBoundingClientRect: { configurable: true, value: () => rectangle },
    getClientRects: { configurable: true, value: () => list },
  });
  return () => {
    if (bounds === undefined)
      Reflect.deleteProperty(Range.prototype, 'getBoundingClientRect');
    else Object.defineProperty(Range.prototype, 'getBoundingClientRect', bounds);
    if (rectangles === undefined)
      Reflect.deleteProperty(Range.prototype, 'getClientRects');
    else Object.defineProperty(Range.prototype, 'getClientRects', rectangles);
  };
}

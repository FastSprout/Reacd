export function hasTextOverflow(element: Element, tolerance: number): boolean {
  const box = element.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(element);
  const glyphs = [...range.getClientRects()];
  if (!glyphs.length) throw new Error('Expected nonempty native label text.');
  return glyphs.some((glyph) =>
    glyph.left < box.left - tolerance ||
    glyph.right > box.right + tolerance ||
    glyph.top < box.top - tolerance ||
    glyph.bottom > box.bottom + tolerance,
  );
}

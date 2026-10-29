export function focusTreeElement(
  elements: ReadonlyMap<string, HTMLElement>,
  id: string | undefined,
): void {
  if (id !== undefined) elements.get(id)?.focus();
}

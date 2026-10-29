export function focusListboxAfterClear(
  root: HTMLElement | null,
  button: HTMLButtonElement,
  wasFocused: boolean,
): void {
  const document = button.ownerDocument;
  if (root === null || !wasFocused) return;
  if (document.activeElement === button || document.activeElement === document.body) {
    root.focus();
  }
}

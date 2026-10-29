const SEGMENTS = '[role="spinbutton"],[role="textbox"]';

export function captureRangeFocus(root: HTMLElement): () => void {
  const document = root.ownerDocument;
  const active = document.activeElement;
  const index = [...root.querySelectorAll<HTMLElement>(SEGMENTS)].findIndex(
    (segment) => segment === active,
  );
  return () => {
    const current = document.activeElement;
    if (
      index < 0 ||
      !root.isConnected ||
      (current !== document.body && current !== active)
    )
      return;
    root.querySelectorAll<HTMLElement>(SEGMENTS).item(index)?.focus({
      preventScroll: true,
    });
  };
}

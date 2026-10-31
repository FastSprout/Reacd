export function focusIncompleteSegment(root: HTMLElement | null): boolean {
  const segment = root?.querySelector<HTMLElement>(
    '[data-placeholder]:is([role="spinbutton"],[role="textbox"])',
  );
  if (segment === undefined || segment === null) return false;
  segment.focus();
  return true;
}

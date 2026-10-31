const CONTROL_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="combobox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="textbox"]',
].join(',');

export function focusFieldControl(root: HTMLFieldSetElement | null): void {
  if (root === null) return;
  const controls = root.querySelectorAll<HTMLElement>(CONTROL_SELECTOR);
  const control = [...controls].find(
    (candidate) =>
      !candidate.matches(':disabled, [aria-disabled="true"], [type="hidden"]') &&
      candidate.closest('[hidden], [inert], [aria-hidden="true"]') === null,
  );
  (control ?? root).focus();
}

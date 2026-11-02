import { focusMaterialField } from '../native-focus.js';
import { MATERIAL_FIELD_FOCUS_POLICY as POLICY } from './focus-policy.js';

function unavailable(control: HTMLElement, group: HTMLFieldSetElement): boolean {
  if (control.matches(POLICY.disabled) || control.closest(POLICY.excluded)) return true;
  if (control instanceof HTMLInputElement && control.type === 'hidden') return true;
  let current: HTMLElement | null = control;
  while (current !== null) {
    const style = getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden') return true;
    if (current === group) break;
    current = current.parentElement;
  }
  return false;
}

export function focusFieldControl(group: HTMLFieldSetElement | null): void {
  if (group === null) return;
  const controls = group.querySelectorAll<HTMLElement>(POLICY.controls);
  for (const control of controls) {
    if (!unavailable(control, group)) {
      focusMaterialField(control);
      return;
    }
  }
  focusMaterialField(group);
}

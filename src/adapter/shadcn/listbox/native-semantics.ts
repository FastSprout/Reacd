import { LISTBOX_POLICY } from '../../../core/listbox-policy.js';

interface ListboxSemantics {
  readonly readOnly: boolean;
  readonly required: boolean;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly busy: boolean;
}

export function maintainListboxSemantics(
  root: HTMLElement | null,
  state: ListboxSemantics,
): () => void {
  if (root === null) return () => undefined;
  const attributes = {
    'aria-readonly': state.readOnly,
    'aria-required': state.required,
    'aria-invalid': state.invalid,
    'aria-disabled': state.disabled,
    'aria-busy': state.busy,
  };
  for (const [attribute, value] of Object.entries(attributes)) {
    root.setAttribute(attribute, String(value));
  }
  if (!state.disabled) return () => undefined;
  const element = root;
  function excludeFromTab() {
    if (element.tabIndex !== LISTBOX_POLICY.disabledTabIndex) {
      element.tabIndex = LISTBOX_POLICY.disabledTabIndex;
    }
  }
  const observer = new MutationObserver(excludeFromTab);
  excludeFromTab();
  observer.observe(root, { attributes: true, attributeFilter: ['tabindex'] });
  return () => {
    observer.disconnect();
    root.tabIndex =
      root.querySelector('[role="option"][tabindex="0"]') === null
        ? LISTBOX_POLICY.activeTabIndex
        : LISTBOX_POLICY.disabledTabIndex;
  };
}

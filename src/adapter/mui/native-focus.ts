export interface MaterialFocusHandle {
  focus(): void;
}

export function focusMaterialField(handle: MaterialFocusHandle | null): void {
  handle?.focus();
}

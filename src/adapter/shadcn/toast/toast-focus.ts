export interface FocusableToast {
  id: string;
  ref?: { current: HTMLElement | null } | undefined;
  limited?: boolean | undefined;
  transitionStatus?: 'starting' | 'ending' | undefined;
}
export function createToastFocus() {
  let previous: HTMLElement | null = null;
  return {
    remember(viewport: HTMLElement, origin: EventTarget | null): void {
      if (
        origin instanceof HTMLElement &&
        !viewport.contains(origin) &&
        !origin.hasAttribute('data-base-ui-focus-guard')
      )
        previous = origin;
    },
    close(id: string, records: readonly FocusableToast[], dismiss: () => void): void {
      const index = records.findIndex((record) => record.id === id);
      const root = records[index]?.ref?.current;
      if (root == null || !root.contains(root.ownerDocument.activeElement)) {
        dismiss();
        return;
      }
      const ordered = [
        ...records.slice(index + 1),
        ...records.slice(0, index).reverse(),
      ];
      const next = ordered.find(
        (record) =>
          !record.limited &&
          record.transitionStatus !== 'ending' &&
          record.ref?.current?.isConnected,
      );
      const destination = next?.ref?.current;
      dismiss();
      queueMicrotask(() => {
        const document = root.ownerDocument;
        const active = document.activeElement;
        if (active !== document.body && !root.contains(active)) return;
        if (destination?.isConnected) destination.focus();
        else if (previous?.isConnected) previous.focus();
      });
    },
  };
}

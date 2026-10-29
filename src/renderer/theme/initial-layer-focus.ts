const ACTIVE_DIALOG_SELECTOR = '[role="dialog"][data-open]';

export function initialLayerFocus(
  panel: HTMLElement | null,
  interaction: string,
): boolean | HTMLElement | null {
  if (panel !== null && panel.querySelector(ACTIVE_DIALOG_SELECTOR) !== null) {
    return false;
  }
  return interaction === 'touch' ? panel : true;
}

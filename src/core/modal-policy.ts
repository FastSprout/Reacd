export const MODAL_DEFAULTS = {
  dismissible: true,
  modal: true,
  overlay: true,
  fullscreen: false,
  retainContent: false,
  closeLabel: 'Close',
} as const;
export const MODAL_POLICY = {
  layer: 100,
  popupLayer: 1,
  widthRem: 40,
  backdropPercent: 40,
} as const;

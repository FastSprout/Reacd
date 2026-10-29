export const MEDIA_DIMENSIONS = {
  editorial: { width: 640, height: 360 },
  logo: { width: 160, height: 80 },
} as const;
export const MEDIA_DEFAULTS = {
  failed: false,
  unavailable: 'Image unavailable:',
  emptyLogos: 'No logos to display.',
} as const;

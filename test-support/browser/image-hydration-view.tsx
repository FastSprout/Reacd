import { Image, ReacdProvider } from '@fastsprout/reacd';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';

export const IMAGE_HYDRATION_ALT = 'Hydrated workspace';
export const IMAGE_HYDRATION_PREFIX = 'image-hydration-';
export const IMAGE_HYDRATION_SOURCES = {
  loaded: '/color-mode-light.svg',
  failed: '/image-hydration-missing.svg',
} as const;

export interface ImageHydrationParameters {
  readonly adapter: 'shadcn' | 'mui';
  readonly source: keyof typeof IMAGE_HYDRATION_SOURCES;
}

declare global {
  interface Window {
    hydrateImage?: (() => void) | undefined;
    imageHydrationErrors?: readonly string[] | undefined;
  }
}

export function imageHydrationParameters(search: string): ImageHydrationParameters {
  const query = new URLSearchParams(search);
  const adapter = query.get('adapter');
  const source = query.get('source');
  if (adapter !== 'shadcn' && adapter !== 'mui')
    throw new Error('Image hydration requires a selected native adapter.');
  if (source !== 'loaded' && source !== 'failed')
    throw new Error('Image hydration requires a known source.');
  return { adapter, source };
}

export function imageHydrationView(parameters: ImageHydrationParameters) {
  return (
    <ReacdProvider adapter={parameters.adapter === 'mui' ? muiAdapter : shadcnAdapter}>
      <Image
        src={IMAGE_HYDRATION_SOURCES[parameters.source]}
        alt={IMAGE_HYDRATION_ALT}
      />
    </ReacdProvider>
  );
}

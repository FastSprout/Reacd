import '@fastsprout/reacd-shadcn/styles';
import '@fastsprout/reacd-mui/styles';
import { hydrateRoot } from 'react-dom/client';
import {
  IMAGE_HYDRATION_PREFIX,
  imageHydrationParameters,
  imageHydrationView,
} from './image-hydration-view.js';

const host = document.getElementById('root');
if (host === null) throw new Error('Missing Image hydration proof root.');
const parameters = imageHydrationParameters(window.location.search);
const errors: string[] = [];
let hydrated = false;
window.imageHydrationErrors = errors;
window.hydrateImage = () => {
  if (hydrated) throw new Error('Image proof is already hydrated.');
  hydrated = true;
  hydrateRoot(host, imageHydrationView(parameters), {
    identifierPrefix: IMAGE_HYDRATION_PREFIX,
    onRecoverableError(error: unknown) {
      errors.push(error instanceof Error ? error.message : String(error));
    },
  });
};

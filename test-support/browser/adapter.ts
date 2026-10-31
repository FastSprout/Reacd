import '@fastsprout/reacd-shadcn/styles';
import '@fastsprout/reacd-mui/styles';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';

export const BROWSER_ADAPTER_KEY = 'reacd-conformance-adapter';
export const browserAdapter =
  typeof window !== 'undefined' &&
  window.localStorage.getItem(BROWSER_ADAPTER_KEY) === 'mui'
    ? muiAdapter
    : shadcnAdapter;

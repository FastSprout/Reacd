import { muiAdapter } from '../src/adapter/mui/mui.adapter.js';
import { shadcnAdapter } from '../src/adapter/shadcn/shadcn.adapter.js';

export const activeTestAdapter =
  process.env['REACD_TEST_ADAPTER'] === 'mui' ? muiAdapter : shadcnAdapter;

import { muiPrimitives } from '../src/adapter/mui/primitives/primitives.js';
import { shadcnPrimitives } from '../src/adapter/shadcn/primitives/primitives.js';

export const testPrimitives =
  process.env['REACD_TEST_ADAPTER'] === 'mui' ? muiPrimitives : shadcnPrimitives;

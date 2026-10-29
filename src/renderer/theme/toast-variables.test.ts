import { expect, it } from 'vitest';
import { toastVariables } from './toast-variables.js';
it('exposes named toast dimensions as private template variables', () => {
  expect(toastVariables()).toEqual({
    '--reacd-toast-width': '28rem',
    '--reacd-toast-layer': 120,
    '--reacd-toast-grip-width': '3rem',
    '--reacd-toast-grip-block': '4px',
    '--reacd-toast-block': '60dvh',
  });
});

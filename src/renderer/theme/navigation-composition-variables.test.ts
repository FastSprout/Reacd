import { expect, it } from 'vitest';
import { navigationCompositionVariables } from './navigation-composition-variables.js';
it('binds navigation sizing to named core policies', () => {
  const values = navigationCompositionVariables();
  expect(values['--reacd-navigation-column']).toBe('12rem');
  expect(values['--reacd-navigation-popup']).toBe('24rem');
  expect(values['--reacd-step-description-scale']).toBeGreaterThan(0);
});

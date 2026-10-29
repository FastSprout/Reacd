import { expect, it } from 'vitest';
import { panelVariables } from './panel-variables.js';
it('provides engine-owned edge panel bounds', () => {
  expect(panelVariables()['--reacd-panel-width']).toBe('32rem');
  expect(panelVariables()['--reacd-panel-max-block']).toBe('85dvh');
});

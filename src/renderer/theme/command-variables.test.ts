import { expect, it } from 'vitest';
import { commandVariables } from './command-variables.js';
it('binds list sizing to the named command policy', () => {
  expect(commandVariables()['--reacd-command-block']).toBe('24rem');
});

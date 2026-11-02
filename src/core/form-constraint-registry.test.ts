import { expect, it } from 'vitest';
import { FORM_SUBMIT_POLICY } from './form-submit-policy.js';
import { FormConstraintRegistry } from './form-constraint-registry.js';
it('validates registered logical values and removes unmounted constraints', () => {
  const registry = new FormConstraintRegistry();
  registry.register({ id: 'valid', label: 'Valid', getMessage: () => undefined });
  const remove = registry.register({
    id: 'email',
    label: 'Email',
    getMessage: () => 'Check email',
  });
  expect(registry.inspect()).toEqual([
    { id: 'email', label: 'Email', message: 'Check email' },
  ]);
  remove();
  expect(registry.inspect()).toEqual([]);
});
it('keeps replacement registrations when an older cleanup arrives', () => {
  const registry = new FormConstraintRegistry();
  const old = registry.register({ id: 'field', label: 'Old', getMessage: () => 'Old' });
  registry.register({ id: 'field', label: 'New', getMessage: () => 'New' });
  old();
  expect(registry.inspect()).toEqual([{ id: 'field', label: 'New', message: 'New' }]);
});
it('bounds issue output and isolates independent form registries', () => {
  const registry = new FormConstraintRegistry();
  for (let index = 0; index <= FORM_SUBMIT_POLICY.maximumIssues; index += 1) {
    registry.register({ id: String(index), label: 'Field', getMessage: () => 'Error' });
  }
  expect(registry.inspect()).toHaveLength(FORM_SUBMIT_POLICY.maximumIssues);
  expect(new FormConstraintRegistry().inspect()).toEqual([]);
});

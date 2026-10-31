import { fireEvent, render } from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { TemporalDraftValidity } from './draft-validity.js';

it('derives native validity from draft state and ignores direct value changes', () => {
  const invalid = vi.fn();
  const { container } = render(
    <TemporalDraftValidity
      segments={[{ isEditable: true, isPlaceholder: false }]}
      onInvalidChange={invalid}
      root={null}
      value="2024-02-29"
    />,
  );
  const projection = container.querySelector('input');
  if (projection === null) throw new Error('Expected native draft validity.');
  expect(invalid).toHaveBeenCalledExactlyOnceWith(false);
  fireEvent.change(projection, { target: { value: 'external-change' } });
  expect(projection.value).toBe('complete');
  expect(invalid).toHaveBeenCalledOnce();
});

it('blocks a cleared draft while its host still holds a committed date', () => {
  const invalid = vi.fn();
  const { container } = render(
    <TemporalDraftValidity
      segments={[{ isEditable: true, isPlaceholder: true }]}
      onInvalidChange={invalid}
      root={null}
      value="2024-02-29"
    />,
  );
  const projection = container.querySelector('input');
  if (projection === null) throw new Error('Expected native draft validity.');
  expect(projection.checkValidity()).toBe(false);
  expect(invalid).toHaveBeenCalledExactlyOnceWith(true);
});

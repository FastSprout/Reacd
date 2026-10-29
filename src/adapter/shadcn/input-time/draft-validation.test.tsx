import { fireEvent, render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TimeDraftValidation } from './draft-validation.js';

it('treats the native validation input as a projection of segmented state', () => {
  const invalid = vi.fn();
  const { container } = render(
    <TimeDraftValidation
      segments={[{ isEditable: true, isPlaceholder: false }]}
      onInvalidChange={invalid}
      root={null}
      value="12:00:00"
    />,
  );
  const projection = container.querySelector('input');
  if (projection === null) throw new Error('Expected a native validity projection.');
  expect(invalid).toHaveBeenCalledExactlyOnceWith(false);
  fireEvent.change(projection, { target: { value: 'external-change' } });
  expect(projection.value).toBe('complete');
  expect(invalid).toHaveBeenCalledOnce();
});

it('blocks a stale empty draft while its committed value remains nonnull', () => {
  const invalid = vi.fn();
  const { container } = render(
    <TimeDraftValidation
      segments={[{ isEditable: true, isPlaceholder: true }]}
      onInvalidChange={invalid}
      root={null}
      value="00:00:00"
    />,
  );
  const projection = container.querySelector('input');
  if (projection === null) throw new Error('Expected a native validity projection.');
  expect(projection.checkValidity()).toBe(false);
  expect(invalid).toHaveBeenCalledExactlyOnceWith(true);
});

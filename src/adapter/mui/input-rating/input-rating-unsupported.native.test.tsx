import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { MuiInputRating } from './input-rating.adapter.js';

it('rejects disabling hover instead of replacing the native Rating engine', () => {
  expect(() =>
    render(
      <MuiInputRating
        label="Service rating"
        value={2}
        hoverable={false}
        onValueChange={() => undefined}
      />,
    ),
  ).toThrow(UnsupportedAdapterComponentError);
});

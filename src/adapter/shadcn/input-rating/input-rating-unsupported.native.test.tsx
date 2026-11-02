import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { ShadcnInputRating } from './input-rating.adapter.js';

it('rejects rating rather than inventing a hover interaction engine', () => {
  expect(() =>
    render(
      <ShadcnInputRating
        label="Service rating"
        value={2}
        hoverable
        onValueChange={() => undefined}
      />,
    ),
  ).toThrow(UnsupportedAdapterComponentError);
});

import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Listbox, ReacdProvider } from '@fastsprout/reacd';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { shadcnAdapter } from '../shadcn.adapter.js';

it('rejects Listbox instead of substituting a different SDK keyboard contract', () => {
  expect(() =>
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Listbox
          label="People"
          items={[{ value: 'ada', label: 'Ada' }]}
          value="ada"
          onValueChange={() => undefined}
        />
      </ReacdProvider>,
    ),
  ).toThrow(UnsupportedAdapterComponentError);
});

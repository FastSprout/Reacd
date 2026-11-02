import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import {
  Collapsible,
  defineThemeAdapter,
  InputNumber,
  Pagination,
  ReacdProvider,
} from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativeExtraControlsEntries } from './native-extra-controls.js';

const adapter = defineThemeAdapter({
  ...shadcnAdapter,
  components: { ...shadcnAdapter.components, ...nativeExtraControlsEntries },
});

it('renders closed declarations through validated native SDK entries', () => {
  render(
    <ReacdProvider adapter={adapter}>
      <Collapsible label="Details" open onOpenChange={() => undefined}>
        Details content
      </Collapsible>
      <InputNumber label="Quantity" value={2} onValueChange={() => undefined} />
      <Pagination
        label="Results"
        totalItems={30}
        value={{ pageIndex: 0, pageSize: 10 }}
        onValueChange={() => undefined}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Details' })).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Quantity' })).toHaveValue('2');
  expect(screen.getByRole('navigation', { name: 'Results' })).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});

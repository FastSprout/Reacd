import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnRadioControl } from './radio-control.js';

const nativeRequest = vi.hoisted(() => {
  const capture: { change: ((value: string) => void) | undefined } = {
    change: undefined,
  };
  return capture;
});

vi.mock('../vendor/ui/radio-group.js', async (importOriginal) => {
  const sdk = await importOriginal<typeof import('../vendor/ui/radio-group.js')>();
  return {
    ...sdk,
    RadioGroup: (props: ComponentProps<typeof sdk.RadioGroup>) => {
      nativeRequest.change = props.onValueChange;
      return <sdk.RadioGroup {...props} />;
    },
  };
});

it('rejects an explicit native SDK request from an inactive group', () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <PortalActiveContext value={false}>
      <ShadcnRadioControl
        id="plans"
        label="Plan"
        value="one"
        onValueChange={change}
        items={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
      />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAttribute(
    'data-slot',
    'radio-group',
  );
  const selected = screen.getByRole('radio', { name: 'One' });
  expect(selected).toBeDisabled();
  expect(selected).toHaveAttribute('aria-checked', 'true');
  const request = nativeRequest.change;
  if (!request) throw new Error('Expected native SDK change callback.');
  request('two');
  expect(change).not.toHaveBeenCalled();
  expect(selected).toHaveAttribute('aria-checked', 'true');
});

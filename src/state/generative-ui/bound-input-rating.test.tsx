import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { BoundInputRating } from './bound-input-rating.js';
import { success } from '../../../test-support/data-table.js';

const reference = { state: 'rating', mode: 'readWrite' } as const;
const node = { type: 'InputRating', label: 'Rating', value: reference } as const;
describe('bound InputRating', () => {
  it('shares edits with readers and protects host writes', async () => {
    const user = userEvent.setup();
    const registry = success(
      createStateRegistry([
        { key: 'rating', kind: 'number', initial: 1, access: 'readWrite' },
      ]),
    );
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputRating node={node} registry={registry} />
        <BoundInputRating
          node={{ ...node, label: 'Reader', value: { ...reference, mode: 'read' } }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    screen.getByRole('slider', { name: 'Rating' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(success(registry.read('rating')).value).toBe(2);
    expect(screen.getByRole('slider', { name: 'Reader' })).toHaveAttribute(
      'aria-valuenow',
      '2',
    );
    act(() => {
      expect(registry.update('rating', 2.5).success).toBe(false);
    });
    act(() => {
      expect(registry.update('rating', 6).success).toBe(false);
    });
    expect(success(registry.read('rating')).value).toBe(2);
  });
  it('supports explicit half steps and explicit read-only state', () => {
    const registry = success(
      createStateRegistry([
        { key: 'rating', kind: 'number', initial: 3.5, access: 'readWrite' },
      ]),
    );
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputRating
          node={{ ...node, step: 0.5, length: 10, readOnly: true }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('slider', { name: 'Rating' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
  });
  it.each(
    [
      [],
      [{ key: 'rating', kind: 'text', initial: '1', access: 'readWrite' }],
      [{ key: 'rating', kind: 'number', initial: 6, access: 'readWrite' }],
      [{ key: 'rating', kind: 'number', initial: 1, access: 'read' }],
    ].map((definitions) => ({ definitions })),
  )('rejects unavailable or invalid state', ({ definitions }) => {
    const registry = success(createStateRegistry(definitions));
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputRating node={node} registry={registry} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

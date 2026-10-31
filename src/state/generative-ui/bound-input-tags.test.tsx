import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundInputTags } from './bound-input-tags.js';

const reference = { state: 'topics', mode: 'readWrite' } as const;
const node = { type: 'InputTags', label: 'Topics', value: reference } as const;
describe('bound InputTags', () => {
  it('shares committed values and rejects invalid host writes', async () => {
    const user = userEvent.setup();
    const registry = success(
      createStateRegistry([
        { key: 'topics', kind: 'selection', initial: ['React'], access: 'readWrite' },
      ]),
    );
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputTags
          node={{ ...node, maxTags: 2, maxTagLength: 5 }}
          registry={registry}
        />
        <BoundInputTags
          node={{ ...node, label: 'Reader', value: { ...reference, mode: 'read' } }}
          registry={registry}
        />
      </ReacdProvider>,
    );
    await user.type(screen.getByRole('combobox', { name: 'Topics' }), 'Vue{Enter}');
    expect(success(registry.read('topics')).value).toEqual(['React', 'Vue']);
    expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveAttribute(
      'readonly',
    );
    act(() => {
      expect(registry.update('topics', ['oversized']).success).toBe(false);
    });
    expect(success(registry.read('topics')).value).toEqual(['React', 'Vue']);
  });
  it('supports explicit read-only state', () => {
    const registry = success(
      createStateRegistry([
        { key: 'topics', kind: 'selection', initial: [], access: 'readWrite' },
      ]),
    );
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputTags node={{ ...node, readOnly: true }} registry={registry} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('combobox', { name: 'Topics' })).toHaveAttribute(
      'readonly',
    );
  });
  it.each(
    [
      [],
      [{ key: 'topics', kind: 'text', initial: '', access: 'readWrite' }],
      [{ key: 'topics', kind: 'selection', initial: [' padded'], access: 'readWrite' }],
      [{ key: 'topics', kind: 'selection', initial: [], access: 'read' }],
    ].map((definitions) => ({ definitions })),
  )('reports invalid or unavailable state', ({ definitions }) => {
    const registry = success(createStateRegistry(definitions));
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <BoundInputTags node={node} registry={registry} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

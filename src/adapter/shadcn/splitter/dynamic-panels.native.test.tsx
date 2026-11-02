import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnSplitter } from './splitter.adapter.js';

it('reconciles added and removed SDK panels without changing retained content', () => {
  const change = vi.fn();
  const content = <input aria-label="Draft" defaultValue="Retained" />;
  const panels = [
    { id: 'left', label: 'Files', content },
    { id: 'right', label: 'Editor' },
  ];
  const view = render(
    <ShadcnSplitter
      label="Workspace"
      panels={panels}
      value={[{ id: 'left', share: 25 }, { id: 'right', share: 75 }]}
      onValueChange={change}
      narrow={false}
    />,
  );
  const draft = screen.getByRole('textbox', { name: 'Draft' });
  view.rerender(
    <ShadcnSplitter
      label="Workspace"
      panels={[...panels, { id: 'notes', label: 'Notes' }]}
      value={[
        { id: 'left', share: 25 },
        { id: 'right', share: 50 },
        { id: 'notes', share: 25 },
      ]}
      onValueChange={change}
      narrow={false}
    />,
  );
  expect(screen.getAllByRole('separator')).toHaveLength(2);
  expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
  view.rerender(
    <ShadcnSplitter
      label="Workspace"
      panels={panels}
      value={[{ id: 'left', share: 40 }, { id: 'right', share: 60 }]}
      onValueChange={change}
      narrow={false}
    />,
  );
  expect(screen.getAllByRole('separator')).toHaveLength(1);
  expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
  expect(draft).toHaveValue('Retained');
  expect(change).not.toHaveBeenCalled();
});

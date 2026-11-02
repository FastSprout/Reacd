import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageList } from './page-list.adapter.js';
it('keeps semantic items and child identity across native separator changes', () => {
  const children = [
    <input key="field" aria-label="Draft" defaultValue="Saved" />,
    null,
    false,
    <span key="last">Last</span>,
  ];
  const view = render(<ShadcnPageList>{children}</ShadcnPageList>);
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.queryByRole('separator')).toBeNull();
  const field = screen.getByRole('textbox');
  view.rerender(<ShadcnPageList divide>{children}</ShadcnPageList>);
  expect(screen.getAllByRole('separator')).toHaveLength(1);
  expect(screen.getByRole('textbox')).toBe(field);
  expect(field).toHaveValue('Saved');
});

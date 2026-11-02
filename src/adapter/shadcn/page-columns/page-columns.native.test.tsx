import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageColumns } from './page-columns.adapter.js';
it('uses intrinsic column flow and preserves keyed children', () => {
  const content = <input key="draft" aria-label="Draft" defaultValue="Saved" />;
  const view = render(
    <ShadcnPageColumns>
      {null}
      {false}
      {content}
    </ShadcnPageColumns>,
  );
  const field = screen.getByRole('textbox');
  expect(field.parentElement).toHaveStyle('break-inside: avoid');
  expect(field.parentElement?.parentElement).toHaveStyle('column-count: 3');
  expect(field.parentElement?.parentElement?.style.columnWidth).toBe('18rem');
  view.rerender(<ShadcnPageColumns>{content}</ShadcnPageColumns>);
  expect(screen.getByRole('textbox')).toBe(field);
  expect(field).toHaveValue('Saved');
});

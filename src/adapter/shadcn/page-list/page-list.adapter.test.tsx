import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShadcnPageList } from './page-list.adapter.js';

describe('PageList adapter', () => {
  it('preserves semantic list order without phantom children', () => {
    render(
      <ShadcnPageList divide>
        {null}
        {false}
        {'First item'}
        {'Second item'}
      </ShadcnPageList>,
    );
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-divide', 'true');
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'First item',
      'Second item',
    ]);
  });

  it('supports an empty undivided list', () => {
    render(<ShadcnPageList />);
    expect(screen.getByRole('list')).toHaveAttribute('data-divide', 'false');
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});

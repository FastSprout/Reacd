import { render, screen } from '../../../../test-support/adapter-testing.js';
import { describe, expect, it } from 'vitest';
import { SharedPageList } from './page-list.adapter.js';

describe('PageList adapter', () => {
  it('preserves semantic list order without phantom children', () => {
    render(
      <SharedPageList divide>
        {null}
        {false}
        {'First item'}
        {'Second item'}
      </SharedPageList>,
    );
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-divide', 'true');
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'First item',
      'Second item',
    ]);
  });

  it('supports an empty undivided list', () => {
    render(<SharedPageList />);
    expect(screen.getByRole('list')).toHaveAttribute('data-divide', 'false');
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});

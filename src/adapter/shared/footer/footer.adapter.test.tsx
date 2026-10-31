import { render, screen } from '../../../../test-support/adapter-testing.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SharedFooter } from './footer.adapter.js';
import { SharedContainer } from '../container/container.adapter.js';
import { SharedMain } from '../main/main.adapter.js';

describe('structural landmarks', () => {
  it('preserves all responsive footer slots', () => {
    render(
      <SharedFooter start="Start" end="End" top="Top" bottom="Bottom">
        Center
      </SharedFooter>,
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'TopStartCenterEndBottom',
    );
  });

  it('renders an empty footer and SSR main/container composition', () => {
    render(<SharedFooter />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('');
    const output = renderToStaticMarkup(
      <SharedMain>
        <SharedContainer>Server content</SharedContainer>
      </SharedMain>,
    );
    expect(output).toContain('<main');
    expect(output).toContain('reacd-container');
    expect(output).toContain('Server content');
  });

  it('keeps a single main landmark in nested composition', () => {
    render(
      <SharedMain>
        <SharedMain>Nested content</SharedMain>
      </SharedMain>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByText('Nested content').tagName).toBe('SECTION');
  });
});

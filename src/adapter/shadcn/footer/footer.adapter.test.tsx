import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ShadcnFooter } from './footer.adapter.js';
import { ShadcnContainer } from '../container/container.adapter.js';
import { ShadcnMain } from '../main/main.adapter.js';

describe('structural landmarks', () => {
  it('preserves all responsive footer slots', () => {
    render(
      <ShadcnFooter start="Start" end="End" top="Top" bottom="Bottom">
        Center
      </ShadcnFooter>,
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'TopStartCenterEndBottom',
    );
  });

  it('renders an empty footer and SSR main/container composition', () => {
    render(<ShadcnFooter />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('');
    const output = renderToStaticMarkup(
      <ShadcnMain>
        <ShadcnContainer>Server content</ShadcnContainer>
      </ShadcnMain>,
    );
    expect(output).toContain('<main');
    expect(output).toContain('reacd-container');
    expect(output).toContain('Server content');
  });

  it('keeps a single main landmark in nested composition', () => {
    render(
      <ShadcnMain>
        <ShadcnMain>Nested content</ShadcnMain>
      </ShadcnMain>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByText('Nested content').tagName).toBe('SECTION');
  });
});

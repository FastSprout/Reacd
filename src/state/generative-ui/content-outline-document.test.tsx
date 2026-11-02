import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';

function document() {
  return {
    schemaVersion: '0.2',
    state: [
      { key: 'current', kind: 'text', initial: '', access: 'readWrite' },
      { key: 'expanded', kind: 'selection', initial: ['guide'], access: 'readWrite' },
    ],
    root: {
      type: 'VStack',
      children: [
        {
          type: 'ContentNavigation',
          label: 'Generated document navigation',
          currentKey: { state: 'current', mode: 'readWrite' },
          expandedKeys: { state: 'expanded', mode: 'readWrite' },
          items: [
            {
              key: 'guide',
              label: 'Guide',
              children: [
                {
                  key: 'intro',
                  label: 'Introduction document',
                  href: '/intro',
                },
              ],
            },
          ],
        },
        {
          type: 'ContentToc',
          label: 'Generated table of contents',
          currentKey: { state: 'current', mode: 'readWrite' },
          items: [{ key: 'intro', label: 'Introduction heading' }],
        },
        { type: 'Text', content: { state: 'current', mode: 'read' } },
      ],
    },
  };
}

describe('whole-document content outline integration', () => {
  it('shares navigation and heading state through the public transport', () => {
    render(<GenerativeUI adapter={shadcnAdapter} document={document()} />);
    const link = screen.getByRole('link', { name: 'Introduction document' });
    const heading = screen.getByRole('link', { name: 'Introduction heading' });
    expect(link).toHaveAttribute('href', '/intro');
    expect(fireEvent.click(link)).toBe(true);
    expect(screen.getByText('intro')).toBeInTheDocument();
    expect(link).toHaveAttribute('aria-current');
    expect(heading).toHaveAttribute('aria-current');
    expect(heading).toHaveAttribute('href', '#intro');
    expect(fireEvent.click(heading)).toBe(true);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('rejects invalid shared current and expansion state before mounting links', () => {
    for (const state of [
      [
        { key: 'current', kind: 'text', initial: 'missing', access: 'readWrite' },
        { key: 'expanded', kind: 'selection', initial: [], access: 'readWrite' },
      ],
      [
        { key: 'current', kind: 'text', initial: '', access: 'readWrite' },
        { key: 'expanded', kind: 'selection', initial: ['intro'], access: 'readWrite' },
      ],
    ]) {
      const view = render(
        <GenerativeUI adapter={shadcnAdapter} document={{ ...document(), state }} />,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
      view.unmount();
    }
  });
});

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { followHref } from '../../renderer/navigation/native-navigation.js';

vi.mock('../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

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
          type: 'ContentNavigation', label: 'Generated document navigation',
          currentKey: { state: 'current', mode: 'readWrite' },
          expandedKeys: { state: 'expanded', mode: 'readWrite' },
          items: [{
            key: 'guide', label: 'Guide', children: [{
              key: 'intro', label: 'Introduction document', href: '/intro',
            }],
          }],
        },
        {
          type: 'ContentToc', label: 'Generated table of contents',
          currentKey: { state: 'current', mode: 'readWrite' },
          items: [{ key: 'intro', label: 'Introduction heading' }],
        },
        { type: 'Text', content: { state: 'current', mode: 'read' } },
      ],
    },
  };
}

describe('whole-document content outline integration', () => {
  it('shares navigation and heading state through the public transport', async () => {
    const user = userEvent.setup();
    render(<GenerativeUI document={document()} />);
    const link = screen.getByRole('link', { name: 'Introduction document' });
    const heading = screen.getByRole('link', { name: 'Introduction heading' });
    await user.click(link);
    expect(screen.getByText('intro')).toBeInTheDocument();
    expect(link).toHaveAttribute('aria-current');
    expect(heading).toHaveAttribute('aria-current');
    expect(followHref).toHaveBeenLastCalledWith(
      new URL('/intro', window.location.href).href,
    );
    await user.click(heading);
    expect(followHref).toHaveBeenLastCalledWith(
      new URL('#intro', window.location.href).href,
    );
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
      const view = render(<GenerativeUI document={{ ...document(), state }} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
      view.unmount();
    }
  });
});

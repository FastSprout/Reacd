import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd, ReacdProvider, Tooltip, Text } from '../../../index.js';

describe('shadcn Kbd', () => {
  it('names symbols and supports custom labels and logical variants', () => {
    const view = render(
      <ReacdProvider>
        <Kbd value="meta" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'Control' })).toHaveTextContent('Ctrl');
    view.rerender(
      <ReacdProvider templateId="erp-compact">
        <Kbd value="meta" platform="apple" label="Command key" />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'Command key' })).toHaveTextContent('⌘');
    for (const size of ['small', 'medium', 'large'] as const)
      for (const variant of ['outline', 'soft', 'subtle', 'solid'] as const)
        for (const intent of ['primary', 'secondary', 'danger'] as const) {
          view.rerender(
            <ReacdProvider>
              <Kbd value="F12" size={size} variant={variant} intent={intent} />
            </ReacdProvider>,
          );
          expect(screen.getByRole('img', { name: 'F12' })).toHaveTextContent('F12');
        }
    expect(screen.queryByRole('button')).toBeNull();
    expect(view.container.querySelector('[tabindex]')).toBeNull();
  });
  it('keeps existing tooltip shortcut labels literal', async () => {
    render(
      <ReacdProvider>
        <Tooltip
          text="Literal shortcuts"
          open
          onOpenChange={() => undefined}
          shortcuts={['ctrl', 'S']}
        >
          <Text>Anchor</Text>
        </Tooltip>
      </ReacdProvider>,
    );
    expect(await screen.findByRole('tooltip')).toHaveTextContent('ctrl');
    expect(screen.getByRole('img', { name: 'ctrl' })).toHaveTextContent('ctrl');
  });
});

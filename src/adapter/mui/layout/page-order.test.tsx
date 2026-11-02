import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { MuiButton } from '../button/button.adapter.js';
import { MuiPageCard } from '../page-card/page-card.adapter.js';
import { MuiPageHero } from '../page-hero/page-hero.adapter.js';
import { MuiPageSection } from '../page-section/page-section.adapter.js';

function Counter() {
  const [count, setCount] = useState(0);
  return <MuiButton label={`Body ${count}`} onPress={() => setCount(count + 1)} />;
}
it.each([MuiPageHero, MuiPageSection, MuiPageCard])(
  'reorders keyed native regions while retaining their child state',
  async (Page) => {
    const view = render(
      <Page title="Introduction">
        <Counter />
      </Page>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Body 0' }));
    view.rerender(
      <Page title="Introduction" reverse>
        <Counter />
      </Page>,
    );
    expect(screen.getByRole('button', { name: 'Body 1' })).toBeVisible();
    const text = view.container.textContent ?? '';
    expect(text.indexOf('Body 1')).toBeLessThan(text.indexOf('Introduction'));
  },
);

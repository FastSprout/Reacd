import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageCard } from './page-card.adapter.js';
import { PAGE_SURFACE_VARIANTS } from '../../../core/page-presentation-policy.js';
import { ShadcnThemeContext } from '../surface/theme-context.js';
import type { CSSProperties } from 'react';
it('keeps independent keyed content and header/footer while reversing regions', () => {
  const child = <input aria-label="Draft" defaultValue="Saved" />;
  const view = render(
    <ShadcnPageCard
      title="Title"
      header="Header"
      footer="Footer"
      orientation="horizontal"
      highlight
      spotlight
    >
      {child}
    </ShadcnPageCard>,
  );
  const card = screen.getByRole('article', { name: 'Title' });
  expect(card.className).toContain('rounded-xl');
  expect(card.className).toContain('focus-within:outline');
  expect(card).toHaveAttribute('tabindex', '0');
  const field = screen.getByRole('textbox');
  view.rerender(
    <ShadcnPageCard title="Title" reverse>
      {child}
    </ShadcnPageCard>,
  );
  expect(screen.getByRole('textbox')).toBe(field);
  expect(field).toHaveValue('Saved');
});
it('maps every native surface variant and verified foreground pair', () => {
  const variables: CSSProperties & Record<string, string> = {
    '--foreground': '#111111',
    '--background': '#ffffff',
    '--primary': '#222222',
    '--primary-foreground': '#ffffff',
    '--destructive': '#990000',
    '--destructive-foreground': '#ffffff',
  };
  const view = render(<ShadcnPageCard />);
  for (const variant of PAGE_SURFACE_VARIANTS) {
    for (const intent of ['neutral', 'primary', 'danger'] as const) {
      view.rerender(
        <ShadcnThemeContext value={variables}>
          <ShadcnPageCard title="Surface" variant={variant} intent={intent} />
        </ShadcnThemeContext>,
      );
      const card = screen.getByRole('article');
      expect(card).toBeVisible();
      if (variant === 'solid') {
        const backgrounds = {
          neutral: '#111111',
          primary: '#222222',
          danger: '#990000',
        };
        expect(card.style.getPropertyValue('--card')).toBe(backgrounds[intent]);
        expect(card.style.getPropertyValue('--muted')).toBe(backgrounds[intent]);
        expect(card.style.getPropertyValue('--foreground')).toBe('#ffffff');
      }
    }
  }
  view.rerender(<ShadcnPageCard title="Fallback" variant="solid" />);
  expect(screen.getByRole('article')).toBeVisible();
});

it('retains verified pairs in nested neutral solid surfaces', () => {
  const theme: CSSProperties & Record<string, string> = {
    '--foreground': '#111111',
    '--background': '#ffffff',
  };
  render(
    <ShadcnThemeContext value={theme}>
      <ShadcnPageCard title="Outer" variant="solid">
        <ShadcnPageCard title="Inner" variant="solid" />
      </ShadcnPageCard>
    </ShadcnThemeContext>,
  );
  const inner = screen.getByRole('article', { name: 'Inner' });
  expect(inner.style.getPropertyValue('--card')).toBe('#ffffff');
  expect(inner.style.getPropertyValue('--foreground')).toBe('#111111');
});

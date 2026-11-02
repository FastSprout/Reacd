import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnCodeBlock } from './code-block.adapter.js';

it('uses the SDK typography recipe and renders source as inert text', () => {
  const content = '<script>danger()</script>\n  const ready = true;';
  render(<ShadcnCodeBlock label="Example source" content={content} />);
  const region = screen.getByRole('region', { name: 'Example source' });
  expect(region.tagName).toBe('PRE');
  expect(region).toHaveAttribute('tabindex', '0');
  expect(region.className).toContain('overflow-x-auto');
  expect(region.textContent).toBe(content);
  expect(region.querySelector('script')).toBeNull();
});

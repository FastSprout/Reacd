import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { nativeSelectionEntries } from './native-selection.js';

it('registers the canonical searchable native SelectMenu', () => {
  render(nativeSelectionEntries.SelectMenu.render({
    label: 'Owner', value: 'a', items: [{ value: 'a', label: 'Alpha' }],
    onValueChange: vi.fn(),
  }));
  expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveAttribute(
    'data-slot', 'combobox-trigger',
  );
});

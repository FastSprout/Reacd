import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputMenu } from './input-menu.adapter.js';

it('leaves native composition pending until the SDK commits final text', async () => {
  const text = vi.fn();
  const suggestion = vi.fn();
  function Example() {
    const [value, setValue] = useState('');
    return (
      <ShadcnInputMenu
        label="City"
        value={value}
        items={[{ value: 'tokyo', label: 'Tokyo' }]}
        onValueChange={(next) => {
          text(next);
          setValue(next);
        }}
        onSuggestionSelect={suggestion}
      />
    );
  }
  render(<Example />);
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}');
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: '東京' } });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, isComposing: true });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
  expect(text).not.toHaveBeenCalled();
  expect(suggestion).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input, { data: '東京' });
  expect(text).toHaveBeenCalledExactlyOnceWith('東京');
  expect(input).toHaveValue('東京');
});

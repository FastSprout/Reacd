import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputTags } from './input-tags.adapter.js';

it('uses SDK token creation, focus and keyboard removal', async () => {
  const change = vi.fn();
  function Sample() {
    const [value, setValue] = useState<readonly string[]>(['React']);
    return (
      <ShadcnInputTags
        label="Topics"
        value={value}
        onValueChange={(next) => {
          change(next);
          setValue(next);
        }}
      />
    );
  }
  render(<Sample />);
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await userEvent.type(input, 'Vue{Enter}');
  expect(change).toHaveBeenCalledExactlyOnceWith(['React', 'Vue']);
  expect(input).toHaveValue('');
  const remove = screen.getByRole('button', { name: 'Remove Vue' });
  expect(remove).toHaveAttribute('type', 'button');
  await userEvent.click(remove);
  expect(change).toHaveBeenLastCalledWith(['React']);
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowLeft}');
  expect(screen.getByText('React').closest('[data-slot=combobox-chip]')).toHaveFocus();
  await userEvent.keyboard('{Delete}');
  expect(change).toHaveBeenLastCalledWith([]);
});

it('keeps rejected and invalid drafts editable', async () => {
  const change = vi.fn();
  render(
    <ShadcnInputTags
      label="Topics"
      value={['React']}
      onValueChange={change}
      maxTags={2}
      maxTagLength={5}
    />,
  );
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await userEvent.type(input, 'Vue{Enter}');
  expect(change).toHaveBeenCalledExactlyOnceWith(['React', 'Vue']);
  expect(input).toHaveValue('Vue');
  expect(screen.queryByRole('button', { name: 'Remove Vue' })).toBeNull();
  await userEvent.clear(input);
  await userEvent.type(input, 'React{Enter}');
  expect(screen.getByRole('alert')).toHaveTextContent('Tags must be unique.');
  expect(input).toHaveValue('React');
  await userEvent.clear(input);
  await userEvent.type(input, 'Too long{Enter}');
  expect(screen.getByRole('alert')).toHaveTextContent('maximum allowed length');
});

it('blocks composition Enter, delimiter and blur token creation', async () => {
  const change = vi.fn();
  render(
    <ShadcnInputTags
      label="Topics"
      value={[]}
      onValueChange={change}
      addOnBlur
      addOnTab
    />,
  );
  const input = screen.getByRole('combobox', { name: 'Topics' });
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: '東京' } });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, isComposing: true });
  fireEvent.keyDown(input, { key: ',', keyCode: 229 });
  fireEvent.blur(input);
  expect(change).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input, { data: '東京' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(change).toHaveBeenCalledExactlyOnceWith(['東京']);
});

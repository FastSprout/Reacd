import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputTags } from './input-tags.adapter.js';

it('creates atomic paste batches and keeps rejected text editable', async () => {
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
        addOnPaste
        maxTags={3}
        delimiters={['comma', 'newline']}
      />
    );
  }
  render(<Sample />);
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await userEvent.click(input);
  await userEvent.paste('Vue,東京');
  expect(change).toHaveBeenCalledExactlyOnceWith(['React', 'Vue', '東京']);
  expect(input).toHaveValue('');
  await userEvent.paste('Angular,Svelte');
  expect(change).toHaveBeenCalledOnce();
  expect(input).toHaveValue('Angular,Svelte');
  expect(screen.getByRole('alert')).toHaveTextContent('maximum number of tags');
  await userEvent.click(screen.getByRole('button', { name: 'Remove Vue' }));
  expect(change).toHaveBeenLastCalledWith(['React', '東京']);
});

it('commits delimiter, Tab and blur once', async () => {
  const change = vi.fn();
  render(
    <ShadcnInputTags
      label="Topics"
      value={[]}
      onValueChange={change}
      delimiters={['semicolon']}
      addOnTab
      addOnBlur
    />,
  );
  const input = screen.getByRole('combobox', { name: 'Topics' });
  await userEvent.type(input, 'Vue;');
  expect(change).toHaveBeenCalledExactlyOnceWith(['Vue']);
  await userEvent.clear(input);
  await userEvent.type(input, 'React{Tab}');
  expect(change).toHaveBeenCalledTimes(2);
  expect(change).toHaveBeenLastCalledWith(['React']);
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, 'Angular');
  fireEvent.blur(input);
  expect(change).toHaveBeenLastCalledWith(['Angular']);
});

it('keeps IME keys and paste pending until composition ends', async () => {
  const change = vi.fn();
  render(
    <ShadcnInputTags label="Topics" value={[]} onValueChange={change} addOnPaste />,
  );
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'Vue');
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
  fireEvent.compositionStart(input);
  fireEvent.paste(input, { clipboardData: { getData: () => 'React' } });
  expect(change).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input);
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(change).toHaveBeenCalledExactlyOnceWith(['Vue']);
});

it('appends pasted text when native selection is unavailable', async () => {
  const change = vi.fn();
  render(
    <ShadcnInputTags label="Topics" value={[]} onValueChange={change} addOnPaste />,
  );
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'Vue');
  Object.defineProperty(input, 'selectionStart', { configurable: true, value: null });
  Object.defineProperty(input, 'selectionEnd', { configurable: true, value: null });
  fireEvent.paste(input, { clipboardData: { getData: () => 'React' } });
  expect(change).toHaveBeenCalledExactlyOnceWith(['VueReact']);
});

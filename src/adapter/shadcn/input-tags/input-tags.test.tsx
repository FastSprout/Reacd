import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { ShadcnInputTags } from './input-tags.adapter.js';

describe('shadcn InputTags', () => {
  it('validates committed values and preserves form token boundaries', async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    function Example() {
      const [value, setValue] = useState<readonly string[]>([]);
      return (
        <form aria-label="Topics form" onSubmit={submit}>
          <ShadcnInputTags
            label="Topics"
            value={value}
            onValueChange={setValue}
            required
            name="topics"
          />
          <button type="submit">Save topics</button>
        </form>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Save topics' }));
    expect(submit).not.toHaveBeenCalled();
    const input = screen.getByRole('combobox', { name: 'Topics' });
    await user.type(input, 'React');
    await user.click(screen.getByRole('button', { name: 'Save topics' }));
    expect(submit).not.toHaveBeenCalled();
    await user.type(input, '{Enter}Vue{Enter}');
    await user.click(screen.getByRole('button', { name: 'Save topics' }));
    expect(submit).toHaveBeenCalledOnce();
    const form = screen.getByRole('form', { name: 'Topics form' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
    expect(new FormData(form).getAll('topics')).toEqual(['React', 'Vue']);
  });
  it('replaces selections and handles unavailable caret APIs', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<readonly string[]>([]);
      return (
        <ShadcnInputTags
          label="Topics"
          value={value}
          onValueChange={setValue}
          addOnPaste
        />
      );
    }
    render(<Example />);
    const input = screen.getByRole('combobox', { name: 'Topics' });
    await user.type(input, 'React');
    if (!(input instanceof HTMLInputElement)) throw new Error('Expected input');
    input.setSelectionRange(0, 5);
    await user.paste('Vue');
    expect(screen.getByRole('button', { name: 'Remove Vue' })).toBeInTheDocument();
    Object.defineProperty(input, 'selectionStart', { value: null });
    Object.defineProperty(input, 'selectionEnd', { value: null });
    await user.paste('React');
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
  });
  it('keeps normal paste as draft and rejects duplicate/oversized tokens', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ShadcnInputTags
        label="Topics"
        value={['Vue']}
        onValueChange={change}
        maxTagLength={4}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Topics' });
    await user.click(input);
    await user.paste('Vue');
    expect(change).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('unique');
    await user.clear(input);
    await user.type(input, 'React{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('maximum allowed length');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
  it('adds by Enter and delimiter and removes through labelled buttons', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState<readonly string[]>(['React']);
      return (
        <ShadcnInputTags
          label="Topics"
          value={value}
          description="Add relevant topics"
          placeholder="Enter a topic"
          onValueChange={(next) => {
            change(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Example />);
    const input = screen.getByRole('combobox', { name: 'Topics' });
    expect(input).toHaveAccessibleDescription('Add relevant topics');
    await user.type(input, 'Vue{Enter}');
    expect(change).toHaveBeenLastCalledWith(['React', 'Vue']);
    expect(input).toHaveValue('');
    await user.type(input, '東京,');
    expect(change).toHaveBeenLastCalledWith(['React', 'Vue', '東京']);
    await user.click(screen.getByRole('button', { name: 'Remove React' }));
    expect(change).toHaveBeenLastCalledWith(['Vue', '東京']);
    expect(input).toHaveFocus();
  });
  it('supports keyboard chip selection and deletion in RTL', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<readonly string[]>(['React', 'Vue']);
      return (
        <DirectionProvider direction="rtl">
          <ShadcnInputTags label="Topics" value={value} onValueChange={setValue} />
        </DirectionProvider>
      );
    }
    const { container } = render(<Example />);
    await user.click(screen.getByRole('combobox', { name: 'Topics' }));
    await user.keyboard('{ArrowRight}');
    expect(container.querySelectorAll('.reacd-tags-chip')[1]).toHaveFocus();
    await user.keyboard('{Delete}');
    expect(screen.queryByRole('button', { name: 'Remove Vue' })).toBeNull();
  });
  it('commits paste atomically and retains rejected draft data', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<readonly string[]>([]);
      return (
        <ShadcnInputTags
          label="Topics"
          value={value}
          onValueChange={setValue}
          maxTags={2}
          maxTagLength={5}
          addOnPaste
          delimiters={['comma', 'newline']}
        />
      );
    }
    render(<Example />);
    const input = screen.getByRole('combobox', { name: 'Topics' });
    await user.click(input);
    await user.paste('Vue,東京');
    expect(input).toHaveValue('');
    await user.paste('Svelte,Node');
    expect(screen.getByRole('alert')).toHaveTextContent('maximum number');
    expect(input).toHaveValue('Svelte,Node');
    expect(screen.queryByRole('button', { name: 'Remove Node' })).toBeNull();
    await user.clear(input);
    await user.type(input, 'Vue{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('maximum number');
  });
  it('preserves a proposed draft when a controlled host rejects it', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ShadcnInputTags label="Topics" value={[]} onValueChange={change} />);
    const input = screen.getByRole('combobox', { name: 'Topics' });
    await user.type(input, 'React{Enter}');
    expect(change).toHaveBeenLastCalledWith(['React']);
    expect(input).toHaveValue('React');
    expect(screen.queryByRole('button', { name: 'Remove React' })).toBeNull();
  });
  it('does not commit during composition and supports tab/blur commits', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState<readonly string[]>([]);
      return (
        <>
          <ShadcnInputTags
            label="Topics"
            value={value}
            onValueChange={setValue}
            addOnTab
            addOnBlur
            addOnPaste
          />
          <button type="button">After tags</button>
        </>
      );
    }
    render(<Example />);
    const input = screen.getByRole('combobox', { name: 'Topics' });
    fireEvent.compositionStart(input);
    await user.type(input, '東京');
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(screen.queryByRole('button', { name: 'Remove 東京' })).toBeNull();
    fireEvent.compositionEnd(input);
    await user.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Remove 東京' })).toBeInTheDocument();
    await user.type(input, 'Vue');
    await user.click(screen.getByRole('button', { name: 'After tags' }));
    expect(screen.getByRole('button', { name: 'Remove Vue' })).toBeInTheDocument();
  });
  it.each([{ disabled: true }, { readOnly: true }])(
    'protects existing values: %j',
    async (properties) => {
      const user = userEvent.setup();
      const change = vi.fn();
      render(
        <ShadcnInputTags
          {...properties}
          label="Topics"
          value={['React']}
          onValueChange={change}
        />,
      );
      await user.type(screen.getByRole('combobox', { name: 'Topics' }), 'Vue{Enter}');
      await user.click(screen.getByRole('button', { name: 'Remove React' }));
      expect(change).not.toHaveBeenCalled();
    },
  );
});

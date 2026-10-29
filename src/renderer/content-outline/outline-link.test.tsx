import { fireEvent, render, screen } from '@testing-library/react';
import { flushSync } from 'react-dom';
import { describe, expect, it, vi } from 'vitest';
import { OutlineLink } from './outline-link.js';
import { followHref } from '../navigation/native-navigation.js';

vi.mock('../navigation/native-navigation.js', () => ({ followHref: vi.fn() }));

function activate(element: HTMLElement, properties: MouseEventInit = {}) {
  let prevented = false;
  document.addEventListener(
    'click',
    (event) => {
      prevented = event.defaultPrevented;
      event.preventDefault();
    },
    { once: true },
  );
  fireEvent.click(element, properties);
  return prevented;
}

describe('outline native link boundary', () => {
  it('captures the destination before a logical host update', () => {
    const report = vi.fn();
    const selected = vi.fn((key: string) => {
      expect(key).toBe('guide');
      flushSync(() =>
        view.rerender(
          <OutlineLink
            label="Guide"
            itemKey="guide"
            href="/changed"
            disabled={false}
            current
            report={report}
          />,
        ),
      );
      return true;
    });
    const view = render(
      <OutlineLink
        label="Guide"
        itemKey="guide"
        href="/original"
        disabled={false}
        current={false}
        report={report}
        onCurrentChange={selected}
      />,
    );
    expect(activate(screen.getByRole('link'))).toBe(true);
    expect(selected).toHaveBeenCalledExactlyOnceWith('guide');
    expect(followHref).toHaveBeenLastCalledWith(
      new URL('/original', window.location.href).href,
    );
    expect(report).toHaveBeenLastCalledWith('');
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'location');
  });

  it.each([false, true, undefined])('honors logical decision %s', (decision) => {
    const selected = vi.fn(() => decision);
    const report = vi.fn();
    const before = vi.mocked(followHref).mock.calls.length;
    render(
      <OutlineLink
        label="Topic"
        itemKey="topic"
        href="#topic"
        disabled={false}
        current={false}
        onCurrentChange={selected}
        report={report}
      />,
    );
    expect(activate(screen.getByRole('link'))).toBe(true);
    expect(selected).toHaveBeenCalledExactlyOnceWith('topic');
    expect(vi.mocked(followHref).mock.calls.length - before).toBe(
      decision === false ? 0 : 1,
    );
    expect(report).toHaveBeenLastCalledWith('');
  });

  it('preserves native modifiers, other buttons and protected new windows', () => {
    const selected = vi.fn();
    const report = vi.fn();
    const view = render(
      <OutlineLink
        label="Native"
        itemKey="native"
        href="/native"
        disabled={false}
        current={false}
        onCurrentChange={selected}
        report={report}
      />,
    );
    for (const properties of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
      { button: 1 },
    ])
      expect(activate(screen.getByRole('link'), properties)).toBe(false);
    expect(selected).not.toHaveBeenCalled();
    view.rerender(
      <OutlineLink
        label="Native"
        itemKey="native"
        href="/native"
        newWindow
        disabled={false}
        current={false}
        onCurrentChange={selected}
        report={report}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(activate(link)).toBe(false);
    expect(selected).not.toHaveBeenCalled();
  });

  it('preserves untouched links and prior default prevention', () => {
    const report = vi.fn();
    const selected = vi.fn();
    const view = render(
      <OutlineLink
        label="Untouched"
        itemKey="native"
        href="/native"
        disabled={false}
        current={false}
        report={report}
      />,
    );
    expect(activate(screen.getByRole('link'))).toBe(false);
    view.rerender(
      <div onClickCapture={(event) => event.preventDefault()}>
        <OutlineLink
          label="Untouched"
          itemKey="native"
          href="/native"
          disabled={false}
          current={false}
          onCurrentChange={selected}
          report={report}
        />
      </div>,
    );
    expect(activate(screen.getByRole('link'))).toBe(true);
    expect(selected).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });

  it('blocks disabled links without leaking callbacks or a destination', () => {
    const selected = vi.fn();
    render(
      <OutlineLink
        label="Unavailable"
        itemKey="none"
        href="/private"
        disabled
        current={false}
        onCurrentChange={selected}
        report={vi.fn()}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(activate(link)).toBe(true);
    expect(selected).not.toHaveBeenCalled();
  });
});

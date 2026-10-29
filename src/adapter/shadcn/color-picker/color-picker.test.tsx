import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ShadcnColorPicker } from './color-picker.adapter.js';
function Host() {
  const [value, setValue] = useState('#ff000080');
  return (
    <ShadcnColorPicker
      mode="rgba"
      label="Accent"
      value={value}
      onValueChange={setValue}
      name="accent"
      description="Brand color"
      presets={[{ label: 'Blue', value: '#0000ffff' }]}
    />
  );
}
it('edits area, hue, alpha, hex and canonical form values', async () => {
  const user = userEvent.setup();
  const view = render(
    <form>
      <Host />
    </form>,
  );
  expect(screen.getAllByRole('slider')).toHaveLength(3);
  const hue = screen.getByRole('slider', { name: 'Accent hue' });
  hue.focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('textbox', { name: 'Accent hexadecimal' })).not.toHaveValue(
    '#ff000080',
  );
  const alpha = screen.getByRole('slider', { name: 'Accent alpha' });
  alpha.focus();
  await user.keyboard('{ArrowLeft}');
  await user.click(screen.getByRole('button', { name: 'Blue' }));
  const hex = screen.getByRole('textbox', { name: 'Accent hexadecimal' });
  expect(hex).toHaveValue('#0000ffff');
  await user.clear(hex);
  await user.type(hex, '#AABBCC80{Enter}');
  expect(hex).toHaveValue('#aabbcc80');
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing form');
  expect(new FormData(form).get('accent')).toBe('#aabbcc80');
  const area = within(screen.getByRole('group', { name: 'Accent' })).getAllByRole(
    'slider',
  )[0];
  area?.focus();
  await user.keyboard('{ArrowLeft}');
  expect(hex).not.toHaveValue('#aabbcc80');
});
it('preserves rejection and repairs externally changed drafts', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const view = render(
    <ShadcnColorPicker
      mode="rgb"
      label="Color"
      value="#ff0000"
      onValueChange={changed}
    />,
  );
  const hex = screen.getByRole('textbox', { name: 'Color hexadecimal' });
  const hue = screen.getByRole('slider', { name: 'Color hue' });
  hue.focus();
  await user.keyboard('{ArrowRight}');
  expect(changed).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-f]{6}$/));
  expect(hex).toHaveValue('#ff0000');
  await user.clear(hex);
  await user.type(hex, '#00ff00{Enter}');
  expect(hex).toHaveValue('#ff0000');
  await user.clear(hex);
  await user.type(hex, '#bad{Enter}');
  expect(screen.getByRole('alert')).toBeVisible();
  await user.keyboard('{Escape}');
  expect(hex).toHaveValue('#ff0000');
  view.rerender(
    <ShadcnColorPicker
      mode="rgb"
      label="Color"
      value="#0000ff"
      onValueChange={changed}
    />,
  );
  expect(hex).toHaveValue('#0000ff');
});
it('preserves readonly form values and prevents protected mutations', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  const view = render(
    <form>
      <ShadcnColorPicker
        mode="rgb"
        label="Protected"
        value="#ffffff"
        onValueChange={changed}
        readOnly
        name="color"
      />
    </form>,
  );
  const hex = screen.getByRole('textbox', { name: 'Protected hexadecimal' });
  expect(hex).toHaveAttribute('readonly');
  await user.type(hex, '123');
  expect(changed).not.toHaveBeenCalled();
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing form');
  expect(new FormData(form).get('color')).toBe('#ffffff');
  view.rerender(
    <form>
      <ShadcnColorPicker
        mode="rgb"
        label="Protected"
        value="#ffffff"
        onValueChange={changed}
        disabled
        name="color"
      />
    </form>,
  );
  expect(hex).toBeDisabled();
  expect(new FormData(form).has('color')).toBe(false);
});
it('uses an explicit private RTL i18n scope for keyboard direction', async () => {
  const user = userEvent.setup();
  render(
    <DirectionProvider dir="rtl">
      <Host />
    </DirectionProvider>,
  );
  const hue = screen.getByRole('slider', { name: 'Accent hue' });
  hue.focus();
  await user.keyboard('{End}');
  const maximum = hue.getAttribute('value') ?? '';
  await user.keyboard('{ArrowRight}');
  expect(Number(hue.getAttribute('value'))).toBeLessThan(Number(maximum));
});

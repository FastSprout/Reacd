import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ColorPicker } from './color-picker.js';
import { RenderContext } from '../shared/port.js';
import { colorPickerEntries } from '../../adapter/shadcn/registry/color-picker.js';
import { colorPickerVariables } from '../../renderer/theme/color-picker-variables.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
it('hydrates deterministic closed SSR output with explicit RTL direction', () => {
  const changed = vi.fn();
  const tree = (
    <DirectionProvider dir="rtl">
      <RenderContext.Provider
        value={{
          render: (_name, props) => colorPickerEntries.ColorPicker.render(props),
          report: (issues) => <Issues issues={issues} />,
        }}
      >
        <ColorPicker
          mode="rgba"
          label="Color"
          value="#11223380"
          onValueChange={changed}
        />
      </RenderContext.Provider>
    </DirectionProvider>
  );
  const server = renderToString(tree);
  const container = document.createElement('div');
  container.innerHTML = server;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('group', { name: 'Color' })).toHaveAttribute('dir', 'rtl');
  expect(screen.getByRole('textbox')).toHaveValue('#11223380');
  expect(changed).not.toHaveBeenCalled();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
  expect(renderToString(tree)).toBe(server);
  expect(colorPickerVariables()['--reacd-color-thumb-light']).toBe('#ffffff');
});

import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { ColorPicker } from './color-picker.js';
import { RenderContext } from '../shared/port.js';
import { colorPickerSchema } from '../../schema/color-picker/index.js';
import { renderEntry } from '../../renderer/contracts/render-entry.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
const entry = renderEntry(
  'ColorPicker',
  colorPickerSchema,
  ({ label, value }) => `${label}: ${value}`,
);
it('preserves validated declaration output during hydration', () => {
  const changed = vi.fn();
  const tree = (
    <RenderContext.Provider
      value={{
        render: (_name, props) => entry.render(props),
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
  expect(screen.getByText('Color: #11223380')).toBeVisible();
  expect(changed).not.toHaveBeenCalled();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
  expect(renderToString(tree)).toBe(server);
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

function createDeclaration(controlled: boolean) {
  const open = { state: 'hint', mode: 'readWrite' } as const;
  return defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [
      { key: 'visible', kind: 'boolean', initial: true, access: 'readWrite' },
      { key: 'hint', kind: 'boolean', initial: true, access: 'readWrite' },
    ],
    root: {
      type: 'VStack',
      children: [
        {
          type: 'Tooltip',
          text: 'Hydrated hint',
          ...(controlled ? { open } : {}),
          children: [
            {
              type: 'Chip',
              label: 'Online',
              show: { state: 'visible', mode: 'read' },
              children: [{ type: 'Text', content: 'Hydrated identity' }],
            },
          ],
        },
        {
          type: 'Checkbox',
          label: 'Show hydrated indicator',
          checked: { state: 'visible', mode: 'readWrite' },
        },
      ],
    },
  });
}
describe('Chip and Tooltip SSR hydration', () => {
  it.each([false, true])(
    'hydrates controlled=%s and isolates edits',
    async (controlled) => {
      const declaration = createDeclaration(controlled);
      const user = userEvent.setup();
      const container = document.createElement('div');
      container.innerHTML = renderToString(
        <GenerativeUI adapter={shadcnAdapter} document={declaration} />,
      );
      expect(container.querySelector('[role="tooltip"]')).toBeNull();
      document.body.appendChild(container);
      const errors: unknown[] = [];
      const view = render(
        <GenerativeUI adapter={shadcnAdapter} document={declaration} />,
        {
          container,
          hydrate: true,
          onRecoverableError: (error) => errors.push(error),
        },
      );
      expect(screen.getByRole('img', { name: 'Online' })).toBeInTheDocument();
      if (controlled) {
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Hydrated hint');
        await user.keyboard('{Escape}');
      }
      await user.click(screen.getByLabelText('Show hydrated indicator'));
      expect(screen.queryByRole('img')).toBeNull();
      expect(
        renderToString(<GenerativeUI adapter={shadcnAdapter} document={declaration} />),
      ).toContain('Online');
      expect(errors).toEqual([]);
      view.unmount();
      container.remove();
    },
  );
});

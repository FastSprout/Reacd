import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  defineGenerativeDeclaration,
  validateGenerativeDocument,
} from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

const document = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [],
  root: {
    type: 'VStack',
    children: [
      { type: 'Avatar', name: 'Example Reader', src: '/avatar.png' },
      {
        type: 'AvatarGroup',
        label: 'Reviewers',
        max: 1,
        items: [
          { id: 'a', name: 'Example Editor' },
          { id: 'b', name: 'Example Reviewer' },
        ],
      },
    ],
  },
});
describe('generative avatars', () => {
  it('shares identity contracts, overflow disclosure, and host updates', async () => {
    const user = userEvent.setup();
    const view = render(<GenerativeUI adapter={shadcnAdapter} document={document} />);
    expect(screen.getByRole('img', { name: 'Example Reader' })).toBeInTheDocument();
    await user.click(screen.getByText('Show 1 more person'));
    expect(screen.getByText('Example Reviewer', { exact: true })).toBeVisible();
    view.rerender(
      <GenerativeUI
        adapter={shadcnAdapter}
        document={{
          ...document,
          root: { type: 'Avatar', name: 'Replacement', fallback: 'RP' },
        }}
      />,
    );
    expect(screen.getByRole('img', { name: 'Replacement' })).toHaveTextContent('RP');
  });
  it('rejects unsafe sources and missing identity properties', () => {
    for (const root of [
      { type: 'Avatar', name: '', src: '/image.png' },
      { type: 'Avatar', name: 'Example', src: 'javascript:alert(1)' },
      { type: 'AvatarGroup', label: 'Reviewers', items: [{ id: 'a' }] },
    ])
      expect(validateGenerativeDocument({ ...document, root }).success).toBe(false);
  });
  it('hydrates fallback identities without recoverable mismatch', () => {
    const container = globalThis.document.createElement('div');
    container.innerHTML = renderToString(
      <GenerativeUI adapter={shadcnAdapter} document={document} />,
    );
    globalThis.document.body.appendChild(container);
    const errors: unknown[] = [];
    const view = render(<GenerativeUI adapter={shadcnAdapter} document={document} />, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    expect(screen.getByRole('img', { name: 'Example Reader' })).toBeInTheDocument();
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  });
});

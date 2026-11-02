import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { Text } from '../../components/text/text.js';
import { UnsupportedAdapterComponentError } from
  '../../core/unsupported-adapter-component-error.js';
import { defineThemeAdapter } from '../../renderer/contracts/validate-adapter.js';
import { GenerativeUI } from '../generative-ui/generative-ui.js';
import { ReacdProvider } from './provider.js';

describe.each([shadcnAdapter, muiAdapter])('$id missing SDK mappings', (sdk) => {
  const adapter = defineThemeAdapter({ ...sdk, components: {} });
  const error = new UnsupportedAdapterComponentError(adapter.id, 'Text');

  it('throws in application TSX without rendering a fallback', () => {
    const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() =>
        render(
          <ReacdProvider adapter={adapter}>
            <Text>Content</Text>
          </ReacdProvider>,
        ),
      ).toThrow(error);
    } finally {
      diagnostic.mockRestore();
    }
  });

  it('throws the same adapter error during server rendering', () => {
    expect(() =>
      renderToString(
        <ReacdProvider adapter={adapter}>
          <Text>Content</Text>
        </ReacdProvider>,
      ),
    ).toThrow(error);
  });

  it('preserves the exception for a valid generative declaration', () => {
    expect(() =>
      renderToString(
        <GenerativeUI
          adapter={adapter}
          document={{
            schemaVersion: '0.2',
            state: [],
            root: { type: 'Text', content: 'Content' },
          }}
        />,
      ),
    ).toThrow(error);
  });
});

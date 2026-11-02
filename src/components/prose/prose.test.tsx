import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { PROSE_DOCUMENT } from '../../../test-support/prose-document.js';
import type { ProseDocument } from '../../core/prose.js';
import { ReacdProvider } from '../../state/provider/provider.js';
import { Prose } from './prose.js';
import type { ProseProps } from './prose.props.js';

it('exposes only the typed closed document contract', () => {
  expectTypeOf<ComponentProps<typeof Prose>>().toEqualTypeOf<ProseProps>();
  expectTypeOf<keyof ProseProps>().toEqualTypeOf<'document'>();
  expectTypeOf<ProseProps['document']>().toEqualTypeOf<ProseDocument>();
});
describe.each([shadcnAdapter, muiAdapter])('$id public prose', (adapter) => {
  it('renders closed declarations and semantic server content', () => {
    const declaration = (
      <ReacdProvider adapter={adapter}>
        <Prose document={PROSE_DOCUMENT} />
      </ReacdProvider>
    );
    const view = render(declaration);
    expect(
      screen.getByRole('heading', { name: 'Heading 2', level: 2 }),
    ).toHaveAttribute('id', 'heading-2');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(view.container.querySelector('script')).toBeNull();
    const markup = renderToString(declaration);
    expect(markup).toContain('id="heading-2"');
    expect(markup).toContain('&lt;script&gt;unsafe()&lt;/script&gt;');
    expect(markup).not.toContain('<script>');
  });
});

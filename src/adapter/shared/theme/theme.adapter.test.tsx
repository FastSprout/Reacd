import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { useContext } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { describe, expect, it } from 'vitest';
import { SharedTheme } from './theme.adapter.js';
import { ReacdProvider } from '../../../state/provider/provider.js';
import { Text } from '../../../components/text/text.js';
import { ThemeVariablesContext } from '../../../renderer/theme/theme-context.js';
import { templates } from '../../../schema/design/templates.schema.js';
import { RenderContext } from '../../../components/shared/port.js';

function ContextProbe() {
  const variables = useContext(ThemeVariablesContext);
  return (
    <output>
      {Object.entries(variables)
        .filter(([key]) => key === '--reacd-text')
        .map(([, value]) => String(value))
        .join('')}
    </output>
  );
}

function InvalidDeclaration() {
  const port = useContext(RenderContext);
  return port?.report([{ path: 'Theme.child', message: 'Invalid declaration.' }]);
}

describe('scoped appearance adapter', () => {
  it('preserves fail-closed diagnostics within a theme scope', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedTheme>
          <InvalidDeclaration />
        </SharedTheme>
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid declaration.');
  });
  it('inherits provider variables and applies only closed defaults', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedTheme defaults={{ Text: { role: 'caption' } }}>
          <Text>Caption default</Text>
          <Text role="body">Explicit body</Text>
        </SharedTheme>
      </ReacdProvider>,
    );
    expect(screen.getByText('Caption default')).toHaveAttribute('data-role', 'caption');
    expect(screen.getByText('Explicit body')).toHaveAttribute('data-role', 'body');
  });

  it('inherits nested defaults and portal appearance', () => {
    const compact = templates['erp-compact'];
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedTheme defaults={{ Text: { role: 'caption' } }}>
          <SharedTheme template={compact} defaults={{ Text: { weight: 'bold' } }}>
            <Text>Nested text</Text>
            <ContextProbe />
          </SharedTheme>
          <SharedTheme>
            <Text>Inherited caption</Text>
          </SharedTheme>
        </SharedTheme>
      </ReacdProvider>,
    );
    expect(screen.getByText('Nested text')).toHaveAttribute('data-role', 'caption');
    expect(screen.getByText('Nested text')).toHaveAttribute('data-weight', 'bold');
    expect(screen.getByText('Inherited caption')).toHaveAttribute(
      'data-role',
      'caption',
    );
    expect(screen.getByText(compact.colors.text)).toBeVisible();
  });

  it('can render trusted content without an enclosing declaration port', () => {
    render(<SharedTheme>Trusted content</SharedTheme>);
    expect(screen.getByText('Trusted content')).toBeVisible();
  });
});

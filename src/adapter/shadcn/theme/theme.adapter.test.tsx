import { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShadcnTheme } from './theme.adapter.js';
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
      <ReacdProvider>
        <ShadcnTheme>
          <InvalidDeclaration />
        </ShadcnTheme>
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid declaration.');
  });
  it('inherits provider variables and applies only closed defaults', () => {
    render(
      <ReacdProvider>
        <ShadcnTheme defaults={{ Text: { role: 'caption' } }}>
          <Text>Caption default</Text>
          <Text role="body">Explicit body</Text>
        </ShadcnTheme>
      </ReacdProvider>,
    );
    expect(screen.getByText('Caption default')).toHaveAttribute('data-role', 'caption');
    expect(screen.getByText('Explicit body')).toHaveAttribute('data-role', 'body');
  });

  it('inherits nested defaults and portal appearance', () => {
    const compact = templates['erp-compact'];
    render(
      <ReacdProvider>
        <ShadcnTheme defaults={{ Text: { role: 'caption' } }}>
          <ShadcnTheme template={compact} defaults={{ Text: { weight: 'bold' } }}>
            <Text>Nested text</Text>
            <ContextProbe />
          </ShadcnTheme>
          <ShadcnTheme>
            <Text>Inherited caption</Text>
          </ShadcnTheme>
        </ShadcnTheme>
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
    render(<ShadcnTheme>Trusted content</ShadcnTheme>);
    expect(screen.getByText('Trusted content')).toBeVisible();
  });
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { jsx } from '../../jsx-runtime.js';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import { Text } from '../text/text.js';
import { Card } from '../card/card.js';
import { Grid } from '../grid/grid.js';
import { HStack } from '../h-stack/h-stack.js';
import { VStack } from '../v-stack/v-stack.js';
import { ReacdProvider } from '../../state/provider/provider.js';

describe('closed component declarations', () => {
  it('requires an explicit provider', () => {
    expect(() => renderToStaticMarkup(<Text>Missing provider</Text>)).toThrow(
      'ReacdProvider',
    );
  });

  it('renders independently declared layouts and a real shadcn Card', () => {
    const { container } = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <VStack>
          <HStack spacing="small">
            <Card spacing="large">
              <Grid columns={2}>
                <Text weight="bold">Content</Text>
              </Grid>
            </Card>
          </HStack>
        </VStack>
      </ReacdProvider>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(container.querySelector('.reacd-hstack')).toHaveStyle({
      '--reacd-gap': 'var(--reacd-small)',
    });
    expect(container.querySelector('.reacd-card')).toHaveStyle({
      '--reacd-gap': 'var(--reacd-large)',
    });
    expect(container.querySelector('.reacd-grid')).toHaveStyle({
      '--reacd-columns': '2',
    });
    expect(container.querySelector('[data-adapter="shadcn-ui"]')).toBeInTheDocument();
  });

  it('renders a Card with default spacing', () => {
    const { container } = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Card />
      </ReacdProvider>,
    );
    expect(container.querySelector('.reacd-card')).toHaveStyle({
      '--reacd-gap': 'var(--reacd-medium)',
    });
  });

  it.each(['primary', 'secondary', 'danger'] as const)(
    'maps logical Button intent %s to shadcn',
    async (intent) => {
      const press = vi.fn();
      const user = userEvent.setup();
      render(
        <ReacdProvider adapter={shadcnAdapter}>
          <Button label="Save" intent={intent} onPress={press} />
          <Button label="Disabled" disabled onPress={press} />
        </ReacdProvider>,
      );
      await user.click(screen.getByRole('button', { name: 'Save' }));
      await user.click(screen.getByRole('button', { name: 'Disabled' }));
      expect(press).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    },
  );

  it('provides labels, input intent, and typed input callbacks', async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Input label="Name" value="" onValueChange={change} />
        <Input
          label="Email"
          inputType="email"
          value=""
          required
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'A');
    expect(change).toHaveBeenCalledWith('A');
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Email')).toHaveAttribute('required');
  });

  it('preserves complete text with an accessible disclosure', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Text role="headline" lineLimit={1}>
          Headline
        </Text>
        <Text role="subheadline">Subheading</Text>
        <Text>Paragraph</Text>
        <Text role="display">42</Text>
      </ReacdProvider>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Headline');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Subheading');
    await user.click(screen.getByText('Full text'));
    expect(screen.getByText('Full text').closest('details')).toHaveAttribute('open');
  });

  it.each([
    jsx(Button, { label: 'Missing action' }),
    jsx(Input, { label: 'Name', value: '', onValueChange: 'bad' }),
    jsx(Grid, { columns: 0 }),
    jsx(Text, { children: 'Content', className: 'escape' }),
    jsx(Card, { children: createElement('div') }),
  ])('reports invalid properties before rendering the adapter', (view) => {
    render(<ReacdProvider adapter={shadcnAdapter}>{view}</ReacdProvider>);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to render this interface.',
    );
  });
});

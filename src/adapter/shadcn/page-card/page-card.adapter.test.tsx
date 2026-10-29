import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  Input,
  Page,
  PageCard,
  PageFeature,
  PageHeader,
  PageHero,
  PageSection,
  ReacdProvider,
  Section,
  Text,
} from '../../../index.js';
import { PAGE_SURFACE_VARIANTS } from '../../../core/page-presentation-policy.js';

describe('Page presentation contracts', () => {
  it('renders optional content and every region without an extra main', () => {
    render(
      <ReacdProvider>
        <Page title="Application">
          <PageHeader
            headline="Reference"
            title="Header"
            description="Header copy"
            links={<Text>Header links</Text>}
          >
            <Text>Header child</Text>
          </PageHeader>
          <PageFeature
            title="Feature"
            description="Feature copy"
            leading={<Text>Feature leading</Text>}
          >
            Feature child
          </PageFeature>
          <PageCard
            title="Card"
            description="Card copy"
            variant="solid"
            header="Card header"
            footer="Card footer"
            leading="Card leading"
            highlight
            spotlight
            intent="primary"
          >
            Card child
          </PageCard>
          <PageHero
            title="Hero"
            headline="Overview"
            description="Hero copy"
            top="Hero top"
            header="Hero header"
            footer="Hero footer"
            bottom="Hero bottom"
            links="Hero links"
            orientation="horizontal"
          >
            Hero child
          </PageHero>
          <PageSection
            title="Named section"
            description="Section copy"
            top="Section top"
            header="Section header"
            footer="Section footer"
            bottom="Section bottom"
            headline="Section headline"
            links="Section links"
            leading="Section leading"
            features="Section features"
          >
            Section child
          </PageSection>
        </Page>
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    for (const title of ['Header', 'Feature', 'Card', 'Hero', 'Named section']) {
      expect(screen.getByRole('heading', { name: title, level: 2 })).toBeVisible();
    }
    for (const content of [
      'Header links',
      'Header child',
      'Feature leading',
      'Feature child',
      'Card header',
      'Card footer',
      'Card leading',
      'Card child',
      'Hero top',
      'Hero header',
      'Hero footer',
      'Hero bottom',
      'Hero links',
      'Hero child',
      'Section top',
      'Section header',
      'Section footer',
      'Section bottom',
      'Section links',
      'Section leading',
      'Section features',
    ])
      expect(screen.getByRole('main')).toHaveTextContent(content);
  });

  it('keeps named actions separate from child controls', async () => {
    const user = userEvent.setup();
    const title = vi.fn();
    const child = vi.fn();
    render(
      <ReacdProvider>
        <PageFeature title="Run feature" onPress={title}>
          <Button label="Run child" onPress={child} />
        </PageFeature>
        <PageCard title="Read details" href="https://example.com" newWindow>
          <Button label="Independent child" onPress={child} />
        </PageCard>
        <PageFeature title="Same window" href="/" />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Run feature' }));
    expect(title).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Run child' }));
    expect(child).toHaveBeenCalledOnce();
    expect(title).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Read details' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
    expect(screen.getByRole('link', { name: 'Read details' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByRole('link', { name: 'Same window' })).not.toHaveAttribute(
      'target',
    );
  });

  it('preserves input identity and value when reordering', async () => {
    const user = userEvent.setup();
    const content = (
      <Input label="Retained value" value="Retained" onValueChange={vi.fn()} />
    );
    const view = render(
      <ReacdProvider>
        <PageHero title="Introduction" orientation="horizontal">
          {content}
        </PageHero>
      </ReacdProvider>,
    );
    const input = screen.getByRole('textbox', { name: 'Retained value' });
    input.focus();
    view.rerender(
      <ReacdProvider>
        <PageHero title="Introduction" orientation="vertical" reverse>
          {content}
        </PageHero>
      </ReacdProvider>,
    );
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input).toHaveValue('Retained');
    expect(input).toHaveFocus();
    expect(
      input.compareDocumentPosition(screen.getByRole('heading')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await user.tab();
  });

  it('omits absent slots, bounds headings and renders every closed surface', () => {
    render(
      <ReacdProvider>
        <Section title="Parent">
          <PageHeader />
          <PageFeature />
          <PageCard />
          <PageHero />
          <PageSection />
          {PAGE_SURFACE_VARIANTS.map((variant) => (
            <PageCard
              key={variant}
              title={variant}
              variant={variant}
              intent="danger"
              reverse
            />
          ))}
          <PageSection title="Nested">
            <PageFeature title="Deep feature" />
          </PageSection>
        </Section>
      </ReacdProvider>,
    );
    expect(
      screen.getByRole('heading', { name: 'Deep feature', level: 4 }),
    ).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      renderToString(
        <ReacdProvider>
          <PageHero title="Server title" />
        </ReacdProvider>,
      ),
    ).toContain('Server title');
  });
});

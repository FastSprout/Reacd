import { atom, useAtom } from 'jotai';
import { lazy } from 'react';
import { Alert, Input, Navigation, Section, VStack } from 'reacd';
import { DeferredView } from '../loading/deferred-view.js';

const LayoutExamples = lazy(() =>
  import('./layout-examples.js').then((module) => ({ default: module.LayoutExamples })),
);
const FieldExamples = lazy(() =>
  import('./field-examples.js').then((module) => ({ default: module.FieldExamples })),
);
const DataExamples = lazy(() =>
  import('./data-examples.js').then((module) => ({ default: module.DataExamples })),
);
const ActionExamples = lazy(() =>
  import('./action-examples.js').then((module) => ({ default: module.ActionExamples })),
);
const NavigationExamples = lazy(() =>
  import('./navigation-examples.js').then((module) => ({
    default: module.NavigationExamples,
  })),
);

const queryAtom = atom('');
const categoryAtom = atom('layout');
const SECTIONS = [
  {
    value: 'navigation',
    label: 'Navigation',
    terms: 'pagination page breadcrumb path link',
    View: NavigationExamples,
  },
  {
    value: 'layout',
    label: 'Layout',
    terms: 'stack grid card viewport split accordion collapsible disclosure',
    View: LayoutExamples,
  },
  {
    value: 'fields',
    label: 'Fields',
    terms: 'input textarea form select checkbox radio group choices',
    View: FieldExamples,
  },
  {
    value: 'data',
    label: 'Content and data',
    terms:
      'text code table progress avatar people chip tooltip kbd popover skeleton empty',
    View: DataExamples,
  },
  {
    value: 'actions',
    label: 'Actions and feedback',
    terms: 'button badge alert modal dialog',
    View: ActionExamples,
  },
] as const;

export function Catalog() {
  const [query, setQuery] = useAtom(queryAtom);
  const [category, setCategory] = useAtom(categoryAtom);
  const matches = SECTIONS.filter((section) =>
    `${section.label} ${section.terms}`.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = matches.find((section) => section.value === category) ?? matches[0];
  return (
    <Section
      title="Component catalog"
      description="Live examples use the same closed TSX API as applications."
    >
      <VStack>
        <Input
          label="Find components"
          inputType="search"
          value={query}
          onValueChange={setQuery}
          placeholder="Search a component family"
        />
        {selected === undefined ? (
          <Alert
            title="No matching components"
            intent="info"
            message="Try a different search term."
          />
        ) : (
          <VStack>
            <Navigation
              label="Component families"
              value={selected.value}
              items={matches.map(({ value, label }) => ({ value, label }))}
              onValueChange={setCategory}
            />
            <DeferredView label={selected.label}>
              <selected.View />
            </DeferredView>
          </VStack>
        )}
      </VStack>
    </Section>
  );
}

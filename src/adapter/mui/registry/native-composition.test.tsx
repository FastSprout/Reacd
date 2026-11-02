import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import {
  FormField,
  Input,
  PageCard,
  PageCTA,
  PageLogos,
  Pagination,
  ReacdProvider,
  Skeleton,
} from '../../../index.js';
import { muiAdapter } from '../mui.adapter.js';

const declarations = {
  FormField: (
    <FormField name="name" label="Name">
      <Input label="Name value" value="Ada" onValueChange={() => undefined} />
    </FormField>
  ),
  Skeleton: <Skeleton label="Loading profile" />,
  Pagination: (
    <Pagination
      label="Orders"
      totalItems={30}
      value={{ pageIndex: 0, pageSize: 10 }}
      onValueChange={() => undefined}
    />
  ),
  PageCard: <PageCard title="Card">Card content</PageCard>,
  PageCTA: <PageCTA title="Launch">Call-to-action content</PageCTA>,
  PageLogos: (
    <PageLogos
      label="Projects"
      items={[{ key: 'workspace', src: '/workspace.svg', alt: 'Workspace' }]}
    />
  ),
};
const nativeSelectors = {
  FormField: '.MuiFormControl-root',
  Skeleton: '.MuiSkeleton-root',
  Pagination: '.MuiPagination-root',
  PageCard: '.MuiCard-root',
  PageCTA: '.MuiPaper-root',
  PageLogos: '.MuiImageList-root',
};

it.each(Object.entries(declarations))(
  'renders registered %s through the public provider with native SDK ownership',
  (name, declaration) => {
    const view = <ReacdProvider adapter={muiAdapter}>{declaration}</ReacdProvider>;
    const rendered = render(view);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      rendered.container.querySelector('[data-adapter="material-ui"]'),
    ).not.toBeNull();
    for (const [key, selector] of Object.entries(nativeSelectors)) {
      if (key === name)
        expect(rendered.container.querySelector(selector)).not.toBeNull();
    }
    expect(renderToString(view)).toContain('data-adapter="material-ui"');
  },
);

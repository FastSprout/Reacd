import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReacdProvider, Text } from '../../index.js';
import { HeadingLevelContext } from '../../renderer/heading/heading-context.js';

describe.each([shadcnAdapter, muiAdapter])('$id text semantics', (adapter) => {
  it('preserves logical heading roles independently of font size', () => {
    render(
      <ReacdProvider adapter={adapter}>
        <Text role="headline">Document</Text>
        <Text role="subheadline">Section</Text>
        <Text role="display">120</Text>
        <Text role="caption">Caption</Text>
        <Text>Body</Text>
      </ReacdProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Document', level: 1 })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Section', level: 2 })).toBeVisible();
    expect(screen.getAllByRole('heading')).toHaveLength(2);
  });

  it('uses the current heading scope for nested text', () => {
    render(
      <ReacdProvider adapter={adapter}>
        <HeadingLevelContext value={3}>
          <Text role="headline">Nested headline</Text>
          <Text role="subheadline">Nested section</Text>
        </HeadingLevelContext>
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });
});

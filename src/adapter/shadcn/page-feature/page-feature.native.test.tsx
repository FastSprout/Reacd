import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnPageFeature } from './page-feature.adapter.js';
import { HeadingLevelContext } from '../../../renderer/heading/heading-context.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
it('keeps title actions separate and callbacks free of native events', async () => {
  const press = vi.fn();
  const child = vi.fn();
  const view = render(
    <ShadcnPageFeature
      title="Inspect"
      onPress={press}
      description="Details"
      leading="Symbol"
    >
      <button onClick={child}>Child</button>
    </ShadcnPageFeature>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Inspect');
  await userEvent.click(screen.getByRole('button', { name: 'Inspect' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
  await userEvent.click(screen.getByRole('button', { name: 'Child' }));
  expect(press).toHaveBeenCalledTimes(1);
  expect(child).toHaveBeenCalledOnce();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnPageFeature title="Inspect" onPress={press} orientation="vertical" />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Inspect' })).toBeDisabled();
});
it('uses safe native title links and bounded scoped typography', () => {
  const view = render(
    <HeadingLevelContext value={6}>
      <ShadcnPageFeature title="Reference" href="/guide/" newWindow />
    </HeadingLevelContext>,
  );
  expect(screen.getByRole('heading', { level: 6 })).toBeVisible();
  expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  view.rerender(<ShadcnPageFeature title="Reference" href="/guide/" />);
  expect(screen.getByRole('link')).not.toHaveAttribute('target');
  view.rerender(<ShadcnPageFeature title="Plain" />);
  expect(screen.getByRole('heading')).toHaveTextContent('Plain');
  view.rerender(<ShadcnPageFeature>Untitled content</ShadcnPageFeature>);
  expect(screen.queryByRole('heading')).toBeNull();
  expect(screen.getByText('Untitled content')).toBeVisible();
});

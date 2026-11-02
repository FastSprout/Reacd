import { useContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnApp } from '../app/app.adapter.js';
import { ShadcnHeader } from '../header/header.adapter.js';
import { ShadcnPage } from '../page/page.adapter.js';
import { ShellLayoutContext } from './shell-layout-context.js';
import {
  installLayout,
  resizeContainers,
} from '../../../../test-support/layout-observer.js';

function ClearHeader() {
  const { reportHeight } = useContext(ShellLayoutContext);
  return <button onClick={() => reportHeight?.(0)}>Clear header measurement</button>;
}

it('isolates measured headers by SDK application and clears removed headers', () => {
  const restore = installLayout(1440);
  const view = render(
    <>
      <ShadcnApp>
        <ShadcnHeader title="Measured header" />
        <ShadcnPage title="First page">Article</ShadcnPage>
        <ClearHeader />
      </ShadcnApp>
      <ShadcnApp>
        <ShadcnPage title="Second page">Other article</ShadcnPage>
      </ShadcnApp>
    </>,
  );
  const first = screen.getByRole('main', { name: 'First page' });
  const second = screen.getByRole('main', { name: 'Second page' });
  expect(first.style.getPropertyValue('--shell-measured-height')).toBe('400px');
  expect(second.style.getPropertyValue('--shell-measured-height')).toBe('');
  fireEvent.click(screen.getByRole('button', { name: 'Clear header measurement' }));
  expect(first.style.getPropertyValue('--shell-measured-height')).toBe('');
  resizeContainers(1200);
  expect(first.style.getPropertyValue('--shell-measured-height')).toBe('400px');
  view.rerender(
    <ShadcnApp>
      <ShadcnPage title="First page">Article</ShadcnPage>
    </ShadcnApp>,
  );
  expect(
    screen.getByRole('main').style.getPropertyValue('--shell-measured-height'),
  ).toBe('');
  view.unmount();
  resizeContainers(320);
  restore();
});

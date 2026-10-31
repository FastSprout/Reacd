import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { followHref } from '../../renderer/navigation/native-navigation.js';
import { createDocumentState } from './create-document-state.js';
import { GenerativeUI } from './generative-ui.js';

vi.mock('../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));
it('keeps rejected shared-state pages on the current route', async () => {
  const user = userEvent.setup();
  const document = defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [
      {
        key: 'page',
        kind: 'pagination',
        access: 'readWrite',
        initial: { pageIndex: 0, pageSize: 10 },
      },
    ],
    root: {
      type: 'Pagination',
      label: 'Constrained linked pages',
      totalItems: 23,
      value: { state: 'page', mode: 'readWrite' },
      navigation: { href: '/orders' },
    },
  });
  const registry = createDocumentState(document);
  const lease = registry.constrain(['page'], (read) => {
    const page = read('page');
    if (!page.success) return page;
    return page.data.kind === 'pagination' && page.data.value.pageIndex <= 1
      ? { success: true, data: undefined }
      : { success: false, issues: [{ path: 'page', message: 'At most page 2.' }] };
  });
  if (!lease.success) throw new Error('Expected a valid constraint.');
  const view = render(
    <GenerativeUI adapter={shadcnAdapter} document={document} registry={registry} />,
  );
  await user.click(screen.getByRole('link', { name: 'Last page' }));
  expect(followHref).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('At most page 2.');
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  await user.click(screen.getByRole('link', { name: 'Next page' }));
  expect(followHref).toHaveBeenCalledExactlyOnceWith(
    expect.stringContaining('/orders?page=2&pageSize=10'),
  );
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  expect(screen.queryByRole('alert')).toBeNull();
  view.unmount();
  lease.data();
});

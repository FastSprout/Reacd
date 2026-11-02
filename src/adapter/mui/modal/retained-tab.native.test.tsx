import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import TextField from '@mui/material/TextField';
import { expect, it } from 'vitest';
import { MuiTabs } from '../tabs/tabs.adapter.js';
import { MuiModal } from './modal.adapter.js';

function RetainedTabs() {
  const [tab, setTab] = useState('first');
  return <>
    <button onClick={() => setTab('first')}>Host first</button>
    <MuiTabs label="Panels" activationMode="manual" value={tab}
      onValueChange={setTab} items={[
      { value: 'first', label: 'First' },
      { value: 'second', label: 'Second', content: (
        <MuiModal title="Retained" description="Details" open retainContent
          onOpenChange={() => undefined}>
          <TextField label="Draft" defaultValue="Retained value" />
        </MuiModal>
      ) },
    ]} />
  </>;
}
it('keeps a manual tab inactive when the native Modal restores focus', async () => {
  render(<RetainedTabs />);
  await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
  const draft = await screen.findByRole('textbox', { name: 'Draft' });
  await userEvent.type(draft, ' edited');
  fireEvent.click(screen.getByText('Host first'));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByRole('tab', { name: 'First' }))
    .toHaveAttribute('aria-selected', 'true');
  expect(draft.isConnected).toBe(true);
  await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
  expect(await screen.findByRole('textbox', { name: 'Draft' }))
    .toHaveValue('Retained value edited');
});

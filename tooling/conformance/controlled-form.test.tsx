import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { atom, useAtom } from 'jotai';
import { expect, it, vi } from 'vitest';
import {
  Checkbox,
  Form,
  Input,
  ReacdProvider,
  Select,
  Slider,
  SubmitButton,
  Text,
  TextArea,
} from '@fastsprout/reacd';

it('submits the original mixed profile controls after paste interactions', async () => {
  const nameAtom = atom('');
  const emailAtom = atom('');
  const notesAtom = atom('');
  const roleAtom = atom('viewer');
  const updatesAtom = atom(false);
  const volumeAtom = atom(50);
  const statusAtom = atom('Changes stay in this local preview.');
  const submit = vi.fn();
  function Profile() {
    const [name, setName] = useAtom(nameAtom);
    const [email, setEmail] = useAtom(emailAtom);
    const [notes, setNotes] = useAtom(notesAtom);
    const [role, setRole] = useAtom(roleAtom);
    const [updates, setUpdates] = useAtom(updatesAtom);
    const [volume, setVolume] = useAtom(volumeAtom);
    const [status, setStatus] = useAtom(statusAtom);
    return (
      <Form
        label="Example profile"
        onSubmit={() => {
          submit(name, email, role);
          setStatus(`Saved locally: ${name}, ${email}, ${role}.`);
        }}
      >
        <Input label="Name" value={name} required onValueChange={setName} />
        <Input
          label="Email"
          inputType="email"
          value={email}
          required
          onValueChange={setEmail}
        />
        <TextArea label="Notes" value={notes} onValueChange={setNotes} />
        <Select
          label="Role"
          value={role}
          items={[
            { value: 'viewer', label: 'Viewer' },
            { value: 'editor', label: 'Editor' },
          ]}
          onValueChange={setRole}
        />
        <Checkbox
          label="Receive updates"
          checked={updates}
          onCheckedChange={setUpdates}
        />
        <Slider
          label="Volume"
          value={volume}
          min={0}
          max={100}
          step={10}
          onValueChange={setVolume}
        />
        <SubmitButton label="Save example" />
        <Text role="caption">{status}</Text>
      </Form>
    );
  }
  render(
    <ReacdProvider>
      <Profile />
    </ReacdProvider>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByLabelText('Name'));
  await user.paste('Example');
  await user.click(screen.getByLabelText('Email'));
  await user.paste('example@example.com');
  await user.click(screen.getByLabelText('Notes'));
  await user.paste('Notes');
  await user.click(screen.getByText('Receive updates'));
  await user.click(screen.getByRole('button', { name: 'Save example' }));
  await waitFor(() =>
    expect(submit).toHaveBeenCalledExactlyOnceWith(
      'Example',
      'example@example.com',
      'viewer',
    ),
  );
  expect(
    screen.getByText('Saved locally: Example, example@example.com, viewer.'),
  ).toBeInTheDocument();
});

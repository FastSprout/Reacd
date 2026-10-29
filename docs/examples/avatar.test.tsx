import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { AvatarExample } from './avatar.js';

describe('documented Avatar example', () => {
  it('edits names, fallbacks, sizes, and image modes', async () => {
    const user = userEvent.setup();
    const view = render(
      <ReacdProvider>
        <AvatarExample />
      </ReacdProvider>,
    );
    await user.clear(screen.getByLabelText('Avatar name'));
    expect(screen.getByRole('img', { name: 'Example Reader' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Avatar name'), 'Example Editor');
    await user.type(screen.getByLabelText('Avatar fallback text'), 'EE');
    for (const size of ['Small', 'Large', 'Medium']) {
      await user.click(screen.getByRole('combobox', { name: 'Avatar size' }));
      await user.click(await screen.findByRole('option', { name: size }));
      expect(screen.getByRole('combobox', { name: 'Avatar size' }))
        .toHaveTextContent(size);
    }
    for (const mode of [
      'Local placeholder image',
      'Undecodable image',
      'Initials only',
    ]) {
      await user.click(screen.getByRole('combobox', { name: 'Avatar source' }));
      await user.click(await screen.findByRole('option', { name: mode }));
      expect(screen.getByRole('combobox', { name: 'Avatar source' }))
        .toHaveTextContent(mode);
      const image = view.container.querySelector('img');
      if (image !== null) fireEvent.error(image);
    }
    expect(screen.getByRole('img', { name: 'Example Editor' })).toHaveTextContent('EE');
  });
});

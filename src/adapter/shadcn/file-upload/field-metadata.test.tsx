import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ShadcnFileUpload } from './file-upload.adapter.js';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
it('inherits field protection, names and feedback without duplicate messages', () => {
  render(
    <FieldMetadataContext.Provider
      value={{
        name: 'parent-files',
        required: true,
        disabled: true,
        error: 'Server rejected these files.',
        descriptionIds: ['server-error'],
      }}
    >
      <p id="server-error" role="alert">
        Server rejected these files.
      </p>
      <ShadcnFileUpload label="Files" value={[]} onValueChange={vi.fn()} />
    </FieldMetadataContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'Choose files' })).toBeDisabled();
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  expect(screen.getByRole('group', { name: 'Files' })).toHaveAttribute(
    'aria-describedby',
    'server-error',
  );
  expect(screen.getByRole('group', { name: 'Files' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

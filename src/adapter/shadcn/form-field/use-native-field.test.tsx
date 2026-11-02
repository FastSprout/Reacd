import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useNativeField } from './use-native-field.js';
import { FormPendingContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';

function Probe() {
  const field = useNativeField({});
  return <output>{`${field.disabled}:${field.blocked}`}</output>;
}
it('excludes inactive fields from native participation', () => {
  render(
    <PortalActiveContext.Provider value={false}>
      <Probe />
    </PortalActiveContext.Provider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('true:true');
});

it('blocks pending interaction without native disabling', () => {
  render(<FormPendingContext value={true}><Probe /></FormPendingContext>);
  expect(screen.getByRole('status')).toHaveTextContent('false:true');
});

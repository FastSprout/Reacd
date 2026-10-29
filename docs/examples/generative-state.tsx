import { GenerativeUI, defineGenerativeDeclaration } from 'reacd/generative';

const KEYS = { name: 'customer.name', status: 'service.status' } as const;
const INITIAL_STATUS = 'Waiting for host refresh.';
const REFRESHED_STATUS = 'Refreshed by host.';

export const SHARED_STATE_DOCUMENT = defineGenerativeDeclaration({
  schemaVersion: '0.2',
  state: [
    { key: KEYS.name, kind: 'text', initial: '', access: 'readWrite' },
    { key: KEYS.status, kind: 'text', initial: INITIAL_STATUS, access: 'read' },
  ],
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Input',
        label: 'Customer name',
        value: { state: KEYS.name, mode: 'readWrite' },
      },
      {
        type: 'Input',
        label: 'Same customer name',
        value: { state: KEYS.name, mode: 'readWrite' },
      },
      { type: 'Text', content: { state: KEYS.name, mode: 'read' } },
      { type: 'Text', content: { state: KEYS.status, mode: 'read' } },
      { type: 'Button', label: 'Refresh status', action: 'refreshStatus' },
    ],
  },
});

export function GenerativeStateExample() {
  return (
    <GenerativeUI
      document={SHARED_STATE_DOCUMENT}
      actions={{
        refreshStatus: ({ state }) => {
          state.update(KEYS.status, REFRESHED_STATUS);
        },
      }}
    />
  );
}

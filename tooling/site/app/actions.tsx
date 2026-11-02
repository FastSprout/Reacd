import { atom, useAtom } from 'jotai';
import { Button, Toolbar, Text } from '@fastsprout/reacd';
import type { SiteActions } from './model.js';

const copyStatusAtom = atom<'idle' | 'copying' | 'copied' | 'failed'>('idle');

export function PageActions({
  source,
  actions,
}: {
  readonly source: string;
  readonly actions: SiteActions;
}) {
  const [status, setStatus] = useAtom(copyStatusAtom);
  return (
    <Toolbar label="Page actions">
      <Button
        label={status === 'copied' ? 'Copied page' : 'Copy page'}
        intent="secondary"
        disabled={status === 'copying'}
        onPress={() => {
          setStatus('copying');
          void actions.copyText(source).then(
            () => setStatus('copied'),
            () => setStatus('failed'),
          );
        }}
      />
      {status === 'failed' && <Text>Copy failed. Try again.</Text>}
    </Toolbar>
  );
}

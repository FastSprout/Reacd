import { atom, useAtom } from 'jotai';
import { FormPortalExample } from './form-portal-example.js';
import { App, Section, Toggle, VStack } from 'reacd';
import { AuthFormExample } from '../../docs/examples/auth-form.js';
import { PageLogosExample } from '../../docs/examples/page-logos.js';

const rtlAtom = atom(false);

export function AuthMediaExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Auth and media components">
      <Toggle label="Auth media RTL" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'} language="en">
        <VStack>
          <AuthFormExample />
          <PageLogosExample />
          <FormPortalExample />
        </VStack>
      </App>
    </Section>
  );
}

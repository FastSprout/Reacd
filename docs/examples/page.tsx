import { atom, useAtom } from 'jotai';
import {
  Input,
  Page,
  PageAside,
  PageLinks,
  PageSection,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const draftAtom = atom('');
const sidesAtom = atom(true);

export function PageExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  const [sides, setSides] = useAtom(sidesAtom);
  return (
    <VStack>
      <Toggle
        label="Show page side regions"
        checked={sides}
        onCheckedChange={setSides}
      />
      <Page
        title="Three-region page"
        subtitle="All regions remain available on mobile."
        anchor="three-region-page"
        left={
          sides ? (
            <PageAside label="Example page left region">
              <Text>Left navigation region</Text>
            </PageAside>
          ) : undefined
        }
        right={
          sides ? (
            <PageLinks
              label="Example page right region"
              links={[
                {
                  key: 'body',
                  label: 'Read page body target',
                  href: '#page-body-target',
                },
              ]}
            />
          ) : undefined
        }
      >
        <PageSection title="Page body target" anchor="page-body-target">
          <Input
            label="Three-region page draft"
            value={draft}
            onValueChange={setDraft}
          />
        </PageSection>
      </Page>
    </VStack>
  );
}

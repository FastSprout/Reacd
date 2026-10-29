import { atom, useAtom } from 'jotai';
import { ContentToc, PageSection, Text, Toggle, VStack } from 'reacd';

const currentAtom = atom('');
const vetoAtom = atom(false);
const emptyAtom = atom(false);
const disabledAtom = atom(false);

export function ContentTocExample() {
  const [current, setCurrent] = useAtom(currentAtom);
  const [veto, setVeto] = useAtom(vetoAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  return (
    <VStack>
      <Toggle
        label="Veto outline activation"
        checked={veto}
        onCheckedChange={setVeto}
      />
      <Toggle label="No outline headings" checked={empty} onCheckedChange={setEmpty} />
      <Toggle
        label="Disable outline navigation"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <ContentToc
        label="On this reference page"
        items={
          empty
            ? []
            : [
                {
                  key: 'outline-intro',
                  label: 'Outline introduction',
                  children: [{ key: 'outline-details', label: 'Outline details' }],
                },
              ]
        }
        currentKey={empty ? '' : current}
        disabled={disabled}
        onCurrentChange={(key) => {
          if (veto) return false;
          setCurrent(key);
          return true;
        }}
      />
      <Text>{`Current heading: ${current || 'none'}`}</Text>
      <PageSection title="Outline introduction" anchor="outline-intro">
        <Text>The host owns the current heading; no scrollspy is implied.</Text>
      </PageSection>
      <PageSection title="Outline details" anchor="outline-details">
        <Text>Native fragment navigation keeps these headings reachable.</Text>
      </PageSection>
    </VStack>
  );
}
